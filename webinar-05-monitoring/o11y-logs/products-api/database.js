const { Pool } = require('pg');

// Create and export the pool
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT, 10),
});

module.exports = pool; 