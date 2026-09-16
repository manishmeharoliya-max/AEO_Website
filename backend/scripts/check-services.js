const config = require('../src/config/env');
const { getPool, initializeDatabase, closeDatabase } = require('../src/db/postgres');
const { app } = require('../server');

async function main() {
  config.validateEnvironment();
  if (!config.databaseUrl) throw new Error('DATABASE_URL is not configured.');
  if (process.argv.includes('--initialize')) await initializeDatabase();

  await getPool().query('SELECT 1');
  const schema = await getPool().query(`
    SELECT to_regclass('public.users') IS NOT NULL AS users,
      to_regclass('public.orders') IS NOT NULL AS orders,
      to_regclass('public.verification_challenges') IS NOT NULL AS verification
  `);
  console.log('PostgreSQL connected. Schema:', schema.rows[0]);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const readiness = await fetch(`${origin}/api/ready`);
    console.log('Readiness:', readiness.status, await readiness.json());
    const response = await fetch(`${origin}/api/aeo/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' }),
    });
    const result = await response.json();
    if (!response.ok || !Number.isFinite(result.score)) {
      throw new Error(`Live AEO check failed (${response.status}): ${result.message}`);
    }
    console.log('Live AEO analysis:', { score: result.score, checks: result.checks.length, url: result.url });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => {
  console.error('Service check failed:', error.code || error.message);
  process.exitCode = 1;
}).finally(closeDatabase);
