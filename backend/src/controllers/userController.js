
const { listUsers, getUserById, getUserByEmail, updateUser, deleteUser, sanitizeUser } = require('../models/userModel')

async function getUsers(req, res) {
  const users = (await listUsers()).map(sanitizeUser)
  return res.json(req.user.role === 'superadmin' ? users : users.filter(user => user.role === 'user'))
}

async function updateUserHandler(req, res) {
  const { id } = req.params
  const { name, email, role } = req.body || {}
  if (!/^\d+$/.test(id)) return res.status(400).json({ message: 'Invalid account ID' })

  const target = await getUserById(id)
  if (!target) return res.status(404).json({ message: 'User not found' })
  if (Number(id) === Number(req.user.id) && role && role !== target.role) {
    return res.status(403).json({ message: 'You cannot change your own access level' })
  }
  if (req.user.role !== 'superadmin' && (target.role !== 'user' || role !== undefined)) {
    return res.status(403).json({ message: 'Only superadmins can manage roles or privileged accounts' })
  }
  if (role !== undefined && !['user', 'admin', 'superadmin'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
  if (name !== undefined && (typeof name !== 'string' || !name.trim() || name.length > 255)) return res.status(400).json({ message: 'Name must contain 1 to 255 characters' })
  if (email !== undefined) {
    if (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.status(400).json({ message: 'Valid email is required' })
    const existing = await getUserByEmail(email)
    if (existing && existing.id !== target.id) return res.status(409).json({ message: 'Email already in use' })
  }
  const updates = {}
  if (name) updates.name = name.trim()
  if (email) updates.email = email.trim().toLowerCase()
  if (role) updates.role = role

  const user = await updateUser(Number(id), updates)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json({ user })
}

async function deleteUserHandler(req, res) {
  const { id } = req.params
  if (Number(id) === Number(req.user.id)) return res.status(403).json({ message: 'You cannot delete your own account' })
  const removed = await deleteUser(Number(id))

  if (!removed) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json({ message: 'User deleted successfully' })
}

module.exports = {
  getUsers,
  updateUserHandler,
  deleteUserHandler,
}
