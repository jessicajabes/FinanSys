import db from '../config/database.js'

/**
 * SQL table movement columns expected by this model:
 * - id (serial/int)
 * - name (text)
 * - type(text)
 * - created_at (timestamp)
 * - created_by (FK de users(id)
 * - updated_at (timestamp)
 * - update_by (FK de users(id)

/**
 * @typedef {Object} MovementRow
 * @property {number} id
 * @property {number} transactions_id
 * @property {date}   month_movement
 * @property {string} created_at
 * @property {number} created_by
 * @property {string} updated_at
 * @property {number} updated_by
 */

function MapRowToPublic(row){
    if (!row) return null
    const {id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by} = row
    return {id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by}
}

async function findById(id){
    const sql =`SELECT id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by FROM movements_calculations WHERE id = $1 RETURNING id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by`
    const { row } = await db.query(sql, [id])
    return MapRowToPublic(row)[0]
}

async function create(clientOrData, maybeData) {
    const client = null
    const data   = null
    if(maybeData){
        client = clientOrData
        data   = maybeData
    }else{
        data = clientOrData
    }

    const transactions_id = data.transactions_id
    const month_movement  = data.month_movement
    const created_by      = data.created_by
    const updated_by      = data.updated_by

    const params = [transactions_id, month_movement, created_by, updated_by]

    const sql = `INSERT INTO movements_calculations (transactions_id, month_movement, created_by, updated_by VALUES $1, $2, $3, $4) RETURNING id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by`
    const { row } = maybeData? await client.query(sql, params) : await db.query(sql, params)

    return MapRowToPublic(row[0])
}

async function update(id, patch) {
    const keys = Object.keys(patch)
    if(keys.length === 0) findById(id)

    const allowed  = ('transactions_id', 'month_movement')
    const safeKeys = keys.filter(x => x.includes(allowed))
    if(safeKeys.length === 0 ) findById(id)

    const sets   =  safeKeys.map((values, i) => `${values} = $${i + 2}`).join(', ')
    const values =  safeKeys.map(v => patch[v])

    const sql = `UPDATE movements_calculations SET ${sets} WHERE id = $1 RETURNING id, transactions_id, month_movement, created_at, created_by, updated_at, updated_by`
    const { row } = await db.query(sql, [id, ...values])

    return MapRowToPublic(row[0] || null)
}

async function remove(id){
    await db.query(`DELETE FROM movements_calculations WHERE id = $1`, [id])
}


export default{
    MapRowToPublic,
    create,
    remove,
    update,
    findById,
}