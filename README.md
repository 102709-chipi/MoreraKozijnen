## Vakman Kozijnen – Setup

### Vereisten
- Node.js 18+
- PostgreSQL 12+ (voor agenda functionaliteit)
- SMTP-gegevens voor e-mail (host, poort, gebruikersnaam, wachtwoord)

### Installatie
1. Pak de code uit en open een terminal in de map.
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Maak een `.env` bestand (of hernoem `ENV.sample` naar `.env`) en vul waarden in.
4. **Voor database functionaliteit**: Volg de stappen in `DATABASE.md` om PostgreSQL en pgAdmin in te stellen.

### `.env` inhoud
```env
PORT=3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
MAIL_TO=info@uwbedrijf.nl

# PostgreSQL Database (voor agenda)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kozijnen_db
DB_USER=postgres
DB_PASS=your_password
```

### Starten
Ontwikkelmodus (met automatisch herstarten):
```bash
npm run dev
```

Productie:
```bash
npm start
```

Open daarna de website op `http://localhost:3000`.

### Functionaliteiten

#### Website Endpoints
- `POST /api/price` – prijsberekening op basis van m², aantal en opties
- `POST /api/contact` – verstuurt e-mail met formuliergegevens
- `POST /api/send-price` – verstuurt prijsindicatie per e-mail

#### Agenda & Database Endpoints
- `GET /api/customers` – alle klanten ophalen
- `GET /api/customers/:id` – specifieke klant ophalen
- `POST /api/customers` – nieuwe klant aanmaken
- `PUT /api/customers/:id` – klant bijwerken
- `DELETE /api/customers/:id` – klant verwijderen
- `GET /api/appointments` – alle afspraken ophalen (met optionele filters)
- `GET /api/appointments/:id` – specifieke afspraak ophalen
- `POST /api/appointments` – nieuwe afspraak aanmaken
- `PUT /api/appointments/:id` – afspraak bijwerken
- `PATCH /api/appointments/:id/status` – alleen status bijwerken
- `DELETE /api/appointments/:id` – afspraak verwijderen

#### Pagina's
- `index.html` – Homepage met prijscalculator
- `kunststof-kozijnen.html` – Informatie over kunststof kozijnen
- `houten-kozijnen.html` – Informatie over houten kozijnen
- `aluminium-kozijnen.html` – Informatie over aluminium kozijnen
- `montage.html` – Montage informatie
- `agenda.html` – **NIEUW**: Afspraken beheer met kalender en lijst weergave

### Database Setup

Voor gedetailleerde instructies om de PostgreSQL database op te zetten met pgAdmin, zie **`DATABASE.md`**.

Korte stappen:
1. Installeer PostgreSQL en pgAdmin
2. Maak database `kozijnen_db` aan
3. Voer `database/schema.sql` uit in pgAdmin Query Tool
4. Configureer `.env` met je database gegevens
5. Start de applicatie met `npm start`

### Aanpassen
- Vervang de galerijafbeeldingen in `public/script.js` door eigen projectfoto's.
- Pas stijlen aan in `public/styles.css`.
- Pas de agenda kleuren en stijlen aan in `public/agenda.html`.


