const { randomUUID } = require('node:crypto');
const config = require('../config/env');
const { getPool } = require('../db/postgres');
const { db } = require('../db/local');

async function createInquiry(type, details) {
  if (config.databaseUrl) {
    const result = await getPool().query(
      'INSERT INTO inquiries (type, details) VALUES ($1, $2) RETURNING id, created_at',
      [type, JSON.stringify(details)],
    );
    return result.rows[0];
  }
  const inquiry = { id: randomUUID(), type, details, created_at: new Date().toISOString() };
  db.defaults({ inquiries: [] }).write();
  db.get('inquiries').push(inquiry).write();
  return inquiry;
}

async function listInquiries() {
  if (config.databaseUrl) {
    const result = await getPool().query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 200');
    return result.rows;
  }
  return (db.get('inquiries').value() || []).slice().reverse().slice(0, 200);
}

module.exports = { createInquiry, listInquiries };
