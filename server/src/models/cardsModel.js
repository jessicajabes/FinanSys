import db from '../config/database.js'

/**
 * SQL table cards columns expected by this model:
 * - id (serial/int)
 * - user_id (FK de users(id)
 * - description (text)
 * - bank_id (FK de bank(id))
 * - created_at (timestamp)
 * - created_by (FK de users(id)
 * - updated_at (timestamp)
 * - update_by (FK de users(id)

/**
 * @typedef {Object} CardsRow
 * @property {number} id
 * @property {number} user_id
 * @property {string} description
 * @property {number} bank_id
 * @property {string} created_at
 * @property {number} created_by
 * @property {string} updated_at
 * @property {number} updated_by
 */

function MapRowToPublic(row){
   if (!row) return null 
   const {id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by} = row
   return {id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by} 
}

async function findById(id){
    const {rows} = await db.query('SELECT id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by FROM cards WHERE id = $1',
        [id]
    )
    return MapRowToPublic(rows[0])
}

async function find(){
    const {rows} = await db.query('SELECT id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by FROM cards '
    )
    return rows.map(MapRowToPublic)
}


async function create(clientOrData, maybeData){
    let client = null
    let data = null
    if(maybeData){
        client = clientOrData
        data = maybeData
    } else {
        data = clientOrData
    }

    const user_id = data.user_id
    const description = data.description
    const bank_id = data.bank_id
    const created_by = data.created_by
    const update_by = data.update_by

    const params = [user_id, description, bank_id, created_by, update_by]

    const query = `INSERT INTO cards (user_id, description, bank_id, created_by, update_by) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, description, bank_id, created_by, update_by`

    const result = client ? await client.query(query, params) : await db.query(query, params)
    return MapRowToPublic(result.rows[0])
}

async function update(id, patch){
    const keys = Object.keys(patch)
    if (keys === 0) return findById(id)

    const allowed = ['description', 'bank_id']
    const safeKeys = keys.filter(k => allowed.includes(k))
    if (safeKeys.length === 0) return findById(id)

    const sets = safeKeys.map((k,i) => `${k} = $${i + 2}`).join(', ')
    const values = safeKeys.map(k => patch(k))

    const sql = `UPDATE cards SET ${sets} WHERE id = $1 RETURNING id, user_id, description, bank_id, created_by, update_by, created_at, update_at`
    const { rows } = await db.query(sql, [id, ...values])

    return MapRowToPublic(rows[0] || null)
}

async function remove(id){
    await db.query(`DELETE from cards WHERE id = $1`,[id])
}

export default {
    MapRowToPublic,

    findById,
    create,
    update,
    remove,
    find,
}