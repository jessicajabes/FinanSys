import db from '../config/database.js'
import banksModel from '../models/banksModel.js'

const create = async (req, res) => {
    let client = null
    try {
        client = await db.pool.connect()
        try {
            await client.query('BEGIN')
            const newBank = await banksModel.create(client, req.body)
            await client.query('COMMIT')
            return res.status(201).json({
                message: 'Banco criado com sucesso',
                bank: {
                    id: newBank.id,
                    user_id: newBank.user_id,
                    balance: newBank.balance,
                    description: newBank.description,
                    created_at: newBank.created_at,
                    updated_at: newBank.updated_at,
                    created_by: newBank.created_by,
                    updated_by: newBank.updated_by,
                },
            })
        } catch (error) {
            if (client) await client.query('ROLLBACK')
            console.error('Erro ao criar registro', error)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    } catch (error) {
        console.error('Erro no registro', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    } finally {
        if (client) client.release()
    }
}

    const getById = async (req, res) => {
        try {

            const rawId = req.params.id ?? req.query.id
            const id = Number(rawId)
            if (!id) return res.status(400).json({ error: 'ID inválido' })
            const bank = await banksModel.findById(id)
            if (!bank) return res.status(404).json({ error: 'Banco não encontrado' })
            return res.json({ bank })
        } catch (error) {
            console.error('Erro ao buscar banco:', error)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    }

    const get = async (req, res) => {
        try {

            const bank = await banksModel.find()
            if (!bank) return res.status(404).json({ error: 'Banco não encontrado' })
            return res.json({ bank })
        } catch (error) {
            console.error('Erro ao buscar banco:', error)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    }

    const update = async (req, res) => {
        try {
            const id = Number(req.params.id)
            if (!id) return res.status(400).json({ error: 'ID inválido' })
            const patch = req.body || {}
            const updated = await banksModel.update(id, patch)
            if (!updated) return res.status(404).json({ error: 'Banco não encontrado' })
            return res.json({ 
                message: 'Banco atualizado com sucesso', 
                bank: updated 
            })
        } catch (error) {
            console.error('Erro ao atualizar banco:', error)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    }

    const remove = async (req, res) => {
        try {
            const id = Number(req.params.id)
            if (!id) return res.status(400).json({ error: 'ID inválido' })
            await banksModel.remove(id)
            return res.status(204).send()
        } catch (error) {
            console.error('Erro ao remover banco:', error)
            return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    }


export default{
        create,
        update,
        getById,
        remove,
        get,
}