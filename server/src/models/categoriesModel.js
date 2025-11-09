import db from '../config/database.js'

/**
 * SQL table categories columns expected by this model:
 * - id (serial/int)
 * - name (text)
 * - type(text)
 * - created_at (timestamp)
 * - created_by (FK de users(id)
 * - updated_at (timestamp)
 * - update_by (FK de users(id)

/**
 * @typedef {Object} CategoriesRow
 * @property {number} id
 * @property {string} name
 * @property {string} type
 * @property {string} created_at
 * @property {number} created_by
 * @property {string} updated_at
 * @property {number} updated_by
 */

function MapRowToPublic(row){
    if (!row) return null
    const {id, name, type, created_at, created_by, updated_at, updated_by} = row
    return {id, name, type, created_at, created_by, updated_at, updated_by}
}

async function findById(id){
    const row = await db.query(`SELECT from categories WHERE id = $1 RETURNING id, name, type, created_by, updated_by, created_at, updated_at`, [id])
    return MapRowToPublic(row[0])
}

async function create(clientOrData, maybeData) {
    let data = null
    let client = null
    if(maybeData){
        client = clientOrData
        data = maybeData
    }else {
        data = clientOrData
    }

    const name = data.name
    const type = data.type
    const created_by = data.created_by
    const updated_by = data.updated_by

    const params = [name, type, created_by, updated_by]
    const sql = `INSERT INTO categories (name, type, created_by, updated_by) VALUES $1, $2, $3, $4 RETURNING id, name, type, created_by, updated_by, created_at, updated_at`
    
    const result = client ? await client.query(sql, params) : await db.query(sql, params)

    return MapRowToPublic(result.row[0])
}

async function update(id, patch){
    const keys = Object.keys(patch)
    if (keys.length === 0) findById(id)

    const allowed = ['name', 'type']
    const safeKeys = keys.filter(k => allowed.includes(k))

    const sets = safeKeys.map((k, i) => `${k} = $${i + 2}`).join(', ')
    const values = safeKeys.map(k => patch[k])

    const sql = `UPDATE cards SET ${sets} WHERE id = $1 RETURNING id, name, type, created_by, updated_by, created_at, updated_at`
    const { row } = await db.query(sql, [id, ...values])

    return MapRowToPublic(row[0] || null)
}

async function remove(id){
    await db.query('DELETE FROM categories WHERE id = $1', [id])
}

export default{
    MapRowToPublic,
    findById,
    create,
    update,
    remove,

}