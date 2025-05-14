const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const fs = require('fs');

// Function to check required environment variables
const checkEnvVariables = () => {
  const requiredEnvVars = [
    'NODE_APP_PORT',
    'REDIS_PASSWORD_FILE',
    'DB_PASSWORD_FILE',
    'DB_USER',
    'DB_HOST',
    'DB_NAME',
    'DB_PORT',
    'REDIS_HOST',
    'REDIS_PORT'
  ];

  const missingVars = requiredEnvVars.filter(variable => !process.env[variable]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

// Check environment variables
checkEnvVariables();

const redisPassword = fs.readFileSync(process.env.REDIS_PASSWORD_FILE, 'utf8').trim();
const dbPassword = fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim();
const redisUrl = `redis://:${redisPassword}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`

console.log('[debug]', process.env, {redisPassword, redisUrl})

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: dbPassword,
  port: process.env.DB_PORT,
});

// Redis Connection
const redisClient = redis.createClient({
  url: redisUrl
});

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Connected to Redis');
})().catch(err => console.error('Redis connection error:', err));

const app = express();
const port = process.env.NODE_APP_PORT;

// GET /products endpoint
app.get('/products', async (req, res) => {
  try {
    // Try to get products from Redis cache
    const cachedProducts = await redisClient.get('products');
    
    if (cachedProducts) {
      console.log('Returning products from cache');
      return res.json(JSON.parse(cachedProducts));
    }
    
    // If not in cache, get from PostgreSQL
    console.log('Fetching products from database');
    const result = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id
    `);
    
    const products = result.rows;
    
    // Store in Redis cache with expiration of 60 seconds
    await redisClient.set('products', JSON.stringify(products), {
      EX: 60
    });
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await redisClient.quit();
  await pool.end();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
