const fs = require('node:fs');
const path = require('node:path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcryptjs');
const config = require('../config/env');

function createLocalDatabase() {
  if (config.databaseUrl) return null;
  if (config.isProduction) throw new Error('Local storage is disabled in production.');

  const directory = process.env.DATA_DIR || path.resolve(__dirname, '../../data');
  fs.mkdirSync(directory, { recursive: true });
  const db = low(new FileSync(path.join(directory, 'zepfly.json')));
  db.defaults({ users: [], orders: [] }).write();

  if (config.seedDemoUsers && db.get('users').size().value() === 0) {
    const users = ['user', 'admin', 'superadmin'].map((role, index) => ({
      id: index + 1,
      name: `Demo ${role}`,
      email: `${role}@zepfly.com`,
      password: bcrypt.hashSync('zepfly123', 10),
      role,
      token_version: 0,
      created_at: new Date().toISOString(),
    }));
    db.set('users', users).write();
  }
  return db;
}

module.exports = { db: createLocalDatabase() };
