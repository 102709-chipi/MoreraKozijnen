// Script om database schema uit te voeren op Render
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Gebruik de DATABASE_URL van Render
const DATABASE_URL = 'postgresql://kozijnen_db_user:2lGmizBR98d73urzx6ltqsY1CJubindv@dpg-d4jk6fp5pdvs739h9ao0-a.frankfurt-postgres.render.com/kozijnen_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    console.log('Verbinden met database...');
    
    // Lees het schema bestand
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Schema bestand gelezen, uitvoeren...');
    
    // Voer het schema uit
    await pool.query(schema);
    
    console.log('✓ Database schema succesvol uitgevoerd!');
    console.log('✓ Tabellen aangemaakt: customers, appointments');
    console.log('✓ Voorbeeld data toegevoegd');
    
  } catch (error) {
    console.error('❌ Fout bij opzetten database:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    console.log('Database verbinding gesloten');
  }
}

setupDatabase();
