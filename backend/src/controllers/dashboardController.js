const { getUserOrders, getAllOrders } = require('../models/orderModel')
const { listUsers, sanitizeUser } = require('../models/userModel')

async function getUserDashboard(req, res) {
  const orders = await getUserOrders(req.user.id)
  const latestOrder = orders[0]
  const profile = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    plan: latestOrder?.plan_name || 'No plan selected',
    status: latestOrder?.status || 'No orders',
    investment: latestOrder ? `$${Number(latestOrder.amount).toFixed(2)}` : '$0',
    progress: [],
    orders,
  }

  res.json(profile)
}


async function getAdminDashboard(req, res) {
  const users = (await listUsers()).filter((user) => user.role === 'user').map(sanitizeUser)
  const orders = (await getAllOrders()).filter((order) => order.role === 'user')

  res.json({
    summary: {
      activeClients: users.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
    },
    users,
    orders,
  })
}

async function getSuperAdminDashboard(req, res) {
  const users = (await listUsers()).map(sanitizeUser)
  const orders = await getAllOrders()
  res.json({
    summary: {
      totalUsers: users.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
    },
    users,
    orders,
  })
}

module.exports = {
  getUserDashboard,
  getAdminDashboard,
  getSuperAdminDashboard,
}
