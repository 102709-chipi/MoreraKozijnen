const { Pool } = require('pg');
require('dotenv').config();

// Log environment variables (without showing password)
console.log('Database configuration:');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASS:', process.env.DB_PASS ? '***SET***' : 'NOT SET');

// Prefer a full connection string if provided (e.g. Render's "External Database URL")
let pool;
if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL connection string (connectionString)');
  // When using a hosted Render DB, require SSL but allow self-signed certs
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('Pool created with SSL: enabled (via DATABASE_URL)');
} else {
  console.log('Using individual DB_* environment variables');
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'kozijnen_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? { rejectUnauthorized: false } : false
  });
  console.log('Pool created with SSL:', pool.options && pool.options.ssl ? 'enabled' : 'disabled');
}

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

// Helper function voor queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  query,
};
