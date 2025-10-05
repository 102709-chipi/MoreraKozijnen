const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


