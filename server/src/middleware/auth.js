import jwt from 'jsonwebtoken'
import db from '../config/database.js'

const authenticateToken = async (req, res, next) => {
    try{


    const authHeader = req.headers['authorization'] || req.headers['Authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if(!token) {
            return res.status(401).json({
                message: 'Token de acesso necessário'
            })
        }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        const query = `SELECT id, username, nome, telefone, email, data_nascimento, created_at FROM users WHERE id = $1`

        const result = await db.query(query, [decoded.userId])

        if(result.rows.length === 0){
            return res.status(401).json({
                message: 'Token inválido'
            })
        }

        req.user = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            nome: result.rows[0].nome,
            telefone: result.rows[0].telefone,
            email: result.rows[0].email,
            data_nascimento: result.rows[0].data_nascimento,
            created_at: result.rows[0].created_at
        }
        next()


    }catch (error){
        console.error('Erro no middleware de autenticação:', error)
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Token inválido'
            })
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token inválido'
            })
         }

        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: 'Erro na verificação de autenticação'
        })
    }
}

export {
    authenticateToken
}