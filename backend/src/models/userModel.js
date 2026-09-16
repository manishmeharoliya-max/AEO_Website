const bcrypt = require('bcryptjs');
const config = require('../config/env');
const { getPool } = require('../db/postgres');
const { db } = require('../db/local');

function sanitizeUser(user) {
  if (!user) return null
  const { password, token_version, ...safeUser } = user
  return safeUser
}

function normalizeRole(role) {
  const value = String(role || '').toLowerCase().trim()
  return ['user', 'admin', 'superadmin'].includes(value) ? value : 'user'
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) return null

  if (config.databaseUrl) {
    try {
      const result = await getPool().query('SELECT * FROM users WHERE email = $1 LIMIT 1', [normalizedEmail])
      return result.rows[0] || null
    } catch (error) {
      throw error
    }
  }

  return db.get('users').find({ email: normalizedEmail }).value() || null
}

async function getUserById(id) {
  const normalizedId = Number(id)
  if (!normalizedId) return null

  if (config.databaseUrl) {
    try {
      const result = await getPool().query('SELECT * FROM users WHERE id = $1 LIMIT 1', [normalizedId])
      return result.rows[0] || null
    } catch (error) {
      throw error
    }
  }

  return db.get('users').find({ id: normalizedId }).value() || null
}

async function listUsers() {
  if (config.databaseUrl) {
    try {
      const result = await getPool().query('SELECT * FROM users ORDER BY created_at DESC')
      return result.rows || []
    } catch (error) {
      throw error
    }
  }

  return db.get('users').value() || []
}

async function createUser({ name, email, password, role = 'user' }) {
  const safeName = String(name || '').trim()
  const normalizedEmail = normalizeEmail(email)
  const safePassword = String(password || '')

  if (!safeName || !normalizedEmail || !safePassword) {
    throw new Error('Name, email and password are required')
  }

  const existingUser = await getUserByEmail(normalizedEmail)
  if (existingUser) {
    throw new Error('User already exists with this email')
  }

  const finalRole = normalizeRole(role)
  const hashedPassword = await bcrypt.hash(safePassword, 12)

  if (config.databaseUrl) {
    try {
      const result = await getPool().query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [safeName, normalizedEmail, hashedPassword, finalRole]
      )
      return sanitizeUser(result.rows[0])
    } catch (error) {
      throw error
    }
  }

  const user = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    name: safeName,
    email: normalizedEmail,
    password: hashedPassword,
    role: finalRole,
    created_at: new Date().toISOString(),
  }

  db.get('users').push(user).write()
  return sanitizeUser(user)
}

async function updateUser(id, updates) {
  const existingUser = await getUserById(id)
  if (!existingUser) return null

  const nextUser = {
    ...existingUser,
    ...updates,
  }

  if (updates.password) {
    nextUser.password = await bcrypt.hash(String(updates.password), 12)
    nextUser.token_version = Number(existingUser.token_version || 0) + 1
  }

  if (updates.role) {
    nextUser.role = normalizeRole(updates.role)
  }

  if (updates.email) {
    nextUser.email = normalizeEmail(updates.email)
  }

  if (config.databaseUrl) {
    const fields = []
    const values = []
    let index = 1

    if (updates.name) {
      fields.push(`name = $${index}`)
      values.push(updates.name)
      index += 1
    }

    if (updates.email) {
      fields.push(`email = $${index}`)
      values.push(nextUser.email)
      index += 1
    }

    if (updates.password) {
      fields.push('token_version = token_version + 1')
      fields.push(`password = $${index}`)
      values.push(nextUser.password)
      index += 1
    }

    if (updates.role) {
      fields.push(`role = $${index}`)
      values.push(nextUser.role)
      index += 1
    }

    if (fields.length === 0) {
      return sanitizeUser(nextUser)
    }

    try {
      const result = await getPool().query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
        [...values, Number(id)]
      )
      return sanitizeUser(result.rows[0])
    } catch (error) {
      throw error
    }
  }

  db.get('users').find({ id: Number(id) }).assign(nextUser).write()
  return sanitizeUser(nextUser)
}

async function deleteUser(id) {
  const normalizedId = Number(id)
  if (!normalizedId) return false

  if (config.databaseUrl) {
    try {
      const result = await getPool().query('DELETE FROM users WHERE id = $1 RETURNING id', [normalizedId])
      return result.rowCount > 0
    } catch (error) {
      throw error
    }
  }

  const removed = db.get('users').remove({ id: normalizedId }).write()
  db.get('orders').remove({ user_id: normalizedId }).write()
  return removed.length > 0
}

module.exports = {
  db,
  sanitizeUser,
  normalizeRole,
  getUserByEmail,
  getUserById,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
}
