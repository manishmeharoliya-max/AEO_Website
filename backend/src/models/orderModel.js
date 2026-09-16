const { db, getUserById } = require('./userModel')
const config = require('../config/env')
const { getPool } = require('../db/postgres')

async function createOrder(orderData) {
  const order = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    user_id: Number(orderData.user_id),
    plan_name: orderData.plan_name,
    billing: orderData.billing,
    payment_mode: orderData.payment_mode,
    amount: Number(orderData.amount),
    status: orderData.status || 'pending',
    created_at: new Date().toISOString(),
  }

  if (config.databaseUrl) {
    try {
      const result = await getPool().query(
        'INSERT INTO orders (user_id, plan_name, billing, payment_mode, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [order.user_id, order.plan_name, order.billing, order.payment_mode, order.amount, order.status]
      )
      return result.rows[0]
    } catch (error) {
      throw error
    }
  }

  db.get('orders').push(order).write()
  return order
}

async function getUserOrders(userId) {
  const normalizedUserId = Number(userId)

  if (config.databaseUrl) {
    try {
      const result = await getPool().query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        [normalizedUserId]
      )
      return result.rows || []
    } catch (error) {
      throw error
    }
  }

  return db.get('orders').filter({ user_id: normalizedUserId }).sortBy('created_at').reverse().value() || []
}

async function getAllOrders() {
  if (config.databaseUrl) {
    try {
      const result = await getPool().query(`
        SELECT o.*, u.name, u.email, u.role
        FROM orders o
        LEFT JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
      `)
      return result.rows || []
    } catch (error) {
      throw error
    }
  }

  const allOrders = (db.get('orders').value() || []).map(async (order) => {
    const user = await getUserById(order.user_id)
    return {
      ...order,
      name: user?.name || 'Unknown user',
      email: user?.email || 'Unknown email',
      role: user?.role || 'user',
    }
  })

  return Promise.all(allOrders)
}

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
}
