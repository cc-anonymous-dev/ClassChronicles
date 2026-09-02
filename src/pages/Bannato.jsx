import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import BannerFeedback from '../components/BannerFeedback'

function giorniRimanenti(dataIso) {
  const scadenza = new Date(dataIso)
  const oraAttuale = new Date()
  const msRimanenti = scadenza - oraAttuale
  return Math.max(1, Math.ceil(msRimanenti / (1000 * 60 * 60 * 24)))
}

function dataFormattata(dataIso) {
  return new Date(dataIso).toLocaleDateString('it-IT', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Bannato() {
  const navigate = useNavigate()
  const { utente, esci } = useAuth()

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  if (!utente?.bannato_fino_a) {
    // Se per qualche motivo non ci sono dati di ban, torniamo al feed
    // invece di mostrare una schermata vuota/rotta.
    navigate('/feed')
    return null
  }

  return (
    <div className="pagina" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100dvh' }}>
      <div className="griglia-decorativa" />
      <div
        className="neo-card"
        style={{
          maxWidth: 420, zIndex: 1, textAlign: 'center',
          borderColor: 'var(--color-error)',
          backgroundColor: 'var(--color-surface-container)',
        }}
      >
        <span style={{ fontSize: 48 }}>🚫</span>
        <h2 className="text-headline-md" style={{ margin: 0, color: 'var(--color-error)' }}>
          Accesso Sospeso
        </h2>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          Il tuo account è stato temporaneamente sospeso da un Admin della classe.
        </p>

        <div
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '2px solid var(--color-error)',
            padding: 'var(--space-md)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
          }}
        >
          <div>
            <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>Motivo</span>
            <p className="text-body-md" style={{ margin: 0 }}>{utente.motivo_ban || 'Non specificato'}</p>
          </div>
          <div>
            <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>Sospensione attiva fino a</span>
            <p className="text-body-md" style={{ margin: 0 }}>{dataFormattata(utente.bannato_fino_a)}</p>
          </div>
          <div>
            <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>Giorni rimanenti</span>
            <p className="text-body-md" style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
              {giorniRimanenti(utente.bannato_fino_a)}
            </p>
          </div>
        </div>

        <BannerFeedback />

        <button className="btn-brutalist btn-secondary-outline" onClick={gestisciUscita}>
          Esci
        </button>
      </div>
    </div>
  )
}
