const { createOrder, getAllOrders } = require('../models/orderModel')
const plans = require('../config/plans')

async function createOrderHandler(req, res) {
  const { plan_id, payment_mode = 'bank' } = req.body || {}
  const plan = typeof plan_id === 'string' && Object.hasOwn(plans, plan_id) ? plans[plan_id] : null

  if (!plan || payment_mode !== 'bank') {
    return res.status(400).json({ message: 'Choose a valid plan. Only offline payment arrangements are currently available.' })
  }

  const order = await createOrder({
    user_id: req.user.id,
    plan_name: plan.name,
    billing: plan.billing,
    payment_mode,
    amount: plan.amount,
    status: 'pending',
  })

  return res.status(201).json({ message: 'Order created successfully', order })
}

async function listOrders(req, res) {
  return res.json(await getAllOrders())
}

module.exports = {
  createOrderHandler,
  listOrders,
}
