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
    const {row} = await db.query('SELECT id, user_id, description, bank_id, created_at, created_by, updated_at, updated_by WHERE id = $1',
        [id]
    )
    return MapRowToPublic(row[0])
}

export default {
    MapRowToPublic
}