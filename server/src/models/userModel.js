import db from '../config/database.js'

/**
 * SQL table `users` columns expected by this model:
 * - id (serial/int)
 * - username (text, unique)
 * - password_hash (text)
 * - nome (text) NOT NULL
 * - telefone (text | null)
 * - email (text, unique)
 * - data_nascimento (date | null)
 * - created_at (timestamp)
 * - updated_at (timestamp)

/**
 * @typedef {Object} UserRow
 * @property {number} id
 * @property {string} username
 * @property {string} [password_hash]
 * @property {string} nome
 * @property {string|null} telefone
 * @property {string} email
 * @property {string|null} data_nascimento
 * @property {string} created_at
 * @property {string} updated_at
 */

function mapRowToPublic(row) {
  if (!row) return null
  const { id, username, nome, telefone, email, data_nascimento, created_at, updated_at } = row
  return { id, username, nome, telefone, email, data_nascimento, created_at, updated_at }
}

function mapRowWithHash(row) {
  if (!row) return null
  const { id, username, password_hash, nome, telefone, email, data_nascimento, created_at, updated_at } = row
  return { id, username, password_hash, nome, telefone, email, data_nascimento, created_at, updated_at }
}

async function findById(id) {
  const { rows } = await db.query(
    'SELECT id, username, nome, telefone, email, data_nascimento, created_at, updated_at FROM users WHERE id = $1',
    [id]
  )
  return mapRowToPublic(rows[0])
}

async function findByEmail(email) {
  const { rows } = await db.query(
    'SELECT id, username, nome, telefone, email, password_hash FROM users WHERE email = $1',
    [email]
  )
  return mapRowWithHash(rows[0])
}

async function findByUsernameOrEmail(username, email) {
  const { rows } = await db.query(
    'SELECT id, username, email FROM users WHERE username = $1 OR email = $2',
    [username, email]
  )
  return rows 
}

async function findByLogin(login) {
  const { rows } = await db.query(
    'SELECT id, username, password_hash FROM users WHERE username = $1 OR email = $1',
    [login]
  )
  return rows[0] || null
}

async function create(clientOrData, maybeData) {
  let client = null
  let data = null
  if (maybeData) {
    client = clientOrData
    data = maybeData
  } else {
    data = clientOrData
  }

  const username = data.username
  const password_hash = data.password_hash
  const nome = data.nome ?? ''
  const telefone = data.telefone ?? null
  const email = data.email
  const data_nascimento = data.data_nascimento ?? null

  const query = `INSERT INTO users (username, password_hash, nome, telefone, email, data_nascimento)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username, nome, telefone, email, data_nascimento, created_at`

  const params = [username, password_hash, nome, telefone, email, data_nascimento]

  const result = client ? await client.query(query, params) : await db.query(query, params)
  return mapRowToPublic(result.rows[0])
}

async function update(id, patch) {
  const keys = Object.keys(patch)
  if (keys.length === 0) return findById(id)


  const allowed = ['username', 'nome', 'telefone', 'email', 'data_nascimento']
  const safeKeys = keys.filter(k => allowed.includes(k))

  if (safeKeys.length === 0) return findById(id)

  const sets = safeKeys.map((k, i) => `${k} = $${i + 2}`).join(', ')
  const values = safeKeys.map(k => patch[k])

  const sql = `UPDATE users SET ${sets} WHERE id = $1 RETURNING id, username, nome, telefone, email, data_nascimento, updated_at`
  const { rows } = await db.query(sql, [id, ...values])
  return mapRowToPublic(rows[0]) || null
}

async function remove(id) {
  await db.query('DELETE FROM users WHERE id = $1', [id])
}

export default {

  mapRowToPublic,
  mapRowWithHash,

  findById,
  findByEmail,
  findByUsernameOrEmail,
  findByLogin,
  create,
  update,
  remove,
}
