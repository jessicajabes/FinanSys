import db from '../config/database.js'

/**
 * SQL table transactions columns expected by this model:
 * - id (serial/int)
 * - category_id (FK de categories(id))
 * - user_id (FK de users(id)
 * - description (text)
 * - amount (float)
 * - transaction_type (text)
 * - fixed_variable(text)
 * - payment_method (text)
 * - bank_id (FK de Banks(id))
 * - card_id (FK de Cards(id))
 * - start_date (date)
 * - end_date (date)
 * - created_at (timestamp)
 * - created_by (FK de users(id)
 * - updated_at (timestamp)
 * - update_by (FK de users(id)

/**
 * @typedef {Object} TransactionsRow
 * @property {number}         id
 * @property {number}         user_id
 * @property {number}         category_id
 * @property {number}         bank_id
 * @property {number}         card_id
 * @property {string}         description
 * @property {Float16Array}   amount
 * @property {string}         transaction_type
 * @property {string}         fixed_variable
 * @property {string}         payment_method
 * @property {date}           start_date
 * @property {date}           end_date
 * @property {string}         created_at
 * @property {number}         created_by
 * @property {string}         updated_at
* @property {number}          updated_by
 */

function MapRowToPublic(row){
    if (!row) return null
    const {id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by} = row
    return {id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by}
}

async function findById(id){
    const sql = `SELECT id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by FROM transactions WHERE id=$1`
    const { rows } = await db.query(sql, [id])

    return MapRowToPublic(rows[0])
}

async function find(){
    const sql = `SELECT id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by FROM transactions`
    const { rows } = await db.query(sql)

    return rows.map(MapRowToPublic)
}

async function create(clientOrData, maybeData){
    client = null
    data   = null
    if(maybeData){
        client = clientOrData
        data   = maybeData
    }else{
        data   = clientOrData
    }

    const user_id = data.user_id
    const category_id = data.category_id
    const bank_id = data.bank_id
    const card_id = data.card_id
    const description = data.description
    const amount = data.amount
    const transaction_type = data.transaction_type
    const fixed_variable = data.fixed_variable
    const payment_method = data.payment_method
    const start_date = data.start_date
    const end_date = data.end_date
    const created_by = data.created_by
    const updated_by = data.updated_by

    const params = [user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_by, updated_by]

    const sql = `INSERT INTO transactions (user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_by, updated_by) VALUES $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 RETURNING id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by`

    const { rows } = await db.query(sql, params)

    return MapRowToPublic(rows[0])
}

async function update(id, patch) {
    const keys = Object.keys(patch)
    if(keys.length === 0) findById(id)

    const allowed = ('user_id', 'category_id', 'bank_id', 'card_id', 'description', 'amount', 'transaction_type', 'fixed_variable', 'payment_method', 'start_date', 'end_date', 'updated_by')
    const safeKeys = keys.filter(allowed)
    if(safeKeys.length === 0) findById(id)

    const sets = safeKeys.map((v,i) => `${v} = $${i+2}`).join(`, `)
    const values = safeKeys.map(v => patch[v])

    const sql = `UPDATE transactions SET ${sets} WHERE id = $1 RETURNING id, user_id, category_id, bank_id, card_id, description, amount, transaction_type, fixed_variable, payment_method, start_date, end_date, created_at, created_by, updated_at, updated_by`
    const { rows } = await db.query(sql,[id, ...values])

    return MapRowToPublic(rows)
}

async function remove(id) {
    await db.query(`DELETE FROM transactions WHERE id = $1`,[id])
}

export default{
    MapRowToPublic,
    create,
    update,
    findById,
    remove,
    find,
}