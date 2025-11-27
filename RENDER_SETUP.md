# PostgreSQL Database op Render - Setup Guide

## Stap 1: Database Aanmaken

1. Log in op https://render.com
2. Klik op "New +" rechtsboven
3. Selecteer "PostgreSQL"

## Stap 2: Database Configureren

Vul de volgende gegevens in:

- **Name**: `kozijnen-database` (of een andere naam)
- **Database**: `kozijnen_db`
- **User**: `kozijnen_user` (wordt automatisch aangemaakt)
- **Region**: `Frankfurt (EU Central)` (kies het dichtsbijzijnde)
- **PostgreSQL Version**: Kies de nieuwste (bijv. 16)
- **Plan**: **Free** (gratis tier)

Klik op **"Create Database"**

## Stap 3: Database Gegevens Kopiëren

Na het aanmaken zie je een pagina met connectie informatie:

### Internal Database URL (voor Render services):
```
postgres://user:pass@hostname:5432/dbname
```

### External Database URL (voor lokale ontwikkeling):
```
postgres://user:pass@hostname:5432/dbname
```

**KOPIEER DE VOLGENDE GEGEVENS:**
- Hostname
- Port
- Database
- Username  
- Password

## Stap 4: Verbind met Database

Op de Render database pagina:
1. Scroll naar beneden naar "Connections"
2. Klik op "PSQL Command" - dit toont het commando om te verbinden
3. Of gebruik de "External Database URL" voor tools zoals pgAdmin

## Stap 5: Tabellen Aanmaken

### Optie A: Via Render Dashboard

1. Op je database pagina, klik op "Connect" rechtsboven
2. Selecteer "External Connection"
3. Open pgAdmin 4 op je computer
4. Maak een nieuwe server connectie:
   - **Host**: [hostname van Render]
   - **Port**: 5432
   - **Database**: kozijnen_db
   - **Username**: [van Render]
   - **Password**: [van Render]
   - **SSL Mode**: Require
5. Voer het schema.sql bestand uit in Query Tool

### Optie B: Via Render Shell (Web Terminal)

1. Op je database pagina, klik op "Connect"
2. Kies "PSQL Command"
3. Je ziet een commando zoals:
   ```
   PGPASSWORD=xxx psql -h hostname -U user dbname
   ```
4. Dit kun je gebruiken in een lokale terminal (als psql geïnstalleerd is)

### Optie C: Eenvoudigste Methode - Via Render's Query Interface

Helaas heeft Render geen ingebouwde query interface. Dus we gebruiken pgAdmin.

## Stap 6: pgAdmin Configureren voor Render

1. Open pgAdmin 4
2. Rechtsklik op "Servers" → "Register" → "Server"

**General Tab:**
- Name: `Render Kozijnen DB`

**Connection Tab:**
- Host name/address: [kopieer van Render]
- Port: `5432`
- Maintenance database: `kozijnen_db`
- Username: [kopieer van Render]
- Password: [kopieer van Render]
- Save password: ✅ (aanvinken)

**SSL Tab:**
- SSL mode: `Require`

Klik **Save**

3. Open de nieuwe server verbinding
4. Navigeer naar: Databases → kozijnen_db
5. Rechtsklik op kozijnen_db → "Query Tool"
6. Kopieer en plak de inhoud van `database/schema.sql`
7. Klik Execute (F5)

## Stap 7: .env Configureren

Na het aanmaken krijg je van Render deze informatie. Vul in je `.env`:

```env
PORT=3000

# SMTP (voor emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jouw_email@gmail.com
SMTP_PASS=jouw_app_wachtwoord
MAIL_TO=info@uwbedrijf.nl

# PostgreSQL Database (van Render)
DB_HOST=dpg-xxxxx.frankfurt-postgres.render.com
DB_PORT=5432
DB_NAME=kozijnen_db
DB_USER=kozijnen_user
DB_PASS=xxxxxxxxxxxxx
```

**Let op:** 
- Gebruik de **External** hostname (niet internal)
- De hostname eindigt op `.render.com`
- Het wachtwoord is een lange random string

## Stap 8: Test Lokaal

Start je applicatie lokaal:
```bash
npm start
```

Als je ziet:
```
✓ Connected to PostgreSQL database
Server running on http://localhost:3000
```

Dan werkt het! 🎉

## Stap 9: Deploy naar Render (Optioneel)

Om ook je website op Render te hosten:

1. Push je code naar GitHub
2. Ga naar Render Dashboard
3. Klik "New +" → "Web Service"
4. Connect je GitHub repository
5. Configureer:
   - **Name**: `kozijnen-website`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Voeg Environment Variables toe (kopieer van .env)
7. Klik "Create Web Service"

## Belangrijke Notities

⚠️ **Gratis Render Database Beperkingen:**
- Database wordt na 90 dagen inactiviteit verwijderd
- Beperkte opslag (1 GB)
- Minder performance dan betaalde versie

💡 **Backup Maken:**
```bash
pg_dump -h hostname -U username -d kozijnen_db > backup.sql
```

🔒 **Beveiliging:**
- Bewaar je database credentials veilig
- Deel nooit je `.env` bestand
- Voeg `.env` toe aan `.gitignore`

## Troubleshooting

**"Connection refused"**
- Controleer of je de External hostname gebruikt (niet Internal)
- Zorg dat SSL mode op "Require" staat

**"Password authentication failed"**
- Kopieer het wachtwoord opnieuw van Render
- Let op spaties aan het begin/einde

**"Database does not exist"**
- Zorg dat de database naam exact `kozijnen_db` is
- Check of de database succesvol is aangemaakt op Render
