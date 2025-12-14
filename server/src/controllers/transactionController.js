import db from '../config/database'
import transactionsModel  from '../models/transactionsModel.js'

const create = async (req,res)=>{
    let client = null
    try{
        client = await db.pool.connect()
        await client.query('BEGIN')
        const transaction = await transactionsModel.create(client, req.body)
        await client.query('COMMIT')
        return res.status(201).json({ message: 'Transação criada com sucesso',
            transaction: transaction
        })
    }catch (error){
        if(client) await client.query('ROLLBACK')
        console.error('Erro ao criar transação', error)
        return res.status(500).json({ error:'Erro interno do servidor' })
    }finally{
        if(client) client.release()
    }
}
const getById = async (req,res)=>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json({ error: 'ID inválido'})
        
        const transaction = await transactionsModel.findById(id)
        if(!transaction) return res.status(404).json({ error:'Transação não encontratada' }) 
        return res.status(200).json({ transaction })
    }catch (error){
        console.error('Erro ao buscar transação', error)
        return res.status(500).json({ error:'Erro interno do servidor' })
    }
}
const update = async (req,res)=>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json({ error: 'ID inválido'})
            
        const patch = req.body || {}
        const transaction = await transactionsModel.update(id, patch)
        if(!transaction) return res.status(404).json({ error: 'Transação não encontrada'})
        return res.status(200).json({ 
            message: 'Transação atualizada com sucesso',
            transaction: transaction
        })
    }catch (error){
        console.error('Erro ao atualizar transação', error)
        return res.status(500).json({ error:'Erro interno do servidor' })
    }
}
const remove = async (req,res)=>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if (!id) return res.status(400).json({ error: 'ID inválido' })
        await transactionsModel.remove(id)
        return res.status(204).send()
    }catch (error){
        console.error('Erro ao remover transação', error)
        return res.status(500).json({ error:'Erro interno do servidor' })
    }
}

export default{
    create,
    getById,
    update,
    remove,
}