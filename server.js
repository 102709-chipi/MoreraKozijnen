const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Health
app.get('/api/health', (_, res) => {
  res.json({ ok: true, service: 'kozijnen-site', timestamp: new Date().toISOString() });
});

// Pricing calc (simple): width (m), height (m), quantity
app.post('/api/price', (req, res) => {
  const { width, height, quantity = 1, material = 'hout', glass = 'dubbel' } = req.body || {};
  const w = Number(width);
  const h = Number(height);
  const q = Number(quantity);
  if (!w || !h || !q || w <= 0 || h <= 0 || q <= 0) {
    return res.status(400).json({ error: 'Ongeldige afmetingen of aantal.' });
  }

  const areaM2 = w * h; // m^2 per kozijn
  let basePerM2 = 250; // baseline prijs per m2
  if (material === 'kunststof') basePerM2 += 50;
  if (material === 'aluminium') basePerM2 += 120;
  if (glass === 'triple') basePerM2 += 80;

  const unitPrice = Math.round(areaM2 * basePerM2);
  const subtotal = unitPrice * q;
  const btw = Math.round(subtotal * 0.21);
  const total = subtotal + btw;
  res.json({
    areaM2: Number(areaM2.toFixed(3)),
    unitPrice,
    quantity: q,
    subtotal,
    btw,
    total,
    currency: 'EUR',
  });
});

// Send price indication email
app.post('/api/send-price', async (req, res) => {
  const { email, surfaceArea, doors, glassType, kunststofPrice, houtPrice, aluminiumPrice, subsidyTotal } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'E-mail is verplicht.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const emailBody = `
Kozijn Prijsindicatie
=====================

Oppervlakte: ${surfaceArea} m²
Aantal deuren: ${doors}
Glassoort: ${glassType}

PRIJZEN:
--------
Kunststof: ${kunststofPrice}
Hout: ${houtPrice}
Aluminium: ${aluminiumPrice}

${glassType === 'HR+++' ? `SUBSIDIE:\n--------\n${subsidyTotal}\n\n` : ''}
Deze prijsindicatie is indicatief en vrijblijvend.
Voor een exacte offerte kunt u contact met ons opnemen.

Met vriendelijke groet,
Vakman Kozijnen
    `.trim();

    const to = process.env.MAIL_TO || process.env.SMTP_USER;
    
    // Send to customer
    await transporter.sendMail({
      from: `Vakman Kozijnen <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Uw kozijn prijsindicatie',
      text: emailBody,
    });

    // Send copy to company
    await transporter.sendMail({
      from: `Vakman Kozijnen <${process.env.SMTP_USER}>`,
      to,
      subject: `Prijsindicatie verzonden naar ${email}`,
      text: emailBody,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error', err);
    res.status(500).json({ error: 'Kon e-mail niet verzenden.' });
  }
});

// Contact mail
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Naam, e-mail en bericht zijn verplicht.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.MAIL_TO || process.env.SMTP_USER;
    await transporter.sendMail({
      from: `Kozijnen Website <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `Nieuw bericht van ${name}`,
      text: `Naam: ${name}\nE-mail: ${email}\nTelefoon: ${phone || '-'}\n\nBericht:\n${message}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error', err);
    res.status(500).json({ error: 'Kon e-mail niet verzenden.' });
  }
});

// ============================================
// CUSTOMER ENDPOINTS
// ============================================

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await db.customers.getAll();
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Kon klanten niet ophalen.' });
  }
});

// Get customer by ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const result = await db.customers.getById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Klant niet gevonden.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: 'Kon klant niet ophalen.' });
  }
});

// Create new customer
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Naam en e-mail zijn verplicht.' });
    }
    
    const result = await db.customers.create({ name, email, phone, address, notes });
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Kon klant niet aanmaken.' });
  }
});

// Update customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;
    const result = await db.customers.update(req.params.id, { name, email, phone, address, notes });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Klant niet gevonden.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Kon klant niet bijwerken.' });
  }
});

// Delete customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    await db.customers.delete(req.params.id);
    res.json({ ok: true, message: 'Klant verwijderd.' });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: 'Kon klant niet verwijderen.' });
  }
});

// ============================================
// APPOINTMENT ENDPOINTS
// ============================================

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let result;
    if (start_date && end_date) {
      result = await db.appointments.getByDateRange(start_date, end_date);
    } else {
      result = await db.appointments.getAll();
    }
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Kon afspraken niet ophalen.' });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', async (req, res) => {
  try {
    const result = await db.appointments.getById(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching appointment:', err);
    res.status(500).json({ error: 'Kon afspraak niet ophalen.' });
  }
});

// Get appointments by customer
app.get('/api/customers/:id/appointments', async (req, res) => {
  try {
    const result = await db.appointments.getByCustomer(req.params.id);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customer appointments:', err);
    res.status(500).json({ error: 'Kon afspraken niet ophalen.' });
  }
});

// Create new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      customer_id, title, description, appointment_date,
      start_time, end_time, status, appointment_type,
      location, material_type, estimated_price, notes
    } = req.body;
    
    if (!customer_id || !title || !appointment_date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Verplichte velden ontbreken.' });
    }
    
    const result = await db.appointments.create({
      customer_id, title, description, appointment_date,
      start_time, end_time, status, appointment_type,
      location, material_type, estimated_price, notes
    });
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Kon afspraak niet aanmaken.' });
  }
});

// Update appointment
app.put('/api/appointments/:id', async (req, res) => {
  try {
    const {
      customer_id, title, description, appointment_date,
      start_time, end_time, status, appointment_type,
      location, material_type, estimated_price, notes
    } = req.body;
    
    const result = await db.appointments.update(req.params.id, {
      customer_id, title, description, appointment_date,
      start_time, end_time, status, appointment_type,
      location, material_type, estimated_price, notes
    });
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Kon afspraak niet bijwerken.' });
  }
});

// Update appointment status only
app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is verplicht.' });
    }
    
    const result = await db.appointments.updateStatus(req.params.id, status);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Afspraak niet gevonden.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating appointment status:', err);
    res.status(500).json({ error: 'Kon status niet bijwerken.' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    await db.appointments.delete(req.params.id);
    res.json({ ok: true, message: 'Afspraak verwijderd.' });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Kon afspraak niet verwijderen.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


