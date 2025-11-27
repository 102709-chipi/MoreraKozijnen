# Database Setup met pgAdmin

Deze handleiding legt uit hoe je de PostgreSQL database opzet voor de Vakman Kozijnen applicatie met pgAdmin.

## Vereisten

- **PostgreSQL** (versie 12 of hoger) - [Download hier](https://www.postgresql.org/download/)
- **pgAdmin 4** - Wordt meestal meegeïnstalleerd met PostgreSQL

## Stap 1: PostgreSQL Installeren

1. Download PostgreSQL voor Windows
2. Voer de installer uit
3. Kies een **wachtwoord** voor de `postgres` gebruiker (onthoud dit!)
4. Kies **poort 5432** (standaard)
5. Voltooi de installatie

## Stap 2: pgAdmin Openen

1. Open **pgAdmin 4** (Start menu → PostgreSQL → pgAdmin 4)
2. Voer het master wachtwoord in (als gevraagd)
3. Je ziet de PostgreSQL server in de lijst aan de linkerkant

## Stap 3: Database Aanmaken

### Via pgAdmin Interface:

1. Klik met de rechtermuisknop op **Databases** (onder Servers → PostgreSQL)
2. Selecteer **Create** → **Database...**
3. Vul de volgende gegevens in:
   - **Database naam**: `kozijnen_db`
   - **Owner**: `postgres`
4. Klik op **Save**

### Of via Query Tool:

1. Klik met de rechtermuisknop op **PostgreSQL 15** (of je versie)
2. Selecteer **Query Tool**
3. Voer dit commando uit:
   ```sql
   CREATE DATABASE kozijnen_db;
   ```
4. Klik op de ▶️ (Execute) knop

## Stap 4: Tabellen Aanmaken

1. **Selecteer de nieuwe database**:
   - Klik op **kozijnen_db** in de lijst aan de linkerkant

2. **Open Query Tool**:
   - Klik met de rechtermuisknop op **kozijnen_db**
   - Selecteer **Query Tool**

3. **Kopieer het SQL schema**:
   - Open het bestand: `database/schema.sql`
   - Kopieer de volledige inhoud (Ctrl+A, Ctrl+C)

4. **Voer het schema uit**:
   - Plak de SQL code in de Query Tool (Ctrl+V)
   - Klik op de ▶️ (Execute/F5) knop
   - Je zou moeten zien: "Query returned successfully"

5. **Controleer de tabellen**:
   - Ververs de database (rechtsklik op kozijnen_db → Refresh)
   - Vouw uit: **Schemas** → **public** → **Tables**
   - Je zou moeten zien:
     - `customers`
     - `appointments`

## Stap 5: Data Controleren

### Bekijk klanten:

```sql
SELECT * FROM customers;
```

### Bekijk afspraken:

```sql
SELECT * FROM appointments;
```

Je zou 2 voorbeeldklanten en 2 voorbeeldafspraken moeten zien.

## Stap 6: Environment Configuratie

1. **Kopieer ENV.sample naar .env**:
   ```powershell
   Copy-Item ENV.sample .env
   ```

2. **Open .env en vul de database gegevens in**:
   ```env
   # PostgreSQL Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=kozijnen_db
   DB_USER=postgres
   DB_PASS=jouw_postgres_wachtwoord
   ```

3. **Vervang** `jouw_postgres_wachtwoord` met het wachtwoord dat je hebt gekozen tijdens installatie

## Stap 7: Test de Verbinding

Start de applicatie:

```powershell
npm start
```

Je zou moeten zien:
```
✓ Connected to PostgreSQL database
Server running on http://localhost:3000
```

Als je deze melding ziet, is de database succesvol verbonden! 🎉

## Stap 8: Test de Agenda

1. Open je browser naar: `http://localhost:3000/agenda.html`
2. Je zou de agenda moeten zien met de voorbeeldafspraken
3. Test het aanmaken van een nieuwe afspraak met de **+ Nieuwe Afspraak** knop

## Handige pgAdmin Tips

### Data Toevoegen via pgAdmin:

1. Rechtsklik op de tabel (bijv. `customers`)
2. Selecteer **View/Edit Data** → **All Rows**
3. Klik onderaan op de **+** knop om een rij toe te voegen
4. Vul de gegevens in en druk op F6 om op te slaan

### Data Exporteren:

1. Rechtsklik op de database
2. **Backup...**
3. Kies locatie en formaat
4. Klik **Backup**

### Data Importeren:

1. Rechtsklik op de database
2. **Restore...**
3. Selecteer het backup bestand
4. Klik **Restore**

## Veelvoorkomende Problemen

### "Could not connect to database"

- Controleer of PostgreSQL draait:
  - Open **Services** (Win+R → `services.msc`)
  - Zoek naar "postgresql-x64-15" (of je versie)
  - Status moet "Running" zijn
  - Als niet, rechtsklik → Start

### "Password authentication failed"

- Je hebt het verkeerde wachtwoord in `.env`
- Controleer het wachtwoord dat je bij installatie hebt ingesteld

### "Database does not exist"

- Je hebt de database nog niet aangemaakt
- Volg Stap 3 opnieuw

### Port 5432 is in gebruik

- Een ander programma gebruikt deze poort
- Wijzig de poort in pgAdmin en in `.env` naar bijvoorbeeld 5433

## Nuttige SQL Queries

### Alle afspraken van vandaag:

```sql
SELECT a.*, c.name as customer_name
FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
WHERE a.appointment_date = CURRENT_DATE
ORDER BY a.start_time;
```

### Aantal afspraken per status:

```sql
SELECT status, COUNT(*) as aantal
FROM appointments
GROUP BY status;
```

### Klanten met hun aantal afspraken:

```sql
SELECT c.name, c.email, COUNT(a.id) as aantal_afspraken
FROM customers c
LEFT JOIN appointments a ON c.id = a.customer_id
GROUP BY c.id, c.name, c.email
ORDER BY aantal_afspraken DESC;
```

### Afspraken deze maand:

```sql
SELECT a.*, c.name as customer_name
FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
WHERE DATE_TRUNC('month', a.appointment_date) = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY a.appointment_date, a.start_time;
```

## Backup Strategie (Aanbevolen)

### Automatische Daily Backup (optioneel):

Maak een batch bestand `backup.bat`:

```batch
@echo off
set PGPASSWORD=jouw_wachtwoord
set BACKUP_DIR=C:\backups\kozijnen
set TIMESTAMP=%date:~-4%%date:~-7,2%%date:~-10,2%

"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U postgres -h localhost -F c -f "%BACKUP_DIR%\kozijnen_db_%TIMESTAMP%.backup" kozijnen_db

echo Backup completed: kozijnen_db_%TIMESTAMP%.backup
```

Plan dit in met Windows Task Scheduler voor dagelijkse backups.

## Database Schema Overzicht

### Tabel: customers
| Kolom | Type | Beschrijving |
|-------|------|--------------|
| id | SERIAL | Primaire sleutel |
| name | VARCHAR(255) | Naam klant |
| email | VARCHAR(255) | E-mailadres |
| phone | VARCHAR(50) | Telefoonnummer |
| address | TEXT | Adres |
| notes | TEXT | Notities |
| created_at | TIMESTAMP | Aanmaakdatum |
| updated_at | TIMESTAMP | Laatst bijgewerkt |

### Tabel: appointments
| Kolom | Type | Beschrijving |
|-------|------|--------------|
| id | SERIAL | Primaire sleutel |
| customer_id | INTEGER | Referentie naar klant |
| title | VARCHAR(255) | Titel afspraak |
| description | TEXT | Beschrijving |
| appointment_date | DATE | Datum afspraak |
| start_time | TIME | Starttijd |
| end_time | TIME | Eindtijd |
| status | VARCHAR(50) | Status (gepland/bevestigd/voltooid/geannuleerd) |
| appointment_type | VARCHAR(100) | Type (opname/montage/adviesgesprek) |
| location | TEXT | Locatie |
| material_type | VARCHAR(50) | Materiaal type |
| estimated_price | DECIMAL(10,2) | Geschatte prijs |
| notes | TEXT | Notities |
| created_at | TIMESTAMP | Aanmaakdatum |
| updated_at | TIMESTAMP | Laatst bijgewerkt |

## Support

Bij problemen:
1. Controleer de PostgreSQL logs in pgAdmin
2. Bekijk de server logs in je terminal
3. Controleer of alle services draaien
4. Verifieer je `.env` configuratie

Veel succes! 🚀
