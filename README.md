## Vakman Kozijnen – Setup

### Vereisten
- Node.js 18+
- SMTP-gegevens voor e-mail (host, poort, gebruikersnaam, wachtwoord)

### Installatie
1. Pak de code uit en open een terminal in de map.
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Maak een `.env` bestand (of hernoem `ENV.sample` naar `.env`) en vul waarden in.

### `.env` inhoud
```env
PORT=3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
MAIL_TO=info@uwbedrijf.nl
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

### Endpoints
- `POST /api/price` – prijsberekening op basis van m², aantal en opties
- `POST /api/contact` – verstuurt e-mail met formuliergegevens

### Aanpassen
- Vervang de galerijafbeeldingen in `public/script.js` door eigen projectfoto's.
- Pas stijlen aan in `public/styles.css`.


