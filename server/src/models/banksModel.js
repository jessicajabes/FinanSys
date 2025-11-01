import db from '../config/database.js'

/**
 * SQL table banks columns expected by this model:
 * - id (serial/int)
 * - user_id (FK de users(id)
 * - balance (float) - saldo em conta
 * - description (text)
 * - created_at (timestamp)
 * - created_by (FK de users(id)
 * - updated_at (timestamp)
 * - update_by (FK de users(id)

/**
 * @typedef {Object} BanksRow
 * @property {number} id
 * @property {number} user_id
 * @property {Float16Array} balance
 * @property {string} description
 * @property {string} created_at
 * @property {number} created_by
 * @property {string} updated_at
 * @property {number} updated_by
 */

function MapRowToPublic(row){
    if (!row) return null
    const {id, user_id, balance, description, created_at, created_by, updated_at, updated_by} = row
    return {id, user_id, balance, description, created_at, created_by, updated_at, updated_by}
}

async function findById(id) {
    const { row } = await db.query('SELECT id, user_id, balance, description, created_at, created_by, updated_at, updated_by',[id])
    return MapRowToPublic(row[0])
}

async function create(clientOrData, maybeData){
    let client = null
    let data = null
    if (maybeData) {
        client = clientOrData
        data = maybeData
    } else {
        data = clientOrData
    }

    const user_id = data.user_id
    const balance = data.balance ?? 0
    const description = data.description
    const created_by = data.created_by
    const updated_by = data.updated_by

    const query = `INSERT INTO banks (user_id, balance, description, created_by, updated_by) VALUES ($1, $2, $3, $4, $5) RETURING id, user_id, balance, description, created_at, created_by`

    const params = [user_id, balance, description, created_by, updated_by]

    const result = client ? await client.query(query, params) : db.query(query, params)

    return MapRowToPublic(result.rows[0])
}

async function remove(id) {
    await db.query('DELETE FROM banks WHERE id = $1', [id])
}

async function update(id, patch) {
    const keys = Object.keys(patch)
    if (keys.length === 0) return findById(id)

    const allowed = ['user_id', 'balance', 'description', 'created_by', 'updated_by']
    const safeKeys = keys.filter(k => allowed.includes(k))
    if (keys.length === 0) return findById(id)

    const sets = safeKeys.map((k, i) => `${k} = $${i + 2}`).join(', ')
    const values = safeKeys.map(k => patch[k])

    const sql = `UPDATE banks SET ${sets} WHERE id = $1 RETURNING id, user_id, balance, description, created_at, created_by, updated_at, updated_by`
    const { rows } = await db.query(sql, [id, ...values])
    return MapRowToPublic(rows[0]) || null   
}

export default{
    MapRowToPublic,
    findById,
    create,
    update, 
    remove,
}