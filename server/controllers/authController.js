import jwt from 'jsonwebtoken';
import db from '../config/database.js'
import bcrypt from 'bcryptjs';

// Gera JWT com claim userId
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )
}

const checkUserExists = async (username, email) => {
    const query = `
        SELECT username, email FROM users
        WHERE username = $1 OR email = $2`

    const result = await db.query(query, [username, email])
    return result.rows
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

        const userQuery = `INSERT INTO users (username, password_hash, nome, telefone, email, data_nascimento)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, nome, telefone, email, data_nascimento, created_at`

        const userResult = await client.query(userQuery, [username, passwordHash, nome || null, telefone || null, email, data_nascimento || null])
        const newUser = userResult.rows[0]

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

        console.log('Tentativa de login recebida:', { loginfield, hasPassword: !!password })

        client = await db.pool.connect();

        const query = `SELECT id, username, password_hash FROM users WHERE username = $1 OR email = $1`

        const result = await client.query(query, [loginfield])

        console.log('Resultado da query de login, rows:', result.rows.length)

        if (result.rows.length === 0){
            return res.status(401).json({
                error: 'Credenciais inválidas',
                message: 'Usuário ou senha incorretos.'
            })
        }

        const user = result.rows[0]

    console.log('Usuário encontrado:', { id: user?.id, username: user?.username })
    console.log('Password hash (prefix):', user?.password_hash ? user.password_hash.slice(0, 16) : null)

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
