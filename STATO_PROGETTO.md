# STATO DEL PROGETTO: Class Chronicles (ClassLog)

**Sito online:** https://class-log-tau.vercel.app  
**Repository GitHub:** KernelPhantom-Dev/ClassLog  

---

## 🔒 Vincoli di Sicurezza e Anonimato
- **Unico sviluppatore in forma anonima:** Il repository è pubblico. Nessun nome reale, email personale non-anonima, percorso Windows con nome utente reale o file di log di sistema deve mai comparire nei commit o nel codice.
- **Logica sensibile:** Tutta la logica sensibile passa esclusivamente da **Supabase Edge Functions** (Service Role), mai da query dirette dal client.
- **Nessun dato di debug in produzione:** Rimosso qualsiasi blocco o log che esponga la struttura dei dati o informazioni interne degli utenti.

---

## 🛠️ Architettura Tecnica
- **Frontend:** React (Vite) con React Router DOM
- **Backend / DB:** Supabase (Database + Edge Functions)
- **Stili:** CSS Brutalist custom (`index.css`)
- **Autenticazione:** Nickname generato casualmente + Password (nessuna email)

---

## ✅ Correzioni e Funzionalità Completate (Aggiornato Settembre 2026)

1. **Pulizia Log di Sistema (Punto 1)**
   - Verificato che `LOG POWERSHELL.txt` non è presente nel filesystem ed è stato rimosso dalla cronologia Git.

2. **Rimozione Codice di Debug dall'Interfaccia (Punto 2)**
   - Rimossi tutti i blocchi `<pre style={{ fontSize: 10, background: '#111', color: '#0f0', ... }}>` che mostravano l'output grezzo di `JSON.stringify(...)` visibile agli Admin in `src/pages/Admin.jsx` (sia per le segnalazioni utente che per le richieste di rimozione).

3. **Verifica Link YouTube (Punto 3)**
   - Identificato l'URL del canale YouTube: `https://youtube.com/@classchroniclesdev?si=xG2_Uy0gknBKlGED` (presente in `src/pages/Benvenuto.jsx` e `src/pages/Impostazioni.jsx`).
   - Mantenuto inalterato nel codice in attesa di decisioni dell'utente.

4. **Gestione Errori Visibili nell'Interfaccia (Punto 4)**
   - Integrazione dello stato d'errore visibile tramite la classe CSS `.messaggio-errore` per le seguenti azioni:
     - **Segnalazione post:** in `Feed.jsx` e `PostCard.jsx`.
     - **Richiesta di rimozione:** in `Feed.jsx`, `PostCard.jsx` e `ModalRichiediRimozione.jsx`.
     - **Segnalazione utente:** in `MembriClasse.jsx` e `ModalSegnalaUtente.jsx`.
     - **Mi piace (Like):** in `PostCard.jsx` (ripristino dello stato e banner d'errore visibile in caso di fallimento della richiesta Edge Function).

5. **Controllo Ban su Onboarding (Punto 5)**
   - Aggiornato `src/pages/Onboarding.jsx` per controllare se l'utente che naviga sull'onboarding possiede una sessione attiva ed è attualmente bannato (`bannato_fino_a` nel futuro), reindirizzandolo automaticamente a `/bannato`.

6. **Verifica Build di Produzione (Punto 7)**
   - Eseguito `npm run build`: compilazione completata con successo senza errori.

---

## 📌 Prossimi Passi & Note
- L'utente eseguirà manualmente `git add`, `git commit` e `git push` quando pronto per il deploy su Vercel.
- Nessuna modifica è stata apportata allo schema del database Supabase.
