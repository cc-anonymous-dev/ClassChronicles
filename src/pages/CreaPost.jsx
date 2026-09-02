import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'

const LIMITE_CARATTERI = 500
const CATEGORIA_DEFAULT = 'generale'

const DOMANDE_SPUNTO = [
  'Cosa è successo oggi in classe?',
  "C'è qualcosa che ti ha fatto ridere di recente?",
  'Un segreto che vuoi condividere?',
  "Qual è stato il momento più imbarazzante della settimana?",
  "C'è un episodio buffo successo durante una lezione?",
  'Cosa vorresti dire alla classe ma non hai mai detto?',
]

function SpuntoScrittura({ onScegliSpunto, disabled }) {
  const [aperto, setAperto] = useState(false)

  return (
    <div className="neo-card" style={{ gap: 'var(--space-sm)' }}>
      <button
        type="button"
        onClick={() => setAperto(!aperto)}
        disabled={disabled}
        style={{
          background: 'none', border: 'none', color: 'var(--color-primary-fixed-dim)',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 0,
        }}
      >
        <span>💡 Non sai cosa scrivere?</span>
        <span aria-hidden="true">{aperto ? '▲' : '▼'}</span>
      </button>

      {aperto && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <p className="text-body-md" style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
            Tocca una domanda per iniziare a scrivere da lì (opzionale):
          </p>
          {DOMANDE_SPUNTO.map((domanda) => (
            <button
              key={domanda}
              type="button"
              className="chip-categoria"
              style={{ textAlign: 'left', width: '100%' }}
              onClick={() => onScegliSpunto(domanda)}
              disabled={disabled}
            >
              {domanda}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreaPost() {
  const navigate = useNavigate()
  const { utente } = useAuth()

  const [titolo, setTitolo] = useState('')
  const [contenuto, setContenuto] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')
  const [successo, setSuccesso] = useState('')
  const [testoNonConsentito, setTestoNonConsentito] = useState(false)

  function gestisciScegliSpunto(domanda) {
    // Se il campo è vuoto, usiamo la domanda come punto di partenza.
    // Se contiene già testo, non lo sovrascriviamo per non perdere
    // quanto scritto: aggiungiamo la domanda solo come titolo se assente.
    if (!contenuto.trim()) {
      setContenuto(`${domanda}\n\n`)
    }
    if (!titolo.trim()) {
      setTitolo(domanda.length > 60 ? domanda.slice(0, 57) + '...' : domanda)
    }
  }

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')
    setSuccesso('')
    setTestoNonConsentito(false)

    if (!titolo.trim() || !contenuto.trim()) {
      setErrore('Inserisci sia un titolo che il contenuto della cronaca.')
      return
    }

    setInviando(true)

    // Controllo preventivo: verifichiamo il testo PRIMA di provare a
    // pubblicare, così mostriamo subito il banner dedicato invece di
    // un generico messaggio d'errore dopo il tentativo di invio.
    try {
      const rispostaControllo = await chiamaFunzione('controlla-testo', {
        utente_id: utente.id,
        testo: `${titolo} ${contenuto}`,
      })
      if (!rispostaControllo.testo_consentito) {
        setTestoNonConsentito(true)
        setInviando(false)
        return
      }
    } catch (err) {
      // Se il controllo preventivo fallisce per un problema di rete,
      // proseguiamo comunque: il server rifiuterà l'invio se necessario
      // (il controllo definitivo avviene sempre lato server).
    }

    try {
      const risposta = await chiamaFunzione('crea-post', {
        autore_id: utente.id,
        titolo: titolo.trim(),
        contenuto: contenuto.trim(),
        categoria: CATEGORIA_DEFAULT,
      })

      setSuccesso(risposta.messaggio)
      setTitolo('')
      setContenuto('')

      setTimeout(() => navigate('/feed'), 1800)
    } catch (err) {
      if (err.message?.includes('non consentit')) {
        setTestoNonConsentito(true)
      } else {
        setErrore(err.message)
      }
    } finally {
      setInviando(false)
    }
  }

  return (
    <LayoutApp>
      <div className="banner-legale">
        <span aria-hidden="true">⚠️</span>
        <div>
          <span className="banner-legale-titolo">Protocollo Rigido</span>
          Promemoria: Non usare nomi veri, nomi di insegnanti o dettagli identificativi.
          Mantieni tutto anonimo e divertente! I contenuti inappropriati non saranno approvati.
        </div>
      </div>

      <h2 className="text-headline-md" style={{ margin: 0 }}>Nuova Cronaca</h2>

      <SpuntoScrittura onScegliSpunto={gestisciScegliSpunto} disabled={inviando} />

      <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div className="campo-input-wrap">
          <input
            id="titolo-post"
            className="input-brutalist"
            type="text"
            placeholder=" "
            maxLength={100}
            value={titolo}
            onChange={(e) => { setTitolo(e.target.value); setTestoNonConsentito(false) }}
            disabled={inviando}
          />
          <label className="campo-label" htmlFor="titolo-post">Titolo della cronaca</label>
        </div>

        <div>
          <textarea
            className="textarea-brutalist"
            placeholder="Scrivi qui la tua confessione, pettegolezzo o sfogo. Il vuoto sta ascoltando..."
            maxLength={LIMITE_CARATTERI}
            value={contenuto}
            onChange={(e) => { setContenuto(e.target.value); setTestoNonConsentito(false) }}
            disabled={inviando}
          />
          <div className="textarea-footer">
            <span>🟢 Filtro: Attivo</span>
            <span>{contenuto.length} / {LIMITE_CARATTERI}</span>
          </div>
        </div>

        {testoNonConsentito && (
          <div className="messaggio-errore" role="alert" style={{ borderWidth: 2 }}>
            <span aria-hidden="true">🚫</span>
            <span>
              <strong>Non puoi pubblicare questa cronaca.</strong> Il testo contiene parole o
              espressioni non consentite dalle regole della classe. Modifica il contenuto per continuare.
            </span>
          </div>
        )}

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        {successo && (
          <div className="messaggio-successo" role="status">
            <span aria-hidden="true">✅</span>
            <span>{successo}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-brutalist btn-primary-container"
          disabled={inviando || testoNonConsentito}
        >
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>Invia per Revisione ➤</>}
        </button>
      </form>
    </LayoutApp>
  )
}
