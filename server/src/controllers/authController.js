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
    try{
        const { login: loginfield, password } = req.body

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
    }
}

const getById = async(req,res)=>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json( {error: 'ID inválido'} )
        
        const user = await userModel.findById(id)
        if(!user) return res.status(404).json({ error: 'ID não localizado'})

        return res.status(200).json({
            user: user
        })
    }catch ( error ){
        console.error('Erro ao buscar usuário ', error)
        res.status(500).json({ error:'Erro interno do servidor'})
    }
}

const get = async(req,res)=>{
    try{      
        const user = await userModel.find()

        return res.status(200).json({
            user: user
        })
    }catch ( error ){
        console.error('Erro ao buscar usuários ', error)
        res.status(500).json({ error:'Erro interno do servidor'})
    }
}

const remove = async(req,res)=>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json( {error: 'ID inválido'} )

        if (!req.user || req.user.id !== id) {
            return res.status(403).json({ error: 'Acesso negado: só é possível remover seu próprio usuário' })
        }

        await userModel.remove(id)
        return res.status(204).send()
    }catch ( error ){
        console.error('Erro ao remover usuário ', error)
        res.status(500).json({ error:'Erro interno do servidor'})
    }
}

const update = async (req, res) => {
    try {
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if (!id) return res.status(400).json({ error: 'ID inválido' })

        const body = req.body || {}

        const currentPassword = body.current_password
        if (!currentPassword) return res.status(400).json({ error: 'senha atual é obrigatório para atualizar o usuário' })

            const userWithHash = await userModel.findByIdWithHash(id)
            if (!userWithHash) return res.status(404).json({ error: 'Usuário não encontrado' })

            if (!req.user || req.user.id !== id) {
                return res.status(403).json({ error: 'Acesso negado: só é possível atualizar seu próprio perfil' })
            }

            const passwordOk = await bcrypt.compare(currentPassword, userWithHash.password_hash)
            if (!passwordOk) return res.status(401).json({ error: 'Senha atual inválida' })

            const patch = { ...body }

            const newEmail = body.email
            if (newEmail && newEmail !== userWithHash.email) {
                const existing = await userModel.findByEmail(newEmail)
                if (existing && existing.id && existing.id !== id) {
                    return res.status(409).json({ error: 'E-mail já está em uso por outro usuário' })
                }
            }

            if (patch.password) {
                const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
                const newHash = await bcrypt.hash(patch.password, saltRounds)
                patch.password_hash = newHash
                delete patch.password
            }

            delete patch.current_password

            const updated = await userModel.update(id, patch)
        if (!updated) return res.status(404).json({ error: 'Usuário não encontrado' })

        return res.status(200).json({ message: 'Usuário atualizado com sucesso', user: updated })
    } catch (error) {
        console.error('Erro ao atualizar usuário ', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

export default {
    register,
    login,
    getById,
    update,
    remove,
    get,
}
