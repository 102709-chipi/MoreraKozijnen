// Script om alle afspraken te bekijken
const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://kozijnen_db_user:2lGmizBR98d73urzx6ltqsY1CJubindv@dpg-d4jk6fp5pdvs739h9ao0-a.frankfurt-postgres.render.com/kozijnen_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function viewAppointments() {
  try {
    console.log('Ophalen van afspraken...\n');
    
    const result = await pool.query(`
      SELECT 
        a.id,
        a.title,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.appointment_type,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone
      FROM appointments a
      LEFT JOIN customers c ON a.customer_id = c.id
      ORDER BY a.appointment_date DESC, a.start_time DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Geen afspraken gevonden');
    } else {
      console.log(`✓ ${result.rows.length} afspraken gevonden:\n`);
      
      result.rows.forEach((apt, index) => {
        console.log(`${index + 1}. ${apt.title}`);
        console.log(`   Klant: ${apt.customer_name} (${apt.customer_email})`);
        console.log(`   Datum: ${apt.appointment_date}`);
        console.log(`   Tijd: ${apt.start_time} - ${apt.end_time}`);
        console.log(`   Type: ${apt.appointment_type}`);
        console.log(`   Status: ${apt.status}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Fout:', error.message);
  } finally {
    await pool.end();
  }
}

viewAppointments();
