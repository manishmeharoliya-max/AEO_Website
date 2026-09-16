const { test, after } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
// All writes go to an isolated temporary data store, never the project database.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zepfly-workspace-test-'))
process.env.DATA_DIR = dir
process.env.DATABASE_URL = ''
process.env.NODE_ENV = 'test'
process.env.SEED_DEMO_USERS = 'true'
process.env.ALLOW_DEMO_OTP = 'true'
process.env.EMAIL_USER = ''
process.env.EMAIL_PASS = ''
const { app } = require('../server')
let server
const ready = new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve) })
after(async () => { await new Promise(resolve => server.close(resolve)); fs.rmSync(dir, { recursive: true, force: true }) })
async function request(route, token, body, method = body ? 'POST' : 'GET') {
  await ready
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api${route}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  return { status: response.status, data: await response.json() }
}
test('checkout authentication, authoritative prices, order isolation and staff permissions', async () => {
  const tokens = {}
  for (const role of ['user', 'admin', 'superadmin']) {
    const result = await request('/auth/login', null, { email: `${role}@zepfly.com`, password: 'zepfly123' })
    assert.equal(result.status, 200); tokens[role] = result.data.token
  }
  assert.equal((await request('/orders', null, { plan_id: 'growth' })).status, 401)
  assert.equal((await request('/dashboard/admin', tokens.user)).status, 403)
  assert.equal((await request('/dashboard/superadmin', tokens.admin)).status, 403)
  const order = await request('/orders', tokens.user, { plan_id: 'growth', amount: 1, status: 'paid' })
  assert.equal(order.status, 201)
  assert.equal(order.data.order.amount, 499)
  assert.equal(order.data.order.status, 'pending')
  const starter = await request('/orders', tokens.user, { plan_id: 'starter' })
  assert.equal(starter.data.order.billing, 'one-time')
  assert.equal((await request('/orders', tokens.user, { plan_id: 'toString' })).status, 400)
  assert.equal((await request('/dashboard/user', tokens.user)).data.orders.length, 2)
  const admin = await request('/dashboard/admin', tokens.admin)
  assert.equal(admin.data.orders.length, 2)
  assert.ok(admin.data.users.every(u => u.role === 'user' && !u.password))
  assert.equal((await request('/users/1', tokens.admin, { role: 'superadmin' }, 'PUT')).status, 403)
  assert.equal((await request('/users/3', tokens.superadmin, { role: 'user' }, 'PUT')).status, 403)
  assert.equal((await request('/users/3', tokens.superadmin, null, 'DELETE')).status, 403)
  assert.equal((await request('/users/1', tokens.admin, { name: 'Updated client' }, 'PUT')).status, 200)
  assert.equal((await request('/users/1', tokens.superadmin, { role: 'admin' }, 'PUT')).status, 200)
  assert.equal((await request('/dashboard/admin', tokens.user)).status, 200)
  assert.equal((await request('/auth/signup/request-otp', null, { email: 'test@example.com', name: 'Test', role: 'superadmin' })).status, 403)
})

test('OTP signup, reset, session revocation and disabled payment gateway', async () => {
  const email = 'verified@example.com'
  const password = 'correct horse battery'
  const issued = await request('/auth/signup/request-otp', null, { email, name: 'Verified user' })
  assert.equal(issued.status, 200)
  assert.match(issued.data.demoOtp, /^\d{6}$/)
  const signup = await request('/auth/signup/verify', null, { email, name: 'Verified user', password, otp: issued.data.demoOtp })
  assert.equal(signup.status, 201)
  assert.equal(signup.data.user.role, 'user')
  const token = signup.data.token
  assert.equal((await request('/auth/me', token)).status, 200)
  const reset = await request('/auth/forgot-password/request-otp', null, { email })
  assert.equal(reset.status, 200)
  const changed = await request('/auth/forgot-password/reset', null, { email, otp: reset.data.demoOtp, password: 'new long password' })
  assert.equal(changed.status, 200)
  assert.equal((await request('/auth/me', token)).status, 401)
  const login = await request('/auth/login', null, { email, password: 'new long password' })
  assert.equal(login.status, 200)
  assert.equal((await request('/payments/confirm', login.data.token, { paymentIntentId: 'invented' })).status, 503)
  assert.equal((await request('/auth/forgot-password/reset', null, { email, otp: reset.data.demoOtp, password: 'another password' })).status, 401)
})

test('OTP attempts and authentication rate limit are enforced', async () => {
  const { issueCode, verifyCode } = require('../src/services/verificationService')
  const email = 'attempts@example.com'
  const code = await issueCode(email, 'signup')
  const wrong = code === '111111' ? '222222' : '111111'
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await assert.rejects(verifyCode(email, 'signup', wrong))
  }
  await assert.rejects(verifyCode(email, 'signup', code))
  let result
  for (let attempt = 0; attempt < 31; attempt += 1) {
    result = await request('/auth/login', null, { email: 'nobody@example.com', password: 'incorrect' })
  }
  assert.equal(result.status, 429)
})

test('public inquiries are validated, saved and visible only to staff', async () => {
  assert.equal((await request('/inquiries', null, { type: 'contact', details: {} })).status, 400)
  const response = await request('/inquiries', null, { type: 'contact', details: { name: 'Lead', email: 'lead@example.com', service: 'AEO audit', message: 'Please review our website.' } })
  assert.equal(response.status, 201)
  assert.ok(response.data.id)
  assert.equal((await request('/inquiries')).status, 401)
  const { generateToken } = require('../src/controllers/authController')
  const { getUserById } = require('../src/models/userModel')
  const token = generateToken(await getUserById(3))
  const inbox = await request('/inquiries', token)
  assert.equal(inbox.status, 200)
  assert.equal(inbox.data[0].details.email, 'lead@example.com')
})
