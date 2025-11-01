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

export default{
    MapRowToPublic
}