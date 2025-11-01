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

export default{
    MapRowToPublic
}