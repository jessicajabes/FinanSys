import jwt from 'jsonwebtoken';
import db from '../config/database.js'
import userModel from '../models/userModel.js'
import bcrypt from 'bcryptjs';

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )
}

const checkUserExists = async (username, email) => {
    return await userModel.findByUsernameOrEmail(username, email)
}

const register = async (req, res) => {
   try {

    const { username, password, nome, telefone, email, data_nascimento } = req.body;


    if (!username || !password || !email) {
      return res.status(400).json({ error: 'username, email e password são obrigatórios' })
    }

        const existingUsers = await checkUserExists(username, email)
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'Username ou email já cadastrado' })
        }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
    const passwordHash = await bcrypt.hash(password, saltRounds)


    const client = await db.pool.connect()

    try{
        await client.query('BEGIN')

        const newUser = await userModel.create(client, {
          username,
          password_hash: passwordHash,
          nome: nome || '',
          telefone: telefone || null,
          email,
          data_nascimento: data_nascimento || null,
        })

        await client.query('COMMIT')
        const token = generateToken(newUser.id)

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user: {
                id: newUser.id,
                username: newUser.username,
                nome: newUser.nome,
                telefone : newUser.telefone,
                email : newUser.email,
                data_nascimento: newUser.data_nascimento,
                created_at: newUser.created_at
            },
            token
        })

        } catch (error) {
            await client.query('ROLLBACK')
            console.error('Erro durante transação de registro:', error)
            return res.status(500).json({ error: 'Erro ao criar usuário' })
        } finally {
            client.release()
        }

    } catch (error) {
        console.error('Erro no registro', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

const login = async (req, res) => {
    let client;
    try{
        const { login: loginfield, password } = req.body

    client = await db.pool.connect();

        const user = await userModel.findByLogin(loginfield)

        if (!user){
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Usuário ou senha incorretos.'
            })
        }

        const PasswordVerification = await bcrypt.compare(password, user.password_hash)

        if (!PasswordVerification){
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Usuário ou senha incorretos.'
            })
        }

        const token = generateToken(user.id)

        res.json({
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                username: user.username,
            },
            token
        })

    } catch (error) {
        console.error('Erro no login:', error)
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Não foi possível realizar o login'
        })
    } finally {
        if (client) try { await client.release() } catch(e){}
    }
}

export default {
    register,
    login
}
