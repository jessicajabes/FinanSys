import db from '../config/database.js'
import cardsModel from '../models/cardsModel.js'

const create = async(req, res) => {
    let client=null
    try{
        client = await db.pool.connect()
        try {
            await client.query('BEGIN')
            const newCard = await cardsModel.create(client, req.body)
            await client.query('COMMIT')
            return res.status(201).json({
                message: 'Banco criado com sucesso',
                card: newCard
            })
        } catch(error){
            if (client) await client.query('ROLLBACK')
            console.error('Erro ao criar registro', error)
            return res.status(500).json({
                error: 'Erro interno do servidor'
            })
        }
    } catch (error) {
        console.error('Erro no registro', error)
        return res.status(500).json({ error: 'Erro interno do servidor'})
    } finally {
        if(client) client.release()
    }
}

const getById = async(req, res) => {
    try{
        const rawId = req.params.id ?? req.query.id
        const id = Number(rawId)
        if (!id) return res.status(400).json({
            error:'ID inválido'
        }) 
        const card = await cardsModel.getById(id)
        if(!card) return res.status(404).json({
            error: "Cartão não encontrado"
        })
        return res.json({card})
    } catch(error){
        console.error('Erro ao buscar cartão', error)
        return res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}

const update = async(req,res)=>{
    try{
        const rawId = req.params.id
        const id = Number(rawId)
        if(!id) return res.status(400).json({
            error: "Id inválido"
        })
        const patch = req.body || {}
        const card = cardsModel.update(id, patch)
        if(!card) res.status(404).json({
            error: 'Banco não encontrado'
        })
        return res.json()
    }catch{
        console.error('Erro ao atualizar o cartão')
        res.status(500).json({
            error: "Erro interno do servidor"
        })
    }
}

const remove = async (req, res) => {
    try{
        const id = Number(req.params.id)
        if (!id) return res.status(400).json({ error: 'ID inválido' })
          await cardsModel.remove(id)
        return res.status(204).send()  
    }catch(error) {
        console.error('Erro ao remover cartão: ', error)
        return res.status(500).json({ error: 'Erro interno do servidor'})
    }
}

export default{
    create,
    update,
    getById,
    remove,
}