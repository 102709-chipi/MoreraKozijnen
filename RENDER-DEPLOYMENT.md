# Deployment naar Render.com (GRATIS)

## Stap 1: GitHub Repository maken

### Optie A: GitHub Desktop (Makkelijkst)
1. Download en installeer [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop en log in met je GitHub account
3. Klik op "File" → "Add Local Repository"
4. Selecteer de map `C:\Users\timis\Desktop\cheat code`
5. Als het zegt "not a git repository", klik op "Create a repository"
6. Vul in:
   - Name: `kozijnen-website`
   - Description: `Vakman Kozijnen website met calculator`
   - Klik "Create Repository"
7. Klik op "Publish repository" rechtsboven
8. Vink "Keep this code private" UIT als je het publiek wilt (of AAN voor privé)
9. Klik "Publish Repository"

### Optie B: Git Command Line
1. Download [Git for Windows](https://git-scm.com/download/win)
2. Open PowerShell in de project map
3. Run deze commands:
```bash
git init
git add .
git commit -m "Initial commit - Kozijnen website"
git branch -M main
git remote add origin https://github.com/JOUW-USERNAME/kozijnen-website.git
git push -u origin main
```

## Stap 2: .gitignore aanmaken

Maak een bestand `.gitignore` in de hoofdmap met deze inhoud:
```
node_modules/
.env
.DS_Store
*.log
```

Dit voorkomt dat gevoelige bestanden naar GitHub gaan.

## Stap 3: Render.com Account

1. Ga naar [render.com](https://render.com)
2. Klik "Get Started" of "Sign Up"
3. Kies "Sign up with GitHub" (makkelijkst)
4. Autoriseer Render om toegang te krijgen tot je GitHub

## Stap 4: Web Service aanmaken

1. Klik op "New +" rechtsboven
2. Selecteer "Web Service"
3. Koppel je GitHub repository:
   - Klik "Connect account" als je repo niet zichtbaar is
   - Zoek naar `kozijnen-website`
   - Klik "Connect"

## Stap 5: Service configureren

Vul de volgende instellingen in:

**Basic Settings:**
- **Name**: `kozijnen-website` (of een andere naam)
- **Region**: Frankfurt (EU Central) - dichtst bij Nederland
- **Branch**: `main`
- **Root Directory**: laat leeg
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Selecteer **"Free"** (€0/maand)

## Stap 6: Environment Variables toevoegen

Scroll naar beneden naar "Environment Variables" en klik "Add Environment Variable".

Voeg deze variabelen toe:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `SMTP_HOST` | `smtp.gmail.com` (of jouw SMTP server) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `jouw-email@gmail.com` |
| `SMTP_PASS` | `jouw-app-wachtwoord` |
| `MAIL_TO` | `info@vakman-kozijnen.nl` |

### SMTP Instellingen per provider:

**Gmail:**
- Host: `smtp.gmail.com`
- Port: `587`
- User: je Gmail adres
- Pass: [App Password](https://myaccount.google.com/apppasswords) (niet je normale wachtwoord!)

**Outlook/Hotmail:**
- Host: `smtp-mail.outlook.com`
- Port: `587`
- User: je Outlook adres
- Pass: je Outlook wachtwoord

**TransIP/andere hosting:**
- Vraag SMTP gegevens bij je hosting provider

## Stap 7: Deploy!

1. Klik onderaan op **"Create Web Service"**
2. Render begint nu met deployen (duurt 2-5 minuten)
3. Je ziet de logs live verschijnen
4. Wacht tot je ziet: "Server running on http://localhost:3000"
5. Je website is nu live! 🎉

## Stap 8: Website URL

Je website is nu beschikbaar op:
```
https://kozijnen-website.onrender.com
```

(vervang `kozijnen-website` met jouw gekozen naam)

## Stap 9: Custom Domain (Optioneel)

Als je een eigen domeinnaam hebt (bijv. `vakman-kozijnen.nl`):

1. Ga naar je Render dashboard
2. Klik op je service
3. Ga naar "Settings" tab
4. Scroll naar "Custom Domain"
5. Klik "Add Custom Domain"
6. Vul je domein in: `www.vakman-kozijnen.nl`
7. Render geeft je DNS instructies
8. Ga naar je domain provider (TransIP, Hostnet, etc.)
9. Voeg een CNAME record toe:
   - Name: `www`
   - Value: `kozijnen-website.onrender.com`
10. Wacht 5-60 minuten voor DNS propagatie

## Stap 10: Testen

Test deze functionaliteiten:

- ✅ Website laadt correct
- ✅ Calculator werkt (prijzen berekenen)
- ✅ Subsidie sectie verschijnt bij HR+++
- ✅ Contact formulier verstuurt email
- ✅ Prijsindicatie email werkt

## Updates maken

Elke keer als je code update:

1. Maak wijzigingen in je code
2. In GitHub Desktop:
   - Vul een "Summary" in (bijv. "Prijzen aangepast")
   - Klik "Commit to main"
   - Klik "Push origin"
3. Render detecteert automatisch de wijziging en deploy opnieuw!

## Troubleshooting

### "Application failed to respond"
- Check of `PORT` environment variable is ingesteld
- Check of `npm start` command correct is

### "Email werkt niet"
- Controleer SMTP credentials in Environment Variables
- Voor Gmail: gebruik App Password, niet je normale wachtwoord
- Check of SMTP_PORT `587` is (niet 465)

### "Website slaapt / cold start"
- Dit is normaal op gratis tier
- Eerste request na 15 min inactiviteit duurt 30-60 sec
- Daarna werkt alles snel
- Upgrade naar $7/maand voor "always on"

### "Build failed"
- Check of `package.json` correct is
- Zorg dat alle dependencies zijn toegevoegd
- Check build logs in Render dashboard

## Kosten

**Gratis tier:**
- €0/maand
- 750 uur/maand (genoeg voor 24/7)
- Website slaapt na 15 min inactiviteit

**Starter tier ($7/maand):**
- Always on (geen cold starts)
- Meer resources
- Beter voor productie

## Support

Als je problemen hebt:
1. Check de logs in Render dashboard
2. Zoek in [Render Docs](https://render.com/docs)
3. Vraag hulp in Render Community Forum

---

**Succes met je deployment! 🚀**
