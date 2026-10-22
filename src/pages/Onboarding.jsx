import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../lib/AuthContext'
import SelettoreLinguaRapido from '../components/SelettoreLinguaRapido'

const CHIAVE_ONBOARDING_VISTO = 'classchronicles_onboarding_visto'

const ICONE_STEP = ['🛡️', '🔒', '📜', '🤝']

export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { utente, caricamento } = useAuth()
  const [stepAttuale, setStepAttuale] = useState(0)

  const steps = [
    {
      icona: ICONE_STEP[0],
      titolo: t('onboarding.step_0_titolo'),
      testo: t('onboarding.step_0_testo'),
    },
    {
      icona: ICONE_STEP[1],
      titolo: t('onboarding.step_1_titolo'),
      testo: t('onboarding.step_1_testo'),
    },
    {
      icona: ICONE_STEP[2],
      titolo: t('onboarding.step_2_titolo'),
      testo: t('onboarding.step_2_testo'),
    },
    {
      icona: ICONE_STEP[3],
      titolo: t('onboarding.step_3_titolo'),
      testo: t('onboarding.step_3_testo'),
    },
  ]

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
    if (stepAttuale < steps.length - 1) {
      setStepAttuale(stepAttuale + 1)
    } else {
      completaOnboarding()
    }
  }

  const step = steps[stepAttuale]
  const ultimoStep = stepAttuale === steps.length - 1

  return (
    <div className="pagina">
      <div className="griglia-decorativa" />
      <div className="onboarding-pagina" style={{ zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: 'var(--space-xs)' }}>
          <SelettoreLinguaRapido />
        </div>
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
          {steps.map((_, i) => (
            <span key={i} className={`onboarding-puntino ${i === stepAttuale ? 'attivo' : ''}`} />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <button type="button" className="btn-brutalist btn-primary" onClick={prossimoStep}>
            {ultimoStep ? t('onboarding.btn_iniziamo') : t('onboarding.btn_avanti')}
          </button>
          {!ultimoStep && (
            <button type="button" className="link-testuale" style={{ textAlign: 'center' }} onClick={completaOnboarding}>
              {t('onboarding.salta')}
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
