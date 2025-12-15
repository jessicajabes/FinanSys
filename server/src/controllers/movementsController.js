import db from '../config/database.js'
import movementsModel from '../models/movementsModel.js'

const create = async (req, res) => {
    let client = null
    try{
        client = await db.pool.connect()
        try{
            await client.query('BEGIN')
            const newMovement = await movementsModel.create(client, req.body)
            await client.query('COMMIT')
            return res.status(201).json({
                message: 'Movimento criado com sucesso',
                movement: newMovement,
            })
        }catch(error){
            if(client) await client.query('ROLLBACK')
                console.error('Erro ao criar movimento: ', error)
                return res.status(500).json({ error: 'Erro interno do servidor' })
        }
    }catch(error){
        console.error('Erro ao criar movimento: ', error)
        return res.status(500).json({ error: 'Erro interno do servidor '})
    }finally{
        if(client) client.release()
    }
}

const update = async (req,res) =>{
    try{
        const rawId =req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json({ error: 'Id inválido'})
                  
        const patch = req.body || {}
        const movement = await movementsModel.update(id, patch)
        if(!movement) return res.status(404).json({ error: 'Movimento não encontrado'})
        
        return res.status(200).json({
            message: 'Movimento atualizado com sucesso',
            movement: movement,
        })
    }catch(error){
        console.error('Erro ao atualizar movimento', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }     
}

const getById = async (req, res) =>{
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        if(!id) return res.status(400).json({ error: 'Id inválido' })
        const movement = await movementsModel.findById(id)
        if(!movement) return res.status(404).json({ error: 'Movimento não encontrado'})
        return res.status(200).json({
            movement: movement
        })
    }catch (error){
        console.error('Erro ao buscar movimento', error)
        return res.status(500).json({ error: ' Erro interno do servidor'})
    }
}

const get = async (req, res) =>{
    try{
        const movement = await movementsModel.find()
        if(!movement) return res.status(404).json({ error: 'Movimento não encontrado'})
        return res.status(200).json({
            movement: movement
        })
    }catch (error){
        console.error('Erro ao buscar movimento', error)
        return res.status(500).json({ error: ' Erro interno do servidor'})
    }
}

const remove = async (req, res) => {
    try{
        const rawId = req.params.id || req.query.id
        const id = Number(rawId)
        await movementsModel.remove(id)
        return res.status(204).send()
    }catch(error){
        console.error( 'Erro ao deletar movimento', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

export default {
    create,
    update,
    getById,
    remove,
    get,
}