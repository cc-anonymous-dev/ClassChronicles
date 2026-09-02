import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Bloccato({ tipo, messaggio }) {
  const navigate = useNavigate()
  const { esci } = useAuth()

  const eBloccoOrario = tipo === 'orario'

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  return (
    <div className="blocco-pagina">
      <div className="griglia-decorativa" />
      <div className="blocco-card">
        <span style={{ fontSize: 48 }} aria-hidden="true">{eBloccoOrario ? '🌙' : '⏸️'}</span>
        <h2 className="text-headline-md" style={{ margin: 0, color: 'var(--color-error)' }}>
          {eBloccoOrario ? 'App Momentaneamente Chiusa' : 'Classe Sospesa'}
        </h2>
        <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
          {messaggio || (eBloccoOrario
            ? 'L\'app non è disponibile in questo orario. Riprova più tardi.'
            : 'Questa classe è stata sospesa dalla Supervisione della piattaforma.')}
        </p>
        <button
          type="button"
          className="btn-brutalist btn-secondary-outline"
          onClick={() => navigate('/impostazioni')}
        >
          Vai alle Impostazioni Account
        </button>
        <button type="button" className="link-testuale" onClick={gestisciUscita}>
          Esci
        </button>
      </div>
    </div>
  )
}
