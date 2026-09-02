import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const CHIAVE_ONBOARDING_VISTO = 'classchronicles_onboarding_visto'

const STEP = [
  {
    icona: '🛡️',
    titolo: 'Benvenuto in Class Chronicles',
    testo: 'Il diario digitale anonimo della tua classe. Qui puoi raccontare, ridere e leggere le cronache dei tuoi compagni, senza mai rivelare chi sei davvero.',
  },
  {
    icona: '🔒',
    titolo: 'Anonimato Vero',
    testo: 'Ti registri solo con un nickname generato a caso e una password. Nessun nome, nessuna email, nessun numero di telefono. Nemmeno l\'Admin della tua classe può risalire alla tua identità.',
  },
  {
    icona: '📜',
    titolo: 'Le Regole Contano',
    testo: 'Niente nomi veri, niente insulti, niente contenuti pericolosi. Ogni cronaca passa da un filtro automatico e da un Admin prima di essere pubblicata. Le regole complete sono sempre disponibili dall\'icona ⚠️ in alto.',
  },
  {
    icona: '🤝',
    titolo: 'Una Responsabilità Condivisa',
    testo: 'Questo spazio funziona solo se lo rispettiamo tutti. Segnala ciò che non va, chiedi la rimozione di ciò in cui ti riconosci, e ricorda: dietro ogni nickname c\'è una persona vera.',
  },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { utente, caricamento } = useAuth()
  const [stepAttuale, setStepAttuale] = useState(0)

  if (caricamento) return null

  if (utente) {
    const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
    if (eAncoraBannato) {
      return <Navigate to="/bannato" replace />
    }
  }

  function completaOnboarding() {
    localStorage.setItem(CHIAVE_ONBOARDING_VISTO, 'true')
    navigate('/benvenuto', { replace: true })
  }

  function prossimoStep() {
    if (stepAttuale < STEP.length - 1) {
      setStepAttuale(stepAttuale + 1)
    } else {
      completaOnboarding()
    }
  }

  const step = STEP[stepAttuale]
  const ultimoStep = stepAttuale === STEP.length - 1

  return (
    <div className="pagina">
      <div className="griglia-decorativa" />
      <div className="onboarding-pagina" style={{ zIndex: 1 }}>
        <div className="onboarding-step">
          <span className="onboarding-icona" aria-hidden="true">{step.icona}</span>
          <h2 className="text-display-lg" style={{ fontSize: 26, textAlign: 'center', margin: 0 }}>
            {step.titolo}
          </h2>
          <p className="text-body-lg" style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            {step.testo}
          </p>
        </div>

        <div className="onboarding-puntini">
          {STEP.map((_, i) => (
            <span key={i} className={`onboarding-puntino ${i === stepAttuale ? 'attivo' : ''}`} />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <button type="button" className="btn-brutalist btn-primary" onClick={prossimoStep}>
            {ultimoStep ? 'Ho Capito, Iniziamo →' : 'Avanti'}
          </button>
          {!ultimoStep && (
            <button type="button" className="link-testuale" style={{ textAlign: 'center' }} onClick={completaOnboarding}>
              Salta introduzione
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function onboardingGiaVisto() {
  return localStorage.getItem(CHIAVE_ONBOARDING_VISTO) === 'true'
}
