import db from '../config/database.js'
import categoriesModel from '../models/categoriesModel.js'

const create = async (req, res) => {
    let client = null
    try {
        client = await db.pool.connect()
        try {
            await client.query('BEGIN')
            const newCategorie = await categoriesModel.create(client, req.body)
            await client.query('COMMIT')
            return res.status(201).json({
                message: 'Categoria criada com sucesso',
                categorie: newCategorie,
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

const getById = async (req,res) => {
    try{
        const rawId = req.params.id ?? req.query.id
        const id = Number(rawId)
        if (!id) return res.status(400).json({ error: 'ID inválido' })
        const categorie = await categoriesModel.findById(id)
        if (!categorie) return res.status(404).json({ error: 'Categoria não encontrada' })
        return res.json({ categorie })
    }catch (error){
        console.error('Erro ao buscar categoria', error)
        return res.status(500).json({ error: 'Erro interno do servidor'})
    }
}

const get = async (req,res) => {
    try{
        const categorie = await categoriesModel.find()
        if (!categorie) return res.status(404).json({ error: 'Categoria não encontrada' })
        return res.json({ categorie })
    }catch (error){
        console.error('Erro ao buscar categoria', error)
        return res.status(500).json({ error: 'Erro interno do servidor'})
    }
}

const update = async (req, res) => {
    try {
        const id = Number(req.params.id)
        if(!id) return res.status(400).json({ error: 'ID inválido' })
        const patch = req.body || {}
        const updated = await categoriesModel.update(id, patch)
        if (!updated) return res.status(404).json({ error: 'Categoria não encontrada' })
        return res.json({ message: 'Categoria atualizada com sucesso', categorie: updated })
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error)
        return res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

const remove = async (req, res) => {
    try{
        const id = Number(req.params.id)
        if (!id) return res.status(400).json({ error: 'ID inválido' })
        await categoriesModel.remove(id)
        return res.status(204).send()
    }catch(error){
        console.error('Erro ao remover categoria: ', error)
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