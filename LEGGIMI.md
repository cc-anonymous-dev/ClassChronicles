# Class Chronicles — Pacchetto di Test #1 (Registrazione + Login)

Questo pacchetto contiene le prime due schermate funzionanti dell'app:
- **Benvenuto** (`/`) — registrazione con Codice Classe + password
- **Accedi** (`/accedi`) — login con Codice Classe + nickname + password
- **Feed temporaneo** (`/feed`) — schermata di verifica post-login (verrà sostituita dal vero Feed nel prossimo step)

## 🧪 Come testarlo in locale (sul tuo PC)

1. Estrai lo ZIP in una cartella (es. Desktop)
2. Apri **PowerShell** dentro quella cartella (tasto destro nella cartella → "Apri nel terminale" o `cd` manuale)
3. Installa le dipendenze:
   ```
   npm install
   ```
4. Avvia il server di sviluppo:
   ```
   npm run dev
   ```
5. Apri il browser all'indirizzo mostrato (di solito `http://localhost:5173`)

Il file `.env` è già incluso con le credenziali del tuo progetto Supabase — non serve configurare nulla.

## 🔑 Credenziali di test già create nel database

- **Codice Classe**: `CIAO2026`
- Per registrarti: vai su `/` (Benvenuto), inserisci il Codice Classe e scegli una password (min. 6 caratteri)
- Dopo la registrazione verrai reindirizzato automaticamente al Feed temporaneo
- Per riprovare il login: vai su `/accedi` e usa il nickname che ti è stato assegnato + la password scelta

## 📁 Struttura del progetto

```
src/
  lib/
    supabaseClient.js   → connessione a Supabase e chiamata alle Edge Functions
    AuthContext.jsx      → gestisce chi è loggato (salvato in localStorage)
    RottaProtetta.jsx    → blocca l'accesso al Feed se non si è loggati
  pages/
    Benvenuto.jsx         → schermata di registrazione
    Accedi.jsx            → schermata di login
    FeedTemporaneo.jsx    → schermata placeholder (sarà sostituita)
  App.jsx                 → collega le pagine (routing)
  index.css               → design system "Neo-Nocturnal" (colori, font, componenti)
```

## ⚠️ Nota sulla pubblicazione online (hosting)

Per pubblicare online (es. su Vercel/Netlify) dovrai impostare le stesse due variabili
che trovi nel file `.env` come "Environment Variables" nel pannello dell'hosting:

```
VITE_SUPABASE_URL=https://qvyymqhosuijkyazliqj.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_srEhxmzXBYN8ksWbDKdJXQ_V-1qpItq
```

Quando saremo pronti per il deploy definitivo, ti guiderò passo-passo anche per questo.

## 🐛 Cosa segnalarmi se trovi un problema

- Screenshot dell'errore (se visibile a schermo)
- Cosa hai digitato (codice classe, ecc. — MAI la password reale, usane una di prova)
- Eventuali messaggi rossi nella Console del browser (tasto F12 → tab "Console")
