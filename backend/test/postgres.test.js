const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

test('PostgreSQL user and order persistence, reset revocation and rollback', {
  skip: process.env.RUN_POSTGRES_TESTS !== 'true',
}, async () => {
  const database = require('../src/db/postgres');
  const pool = database.getPool();
  const client = await pool.connect();
  const originalPool = database.getPool;
  try {
    await client.query('BEGIN');
    // Bind model queries to this transaction. All test rows are rolled back.
    database.getPool = () => client;
    const users = require('../src/models/userModel');
    const orders = require('../src/models/orderModel');
    const inquiries = require('../src/models/inquiryModel');
    const email = `integration-${randomUUID()}@example.invalid`;
    const user = await users.createUser({ name: 'Integration test', email, password: 'integration-test-password' });
    assert.equal(user.role, 'user');
    assert.equal(user.password, undefined);
    const order = await orders.createOrder({ user_id: user.id, plan_name: 'Starter', billing: 'one-time', payment_mode: 'bank', amount: 199 });
    assert.equal(Number(order.amount), 199);
    assert.equal((await orders.getUserOrders(user.id)).length, 1);
    await users.updateUser(user.id, { password: 'replacement-test-password' });
    assert.equal((await users.getUserById(user.id)).token_version, 1);
    await users.deleteUser(user.id);
    assert.equal((await orders.getUserOrders(user.id)).length, 0);
    const inquiry = await inquiries.createInquiry('contact', { name: 'Integration test', email });
    assert.ok(inquiry.id);
    assert.ok((await inquiries.listInquiries()).some(item => item.id === inquiry.id));
  } finally {
    await client.query('ROLLBACK');
    database.getPool = originalPool;
    client.release();
    await database.closeDatabase();
  }
});
