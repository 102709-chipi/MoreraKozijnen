# Deployment naar Cloudflare Pages

## Stap 1: GitHub Repository maken

1. Ga naar [GitHub.com](https://github.com) en maak een account aan (als je die nog niet hebt)
2. Klik op "New repository" 
3. Geef het een naam zoals `kozijnen-website`
4. Maak het repository aan

## Stap 2: Code uploaden naar GitHub

### Optie A: GitHub Desktop (aanbevolen)
1. Download [GitHub Desktop](https://desktop.github.com/)
2. Installeer en log in met je GitHub account
3. Klik "Add an Existing Repository from your Hard Drive"
4. Selecteer de map `C:\Users\timis\Desktop\cheat code`
5. Commit en push naar GitHub

### Optie B: Git command line
1. Download [Git for Windows](https://git-scm.com/download/win)
2. Installeer Git
3. Open PowerShell in de project map en run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/JOUW-USERNAME/JOUW-REPO-NAAM.git
git push -u origin main
```

## Stap 3: Cloudflare Pages setup

1. Ga naar [Cloudflare Pages](https://pages.cloudflare.com/)
2. Log in met je Cloudflare account (maak er een aan als je die nog niet hebt)
3. Klik "Connect to Git"
4. Autoriseer GitHub en selecteer je repository
5. Build settings:
   - **Framework preset**: None
   - **Build command**: `npm install && npm run build`
   - **Build output directory**: `public`
   - **Root directory**: `/` (laat leeg)

## Stap 4: Environment variables

In Cloudflare Pages dashboard:
1. Ga naar je project → Settings → Environment Variables
2. Voeg toe:
   - `SMTP_HOST`: je SMTP server
   - `SMTP_PORT`: 587
   - `SMTP_USER`: je email username  
   - `SMTP_PASS`: je email password
   - `MAIL_TO`: waar emails naartoe moeten

## Stap 5: Custom domain (optioneel)

1. In Cloudflare Pages → Custom domains
2. Voeg je domein toe (bijv. `kozijnen.nl`)
3. Volg de DNS instructies

## Problemen oplossen

- **Build fails**: Controleer of alle bestanden correct zijn geüpload
- **Email werkt niet**: Controleer SMTP credentials in environment variables
- **Styling issues**: Controleer of alle CSS/JS bestanden in de `public` map staan

Je website is dan live op `https://jouw-project.pages.dev`



