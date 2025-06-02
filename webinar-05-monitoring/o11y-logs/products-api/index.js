const path = require('path');

const express = require('express');
const logger = require('./logger');
const pool = require('./database');
const { assertEnvVars } = require('./env');
assertEnvVars(
  'NODE_ENV',
  'SERVICE_NAME',
  'LOKI_HOST',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DB'
);

const app = express();

// Middleware to log all requests
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
      userAgent: req.get('User-Agent')
    });
  });
  next();
});

// Error logging middleware
app.use((err, req, res, next) => {
  logger.error(`Error processing request`, {
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/health', (req, res) => {
  const status = { 
    uptime: process.uptime(),
    status: 'OK',
    timestamp: Date.now()
  };
  // error: 0,
  // warn: 1,
  // info: 2,
  // http: 3,
  // verbose: 4,
  // debug: 5,
  // silly: 6
  logger.error('Health check - ERROR', {[status + " ERROR"]: 'aaa'}, { a: 1 });
  logger.warn('Health check - WARN', {[status + " WARN"]: 'bbb'}, { b: 2 });
  logger.info('Health check - INFO', status + " INFO"), 'ccc';
  logger.http('Health check - HTTP', status + " HTTP");
  logger.verbose('Health check - VERBOSE', status);
  logger.debug('Health check - DEBUG', status);
  logger.silly('Health check - SILLY', status);

  res.status(200).json(status);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


app.get('/error', (req, res, next) => {
  logger.error('Generating sample error');
  next(new Error('Sample error'));
});

app.get('/products', async (req, res) => {
  try {
    logger.debug({ message: 'Fetching products from database' });
    const result = await pool.query('SELECT id, name, price FROM products');
    const rows = result.rows;
    logger.info({ message: 'Products fetched successfully', count: rows.length });
    res.json(rows);
  } catch (err) {
    logger.error({ message: 'Failed to fetch products', error: err.message });
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
