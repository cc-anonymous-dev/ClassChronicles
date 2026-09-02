import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import BannerFeedback from '../components/BannerFeedback'

export default function Accedi() {
  const navigate = useNavigate()
  const { accedi, utente, caricamento } = useAuth()

  const [codiceClasse, setCodiceClasse] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  useEffect(() => {
    if (!caricamento && utente) {
      const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
      navigate(eAncoraBannato ? '/bannato' : '/feed', { replace: true })
    }
  }, [caricamento, utente, navigate])

  async function gestisciInvio(e) {
    e.preventDefault()
    setErrore('')

    if (!codiceClasse.trim() || !nickname.trim() || !password) {
      setErrore('Compila tutti i campi per accedere.')
      return
    }

    setInviando(true)
    try {
      const risposta = await chiamaFunzione('login', {
        codice_classe: codiceClasse.trim(),
        nickname: nickname.trim(),
        password,
      })

      accedi({
        id: risposta.utente.id,
        nickname: risposta.utente.nickname,
        classe_id: risposta.utente.classe_id,
        ruolo: risposta.utente.ruolo,
        bannato: risposta.utente.bannato,
        bannato_fino_a: risposta.utente.bannato_fino_a,
        motivo_ban: risposta.utente.motivo_ban,
      })

      if (risposta.utente.bannato) {
        navigate('/bannato')
      } else {
        navigate('/feed')
      }
    } catch (err) {
      setErrore(err.message)
    } finally {
      setInviando(false)
    }
  }

  if (caricamento || utente) {
    return null
  }

  return (
    <div
      className="pagina"
      style={{ justifyContent: 'center', minHeight: '100dvh', overflowY: 'auto' }}
    >
      <div className="griglia-decorativa" />

      <main style={{ width: '100%', maxWidth: 400, zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              border: '2px solid var(--color-surface-bright)',
              backgroundColor: 'var(--color-surface-container)',
              marginBottom: 'var(--space-md)',
              boxShadow: '4px 4px 0px 0px var(--color-primary-fixed)',
              fontSize: 32,
            }}
          >
            🛡️
          </div>
          <h1 className="text-display-lg" style={{ margin: 0 }}>CLASS CHRONICLES</h1>
          <p
            className="text-mono-data"
            style={{
              color: 'var(--color-on-surface-variant)',
              marginTop: 'var(--space-sm)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Terminale di Accesso Sicuro
          </p>
        </div>

        <form
          onSubmit={gestisciInvio}
          style={{
            backgroundColor: 'var(--color-surface-container-low)',
            border: '2px solid var(--color-surface-bright)',
            padding: 'var(--space-xl)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: 4,
              backgroundColor: 'var(--color-surface-bright)',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* NOTA: il Nickname è PRIMA nel DOM così il browser lo riconosce come "username" per l'autocomplete.
                Visivamente appare secondo grazie a CSS order. */}
            <div className="campo-input-wrap" style={{ order: 2 }}>
              <input
                id="nickname-login"
                className="input-brutalist"
                type="text"
                placeholder=" "
                autoComplete="username"
                name="username"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={inviando}
              />
              <label className="campo-label" htmlFor="nickname-login">Nickname Anonimo</label>
            </div>

            <div className="campo-input-wrap" style={{ order: 1 }}>
              <input
                id="codice-classe-login"
                className="input-brutalist"
                type="text"
                placeholder=" "
                autoComplete="off"
                value={codiceClasse}
                onChange={(e) => setCodiceClasse(e.target.value)}
                style={{ textTransform: 'uppercase' }}
                disabled={inviando}
              />
              <label className="campo-label" htmlFor="codice-classe-login">Codice Classe</label>
            </div>

            <div className="campo-input-wrap" style={{ order: 3 }}>
              <input
                id="password-login"
                className="input-brutalist"
                type="password"
                placeholder=" "
                autoComplete="current-password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={inviando}
              />
              <label className="campo-label" htmlFor="password-login">Chiave di Accesso</label>
            </div>

            {errore && (
              <div className="messaggio-errore" role="alert">
                <span aria-hidden="true">⚠️</span>
                <span>{errore}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-brutalist"
              style={{
                backgroundColor: 'var(--color-secondary-container)',
                color: 'var(--color-on-secondary)',
                '--shadow-color': 'var(--color-primary-fixed)',
              }}
              disabled={inviando}
            >
              {inviando ? <span className="spinner" aria-hidden="true" /> : <>Accedi ↪</>}
            </button>

            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 'var(--space-md)', borderTop: '2px solid var(--color-surface-bright)',
              }}
            >
              <button
                type="button"
                className="link-testuale text-label-caps"
                style={{ color: 'var(--color-on-surface-variant)' }}
                onClick={() => navigate('/benvenuto')}
              >
                Registrati
              </button>
              <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
                🟢 Sistema Online
              </span>
            </div>
          </div>
        </form>
        <BannerFeedback />
      </main>
    </div>
  )
}
