const express = require('express');
const cors = require('cors');
const config = require('./src/config/env');
const { initializeDatabase, getPool, closeDatabase } = require('./src/db/postgres');
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const inquiryRoutes = require('./src/routes/inquiryRoutes');
const { createAeoRouter } = require('./src/routes/aeoRoutes');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Cache-Control', 'no-store');
  next();
});
app.use(cors({
  origin: config.isProduction
    ? config.clientUrl
    : [config.clientUrl, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/ready', async (req, res) => {
  try {
    if (config.databaseUrl) await getPool().query('SELECT 1');
    res.json({ status: 'ready', storage: config.databaseUrl ? 'postgresql' : 'local-development' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/aeo', createAeoRouter());
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === '23505' ? 409 : error.status || 500;
  if (status >= 500) console.error('API request failed:', error.code || error.name);
  const message = error.code === '23505'
    ? 'This record already exists.'
    : status >= 500 ? 'Unable to complete request. Please try again.' : error.message;
  return res.status(status).json({ message });
});

async function startServer() {
  config.validateEnvironment();
  await initializeDatabase();
  const server = app.listen(config.port, () => {
    console.log(`Backend listening on port ${config.port}; storage: ${config.databaseUrl ? 'PostgreSQL' : 'local development'}`);
  });
  server.on('error', (error) => {
    console.error('Server could not start:', error.code);
    process.exitCode = 1;
    closeDatabase();
  });
  const shutdown = () => {
    const deadline = setTimeout(() => process.exit(1), 10000);
    deadline.unref();
    server.close(async () => {
      await closeDatabase();
      clearTimeout(deadline);
    });
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Startup failed:', error.code || error.message);
    process.exitCode = 1;
    closeDatabase();
  });
}
module.exports = { app, startServer };
