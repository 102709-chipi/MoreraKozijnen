-- Database schema voor Vakman Kozijnen
-- Voer dit uit in pgAdmin om de tabellen aan te maken

-- Verwijder bestaande tabellen indien aanwezig
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Klanten tabel
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index op email voor snellere lookups
CREATE INDEX idx_customers_email ON customers(email);

-- Afspraken tabel
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'gepland', -- gepland, bevestigd, voltooid, geannuleerd
    appointment_type VARCHAR(100), -- opname, montage, adviesgesprek, etc.
    location TEXT,
    material_type VARCHAR(50), -- kunststof, hout, aluminium
    estimated_price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes voor snellere queries
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Trigger om updated_at automatisch bij te werken
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Voorbeeld data
INSERT INTO customers (name, email, phone, address, notes) VALUES
('Jan de Vries', 'jan@example.com', '06-12345678', 'Hoofdstraat 1, Amsterdam', 'Geïnteresseerd in kunststof kozijnen'),
('Maria Jansen', 'maria@example.com', '06-87654321', 'Kerkstraat 10, Utrecht', 'Wil adviesgesprek voor aluminium kozijnen');

INSERT INTO appointments (customer_id, title, description, appointment_date, start_time, end_time, status, appointment_type, location, material_type) VALUES
(1, 'Opname kozijnen', 'Meting opnemen voor nieuwe kozijnen', '2025-11-20', '10:00', '11:00', 'gepland', 'opname', 'Hoofdstraat 1, Amsterdam', 'kunststof'),
(2, 'Adviesgesprek', 'Bespreking materiaal keuzes', '2025-11-22', '14:00', '15:00', 'bevestigd', 'adviesgesprek', 'Kerkstraat 10, Utrecht', 'aluminium');
