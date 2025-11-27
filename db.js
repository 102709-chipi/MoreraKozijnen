const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'kozijnen_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('render.com') ? {
    rejectUnauthorized: false
  } : false
});

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

// Customer queries
const customerQueries = {
  getAll: () => query('SELECT * FROM customers ORDER BY created_at DESC'),
  
  getById: (id) => query('SELECT * FROM customers WHERE id = $1', [id]),
  
  getByEmail: (email) => query('SELECT * FROM customers WHERE email = $1', [email]),
  
  create: (data) => query(
    `INSERT INTO customers (name, email, phone, address, notes) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [data.name, data.email, data.phone, data.address, data.notes]
  ),
  
  update: (id, data) => query(
    `UPDATE customers 
     SET name = $1, email = $2, phone = $3, address = $4, notes = $5 
     WHERE id = $6 
     RETURNING *`,
    [data.name, data.email, data.phone, data.address, data.notes, id]
  ),
  
  delete: (id) => query('DELETE FROM customers WHERE id = $1', [id]),
};

// Appointment queries
const appointmentQueries = {
  getAll: () => query(
    `SELECT a.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone 
     FROM appointments a 
     LEFT JOIN customers c ON a.customer_id = c.id 
     ORDER BY a.appointment_date DESC, a.start_time DESC`
  ),
  
  getById: (id) => query(
    `SELECT a.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone 
     FROM appointments a 
     LEFT JOIN customers c ON a.customer_id = c.id 
     WHERE a.id = $1`,
    [id]
  ),
  
  getByDateRange: (startDate, endDate) => query(
    `SELECT a.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone 
     FROM appointments a 
     LEFT JOIN customers c ON a.customer_id = c.id 
     WHERE a.appointment_date BETWEEN $1 AND $2 
     ORDER BY a.appointment_date, a.start_time`,
    [startDate, endDate]
  ),
  
  getByCustomer: (customerId) => query(
    `SELECT * FROM appointments 
     WHERE customer_id = $1 
     ORDER BY appointment_date DESC`,
    [customerId]
  ),
  
  create: (data) => query(
    `INSERT INTO appointments 
     (customer_id, title, description, appointment_date, start_time, end_time, 
      status, appointment_type, location, material_type, estimated_price, notes) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
     RETURNING *`,
    [
      data.customer_id, data.title, data.description, data.appointment_date,
      data.start_time, data.end_time, data.status || 'gepland',
      data.appointment_type, data.location, data.material_type,
      data.estimated_price, data.notes
    ]
  ),
  
  update: (id, data) => query(
    `UPDATE appointments 
     SET customer_id = $1, title = $2, description = $3, appointment_date = $4,
         start_time = $5, end_time = $6, status = $7, appointment_type = $8,
         location = $9, material_type = $10, estimated_price = $11, notes = $12
     WHERE id = $13 
     RETURNING *`,
    [
      data.customer_id, data.title, data.description, data.appointment_date,
      data.start_time, data.end_time, data.status, data.appointment_type,
      data.location, data.material_type, data.estimated_price, data.notes, id
    ]
  ),
  
  updateStatus: (id, status) => query(
    'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  ),
  
  delete: (id) => query('DELETE FROM appointments WHERE id = $1', [id]),
};

module.exports = {
  pool,
  query,
  customers: customerQueries,
  appointments: appointmentQueries,
};
