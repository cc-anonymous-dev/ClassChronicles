import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import BannerFeedback from '../components/BannerFeedback'

const AGGETTIVI = [
  'Curioso', 'Silenzioso', 'Rapido', 'Astuto', 'Coraggioso', 'Distratto',
  'Misterioso', 'Vivace', 'Instancabile', 'Sognatore', 'Ribelle', 'Geniale',
  'Sfuggente', 'Audace', 'Notturno', 'Elettrico',
]
const SOSTANTIVI = [
  'Tasso', 'Falco', 'Lupo', 'Gufo', 'Volpe', 'Corvo', 'Grillo', 'Delfino',
  'Drago', 'Fantasma', 'Pinguino', 'Squalo', 'Lince', 'Airone', 'Bradipo', 'Colibri',
]

function generaNicknamePreview() {
  const agg = AGGETTIVI[Math.floor(Math.random() * AGGETTIVI.length)]
  const sost = SOSTANTIVI[Math.floor(Math.random() * SOSTANTIVI.length)]
  const numero = Math.floor(Math.random() * 90) + 10
  return `${agg}${sost}${numero}`
}

function CardIdentita({ nicknamePreview, onRigenera, disabled }) {
  return (
    <div className="neo-card">
      <div className="neo-card-header">
        <span className="text-label-caps" style={{ color: 'var(--color-secondary)' }}>Alias Attuale</span>
        <span aria-hidden="true">🔒</span>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          border: '2px solid var(--color-outline-variant)',
          padding: 'var(--space-md)',
          textAlign: 'center',
          minHeight: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          className="text-headline-md"
          style={{ color: 'var(--color-primary-fixed)', letterSpacing: '0.05em', wordBreak: 'break-all' }}
        >
          {nicknamePreview}
        </span>
      </div>

      <button
        type="button"
        className="btn-brutalist btn-primary-container"
        onClick={onRigenera}
        disabled={disabled}
      >
        🔄 Genera Nickname Casuale
      </button>
    </div>
  )
}

function FormEntraClasse({ nicknamePreview }) {
  const navigate = useNavigate()
  const { accedi } = useAuth()

  const [codiceClasse, setCodiceClasse] = useState('')
  const [password, setPassword] = useState('')
  const [accettaRegole, setAccettaRegole] = useState(false)
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!codiceClasse.trim() || !password) {
      setErrore('Inserisci sia il Codice Classe che una password.')
      return
    }
    if (password.length < 6) {
      setErrore('La password deve avere almeno 6 caratteri.')
      return
    }
    if (!accettaRegole) {
      setErrore('Devi accettare le Regole della Community per entrare nella classe.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('registrazione', {
        codice_classe: codiceClasse.trim(),
        password,
        nickname_richiesto: nicknamePreview,
      })

      accedi({
        id: risposta.utente.id,
        nickname: risposta.utente.nickname,
        ruolo: risposta.utente.ruolo,
      })

      navigate('/feed')
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  return (
    <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div className="neo-card">
        <div className="neo-card-header">
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
            Portale di Accesso
          </span>
          <span aria-hidden="true">🚪</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          {/* Campo visivamente nascosto ma presente nel DOM: i browser ignorano display:none per l'autocomplete */}
          <input
            type="text"
            autoComplete="username"
            name="username"
            value={nicknamePreview}
            readOnly
            tabIndex={-1}
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          />
          <div className="campo-input-wrap">
            <input
              id="codice-classe"
              className="input-brutalist"
              type="text"
              placeholder=" "
              autoComplete="off"
              value={codiceClasse}
              onChange={(e) => setCodiceClasse(e.target.value)}
              style={{ textTransform: 'uppercase' }}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="codice-classe">Codice Classe Privato</label>
          </div>

          <div className="campo-input-wrap">
            <input
              id="password-registrazione"
              className="input-brutalist"
              type="password"
              placeholder=" "
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="password-registrazione">Password Univoca (min. 6 caratteri)</label>
          </div>
        </div>

        <label className="checkbox-responsabilita">
          <input
            type="checkbox"
            checked={accettaRegole}
            onChange={(e) => setAccettaRegole(e.target.checked)}
            disabled={inviando}
          />
          <span className="text-body-md" style={{ fontSize: 14 }}>
            Ho letto e accetto le{' '}
            <button
              type="button"
              className="link-testuale"
              style={{ fontSize: 14 }}
              onClick={(e) => { e.preventDefault(); window.open('/regole', '_blank') }}
            >
              Regole della Community e la Privacy
            </button>
            .
          </span>
        </label>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        <button type="submit" className="btn-brutalist btn-primary" disabled={inviando || !accettaRegole}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>Entra nella Classe →</>}
        </button>
      </div>
    </form>
  )
}

const TUTTE_LE_CLASSI = []
for (let n = 1; n <= 5; n++) {
  for (let l = 0; l < 26; l++) {
    TUTTE_LE_CLASSI.push(`${n}${String.fromCharCode(65 + l)}`)
  }
}

function SelettoreClasseRicerca({ valore, onChange, disabled }) {
  const [aperto, setAperto] = useState(false)
  const [ricerca, setRicerca] = useState('')

  const filtrate = TUTTE_LE_CLASSI.filter((c) =>
    c.toLowerCase().includes(ricerca.toLowerCase())
  )

  return (
    <div style={{ position: 'relative' }}>
      <div className="campo-input-wrap">
        <input
          type="text"
          className="input-brutalist"
          placeholder=" "
          value={aperto ? ricerca : valore}
          onChange={(e) => {
            setRicerca(e.target.value)
            setAperto(true)
            if (!e.target.value) onChange('')
          }}
          onFocus={() => {
            setAperto(true)
            setRicerca('')
          }}
          onBlur={() => {
            setTimeout(() => setAperto(false), 200)
          }}
          disabled={disabled}
        />
        <label className="campo-label">Cerca o scegli la classe (es. 3A)</label>
      </div>

      {aperto && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 220,
            overflowY: 'auto',
            backgroundColor: 'var(--color-surface-container-low)',
            border: '2px solid var(--color-outline-variant)',
            borderTop: 'none',
            zIndex: 10,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
            gap: 'var(--space-xs)',
            padding: 'var(--space-sm)',
            boxShadow: '4px 4px 0px 0px var(--color-background)',
          }}
        >
          {filtrate.map((c) => (
            <button
              key={c}
              type="button"
              style={{
                padding: 'var(--space-sm) 0',
                backgroundColor:
                  valore === c
                    ? 'var(--color-primary-fixed-dim)'
                    : 'var(--color-surface-container)',
                color:
                  valore === c
                    ? 'var(--color-on-primary)'
                    : 'var(--color-on-surface)',
                border: '2px solid',
                borderColor:
                  valore === c
                    ? 'var(--color-primary-fixed-dim)'
                    : 'transparent',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                fontWeight: 600,
                textAlign: 'center',
                transition: 'all 0.1s',
              }}
              onClick={() => {
                onChange(c)
                setAperto(false)
              }}
            >
              {c}
            </button>
          ))}
          {filtrate.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: 'var(--space-md)',
                textAlign: 'center',
                color: 'var(--color-on-surface-variant)',
              }}
            >
              Nessuna classe trovata
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SchermataCodiceGenerato({ nomeClasse, codiceClasse, nickname, onContinua }) {
  const [copiato, setCopiato] = useState(false)

  function copiaCodice() {
    navigator.clipboard?.writeText(codiceClasse)
    setCopiato(true)
    setTimeout(() => setCopiato(false), 2000)
  }

  return (
    <div className="neo-card" style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 40 }} aria-hidden="true">🎉</span>
      <h2 className="text-headline-md" style={{ margin: 0 }}>Classe {nomeClasse} Creata!</h2>
      <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
        Sei entrato come <strong style={{ color: 'var(--color-primary-fixed-dim)' }}>{nickname}</strong>, ROOT di questa classe.
      </p>

      <div
        style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          border: '2px solid var(--color-error)',
          padding: 'var(--space-md)',
        }}
      >
        <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>
          ⚠️ Salva questo Codice Classe ORA
        </span>
        <p className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: '8px 0' }}>
          Non potrai più vederlo dopo aver lasciato questa schermata. Condividilo solo con i tuoi compagni di classe.
        </p>
        <div
          style={{
            fontSize: 32, fontWeight: 700, letterSpacing: '0.15em',
            color: 'var(--color-primary-fixed)', fontFamily: 'monospace',
            padding: 'var(--space-sm)',
          }}
        >
          {codiceClasse}
        </div>
        <button type="button" className="btn-brutalist btn-secondary-outline" onClick={copiaCodice}>
          {copiato ? '✅ Copiato!' : '📋 Copia Codice'}
        </button>
      </div>

      <button type="button" className="btn-brutalist btn-primary" onClick={onContinua}>
        Ho Salvato il Codice, Continua →
      </button>
    </div>
  )
}
function FormCreaClasse({ nicknamePreview }) {
  const navigate = useNavigate()
  const { accedi } = useAuth()

  const [nomeClasseSelezionato, setNomeClasseSelezionato] = useState('')
  const [password, setPassword] = useState('')
  const [accettaResponsabilita, setAccettaResponsabilita] = useState(false)
  const [accettaRegole, setAccettaRegole] = useState(false)
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')
  const [risultatoCreazione, setRisultatoCreazione] = useState(null)

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!nomeClasseSelezionato || !password) {
      setErrore('Compila tutti i campi per creare la classe.')
      return
    }
    if (password.length < 6) {
      setErrore('La password deve avere almeno 6 caratteri.')
      return
    }
    if (!accettaResponsabilita) {
      setErrore('Devi accettare le responsabilità del ROOT per creare una classe.')
      return
    }
    if (!accettaRegole) {
      setErrore('Devi accettare le Regole della Community per procedere.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('crea-classe', {
        nome_classe: nomeClasseSelezionato,
        password,
      })

      setRisultatoCreazione({
        nomeClasse: risposta.classe.nome_classe,
        codiceClasse: risposta.codice_classe,
        utente: risposta.utente,
      })
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  function gestisciContinua() {
    accedi({
      id: risultatoCreazione.utente.id,
      nickname: risultatoCreazione.utente.nickname,
      ruolo: risultatoCreazione.utente.ruolo,
    })
    navigate('/feed')
  }

  if (risultatoCreazione) {
    return (
      <SchermataCodiceGenerato
        nomeClasse={risultatoCreazione.nomeClasse}
        codiceClasse={risultatoCreazione.codiceClasse}
        nickname={risultatoCreazione.utente.nickname}
        onContinua={gestisciContinua}
      />
    )
  }

  return (
    <form onSubmit={gestisciInvio} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
      <div className="neo-card">
        <div className="neo-card-header">
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
            Fonda una Nuova Classe
          </span>
          <span aria-hidden="true">👑</span>
        </div>

        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', margin: 0, fontSize: 14 }}>
          Diventerai il <strong style={{ color: 'var(--color-primary-fixed-dim)' }}>ROOT</strong> di questa classe:
          potrai approvare cronache, gestire segnalazioni, promuovere altri Admin e bannare utenti.
          Il Codice Classe verrà generato automaticamente dal sistema.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
            Seleziona la tua classe
          </span>
          <div style={{ position: 'relative' }}>
            <SelettoreClasseRicerca
              valore={nomeClasseSelezionato}
              onChange={setNomeClasseSelezionato}
              disabled={inviando}
            />
          </div>
          {nomeClasseSelezionato && (
            <p className="text-body-md" style={{ margin: 0, fontSize: 13, color: 'var(--color-primary-fixed-dim)' }}>
              Classe selezionata: <strong>{nomeClasseSelezionato}</strong>
            </p>
          )}

          <div className="campo-input-wrap">
            <input
              id="password-root"
              className="input-brutalist"
              type="password"
              placeholder=" "
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="password-root">La tua Password (min. 6 caratteri)</label>
          </div>
        </div>

        <div className="blocco-responsabilita">
          <span className="text-label-caps" style={{ color: 'var(--color-tertiary-container)' }}>
            ⚠️ Responsabilità del ROOT
          </span>
          <p style={{ margin: 0 }}>
            Come creatore/creatrice di questa classe, diventerai responsabile della sua moderazione:
            dovrai esaminare le cronache in attesa, gestire le segnalazioni con equità (comprese
            quelle che risultano infondate), e intervenire in caso di comportamenti scorretti.
            Un uso scorretto di questi poteri (bannare ingiustamente, ignorare segnalazioni gravi,
            approvare contenuti vietati) può portare all'intervento diretto della Supervisione
            della piattaforma, che può rimuoverti il ruolo di ROOT.
          </p>
          <label className="checkbox-responsabilita">
            <input
              type="checkbox"
              checked={accettaResponsabilita}
              onChange={(e) => setAccettaResponsabilita(e.target.checked)}
              disabled={inviando}
            />
            <span className="text-body-md" style={{ fontSize: 14 }}>
              Ho letto e accetto le responsabilità legate al ruolo di ROOT.
            </span>
          </label>
          <label className="checkbox-responsabilita">
            <input
              type="checkbox"
              checked={accettaRegole}
              onChange={(e) => setAccettaRegole(e.target.checked)}
              disabled={inviando}
            />
            <span className="text-body-md" style={{ fontSize: 14 }}>
              Ho letto e accetto le{' '}
              <button
                type="button"
                className="link-testuale"
                style={{ fontSize: 14 }}
                onClick={(e) => { e.preventDefault(); window.open('/regole', '_blank') }}
              >
                Regole della Community e la Privacy
              </button>
              .
            </span>
          </label>
        </div>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-brutalist btn-primary-container"
          disabled={inviando || !accettaResponsabilita || !accettaRegole}
        >
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>👑 Crea Classe e Diventa ROOT</>}
        </button>
      </div>
    </form>
  )
}

export default function Benvenuto() {
  const navigate = useNavigate()
  const { utente, caricamento } = useAuth()
  const [nicknamePreview, setNicknamePreview] = useState(generaNicknamePreview())
  const [tabAttivo, setTabAttivo] = useState('entra')

  useEffect(() => {
    if (!caricamento && utente) {
      const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
      navigate(eAncoraBannato ? '/bannato' : '/feed', { replace: true })
    }
  }, [caricamento, utente, navigate])

  function rigeneraPreview() {
    setNicknamePreview(generaNicknamePreview())
  }

  if (caricamento || utente) {
    return null
  }

  return (
    <div className="pagina">
      <div className="griglia-decorativa" />
      <header className="header-brand">
        <h1 className="text-headline-md">CLASS CHRONICLES</h1>
      </header>

      <main className="pagina-contenuto">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', textAlign: 'center' }}>
          <h2 className="text-display-lg" style={{ margin: 0 }}>
            ENTRA<br />NELLA RETE
          </h2>
          <p className="text-body-lg" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
            Anonimato totale. Alta energia. Proteggi la tua identità.
          </p>
        </div>

        <CardIdentita nicknamePreview={nicknamePreview} onRigenera={rigeneraPreview} />

        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            className={`chip-categoria ${tabAttivo === 'entra' ? 'selezionata' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setTabAttivo('entra')}
          >
            🚪 Entra in Classe
          </button>
          <button
            type="button"
            className={`chip-categoria ${tabAttivo === 'crea' ? 'selezionata' : ''}`}
            style={{ flex: 1 }}
            onClick={() => setTabAttivo('crea')}
          >
            👑 Crea Classe
          </button>
        </div>

        {tabAttivo === 'entra' ? (
          <FormEntraClasse nicknamePreview={nicknamePreview} />
        ) : (
          <FormCreaClasse nicknamePreview={nicknamePreview} />
        )}

        <p className="text-body-md" style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
          Hai già un account?{' '}
          <button type="button" className="link-testuale" onClick={() => navigate('/accedi')}>
            Accedi qui
          </button>
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', flexWrap: 'wrap', margin: 'var(--space-sm) 0' }}>
          <a
            href="https://classchronicles.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-testuale"
            style={{ fontSize: '0.875rem' }}
          >
            🌐 Sito Ufficiale
          </a>
          <a
            href="https://youtube.com/@classchroniclesdev?si=xG2_Uy0gknBKlGED"
            target="_blank"
            rel="noopener noreferrer"
            className="link-testuale"
            style={{ fontSize: '0.875rem' }}
          >
            🎬 Canale YouTube
          </a>
        </div>

        <BannerFeedback />
      </main>
    </div>
  )
}
