import { useNavigate } from 'react-router-dom'

export default function RegolePrivacy() {
  const navigate = useNavigate()

  return (
    <div className="pagina" style={{ alignItems: 'center' }}>
      <div className="griglia-decorativa" />
      <header className="header-brand" style={{ position: 'sticky', top: 0, background: 'var(--color-background)', borderBottom: '2px solid var(--color-outline-variant)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 640 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Torna indietro"
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 20, cursor: 'pointer' }}
          >
            ←
          </button>
          <h1 className="text-headline-md" style={{ fontSize: 16, margin: 0 }}>REGOLE E PRIVACY</h1>
          <span style={{ width: 20 }} />
        </div>
      </header>

      <main className="regole-pagina" style={{ marginTop: 72, zIndex: 1 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="text-display-lg" style={{ fontSize: 28, margin: 0 }}>Le Regole del Gioco</h2>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
            Class Chronicles esiste per far divertire la classe, in sicurezza. Leggi con attenzione.
          </p>
        </div>

        <section className="regole-sezione">
          <h3>📜 1. Regole della Community</h3>
          <p>Per mantenere questo spazio divertente e sicuro per tutti, sono vietati:</p>
          <ul>
            <li>Nomi veri, cognomi, soprannomi riconoscibili di compagni o insegnanti</li>
            <li>Insulti, minacce, linguaggio offensivo o discriminatorio</li>
            <li>Contenuti a sfondo sessuale, violento o che promuovano autolesionismo</li>
            <li>Foto, screenshot o contenuti che possano identificare qualcuno</li>
            <li>Spam, pubblicità o link esterni</li>
          </ul>
          <p>
            Ogni cronaca è controllata da un filtro automatico e da un Admin prima di essere pubblicata.
            Le violazioni ripetute portano a sospensioni temporanee dell'account, decise dal Referente (ROOT)
            della tua classe.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>🔒 2. Come Funziona l'Anonimato</h3>
          <p>
            Non chiediamo mai nome, cognome, email o numero di telefono. Ti registri solo con un nickname
            generato casualmente e una password a tua scelta. Nessuno — nemmeno il Referente della classe —
            può risalire alla tua identità reale dall'app.
          </p>
          <p>
            Il Referente (ROOT) e gli Admin della tua classe possono vedere il nickname associato a ogni
            cronaca, ai soli fini della moderazione dei contenuti (approvare, rifiutare, gestire segnalazioni).
          </p>
        </section>

        <section className="regole-sezione">
          <h3>🗄️ 3. Che Dati Salviamo</h3>
          <p>Salviamo esclusivamente:</p>
          <ul>
            <li>Il tuo nickname (generato casualmente o scelto da te)</li>
            <li>La tua password, sempre in forma crittografata (mai leggibile, nemmeno da noi)</li>
            <li>Le cronache che scrivi e la data di pubblicazione</li>
            <li>Il numero di segnalazioni/mi piace ricevuti dai tuoi post</li>
          </ul>
          <p>
            Non salviamo: indirizzi email, numeri di telefono, indirizzi IP, posizione geografica,
            o qualsiasi altro dato che possa identificarti personalmente.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>🌍 4. Dove Sono Ospitati i Dati</h3>
          <p>
            Il sito è ospitato su <strong>Vercel</strong>. Il database è gestito da <strong>Supabase</strong>,
            su server situati nell'Unione Europea (Francoforte, Germania). Alcuni servizi tecnici di supporto
            di questi fornitori potrebbero, in casi limitati, coinvolgere infrastrutture negli Stati Uniti,
            sempre nel rispetto delle garanzie previste dalla normativa europea sulla protezione dei dati.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>👤 5. Titolare del Trattamento</h3>
          <p>
            Il titolare del trattamento dei dati è <strong>il Team di Sviluppo di ClassLog</strong>.
            All'interno di ogni singola classe, il Referente (ROOT) — lo studente che ha creato la classe —
            agisce come gestore e moderatore dei contenuti di quella classe, con accesso limitato ai dati
            necessari a questo scopo.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>⚖️ 6. I Tuoi Diritti</h3>
          <p>In qualsiasi momento puoi:</p>
          <ul>
            <li><strong>Eliminare il tuo account</strong> dalla sezione Impostazioni: il tuo nickname verrà sostituito con "Utente Eliminato" e i tuoi dati personali (password) resi definitivamente inutilizzabili</li>
            <li><strong>Richiedere la rimozione di una cronaca</strong> in cui ti riconosci, anche in forma anonima, tramite il pulsante "Mi riconosco" su ogni post</li>
            <li><strong>Segnalare</strong> contenuti che violano queste regole con il pulsante "Segnala"</li>
          </ul>
          <p>
            Poiché non raccogliamo email o altri recapiti, non è possibile contattarti direttamente:
            usa questi strumenti integrati nell'app per esercitare i tuoi diritti.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>🗑️ 7. Fine dell'Anno Scolastico</h3>
          <p>
            Al termine dell'anno scolastico, il Referente della classe può attivare l'
            <strong>"Autodistruzione di Fine Anno"</strong>: un'azione irreversibile che cancella
            permanentemente tutti i dati della classe (cronache, account, impostazioni) dal nostro database.
          </p>
        </section>

        <section className="regole-sezione">
          <h3>🛡️ 8. Sicurezza dei Minori</h3>
          <p>
            Se un contenuto suggerisce che qualcuno è in pericolo (autolesionismo, bullismo grave, abusi),
            segnalalo immediatamente e parlane con un adulto di fiducia — un insegnante, un genitore, o
            i servizi di ascolto dedicati. Questa app è uno spazio di svago, non sostituisce l'aiuto di un
            adulto in situazioni serie.
          </p>
        </section>

        <p className="text-body-md" style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 13 }}>
          Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </main>
    </div>
  )
}
