import db from '../config/database.js'
import transactionsModel from '../models/transactionsModel.js'
import movementsModel from '../models/movementsModel.js'

function monthStart(date) {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(date, months) {
  const d = new Date(date)
  const m = d.getMonth() + months
  return new Date(d.getFullYear(), m, 1)
}

function monthsArray(startDate, endDate) {
  const start = monthStart(startDate)
  const end = monthStart(endDate)
  const months = []
  let cursor = start
  while (cursor <= end) {
    months.push(new Date(cursor))
    cursor = addMonths(cursor, 1)
  }
  return months
}

const createTransactionWithMovements = async (data) => {
  const client = await db.pool.connect()
  try {
    await client.query('BEGIN')

    // create transaction row
    const transaction = await transactionsModel.create(client, data)

    // determine months to create movements for
    const start = data.start_date ? new Date(data.start_date) : null
    const end = data.end_date ? new Date(data.end_date) : null

    let months = []
    if (start && end) {
      months = monthsArray(start, end)
    } else if (start && !end) {
      months = [monthStart(start)]
    }

    const createdMovements = []
    for (const m of months) {
      const movement = await movementsModel.create(client, {
        transactions_id: transaction.id,
        month_movement: m.toISOString().slice(0,10),
        created_by: data.created_by || data.user_id || null,
        updated_by: data.updated_by || data.user_id || null,
      })
      createdMovements.push(movement)
    }

    await client.query('COMMIT')
    return { transaction, movements: createdMovements }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export default {
  createTransactionWithMovements,
}
