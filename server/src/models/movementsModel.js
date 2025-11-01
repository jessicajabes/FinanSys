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

export default{
    MapRowToPublic
}