import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { useZoom } from '../lib/ZoomContext'
import { useTema } from '../lib/TemaContext'
import { useColore } from '../lib/ColoreContext'
import LayoutApp from '../components/LayoutApp'
import BannerFeedback from '../components/BannerFeedback'

function ControlloLingua() {
  const { t, i18n } = useTranslation()
  const linguaAttuale = i18n.language?.startsWith('en') ? 'en' : 'it'

  return (
    <div className="neo-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <span className="text-body-md" style={{ fontWeight: 600 }}>{t('impostazioni.lingua_titolo')}</span>
        <p className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: 0 }}>
          {t('impostazioni.lingua_desc')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 4 }}>
          <button
            type="button"
            className={`btn-brutalist ${linguaAttuale === 'it' ? 'btn-primary-container' : 'btn-secondary-outline'}`}
            style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
            onClick={() => i18n.changeLanguage('it')}
          >
            {t('impostazioni.lingua_it')} {linguaAttuale === 'it' && t('impostazioni.attivo')}
          </button>
          <button
            type="button"
            className={`btn-brutalist ${linguaAttuale === 'en' ? 'btn-primary-container' : 'btn-secondary-outline'}`}
            style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
            onClick={() => i18n.changeLanguage('en')}
          >
            {t('impostazioni.lingua_en')} {linguaAttuale === 'en' && t('impostazioni.attivo')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ControlloTema() {
  const { t } = useTranslation()
  const { tema, impostaTemaScuro, impostaTemaChiaro } = useTema()

  return (
    <div className="neo-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <span className="text-body-md" style={{ fontWeight: 600 }}>{t('impostazioni.tema_titolo')}</span>
        <p className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: 0 }}>
          {t('impostazioni.tema_desc')}
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 4 }}>
          <button
            type="button"
            className={`btn-brutalist ${tema === 'scuro' ? 'btn-primary-container' : 'btn-secondary-outline'}`}
            style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
            onClick={impostaTemaScuro}
          >
            {t('impostazioni.tema_scuro')} {tema === 'scuro' && t('impostazioni.attivo')}
          </button>
          <button
            type="button"
            className={`btn-brutalist ${tema === 'chiaro' ? 'btn-primary-container' : 'btn-secondary-outline'}`}
            style={{ flex: 1, padding: '10px 14px', fontSize: 14 }}
            onClick={impostaTemaChiaro}
          >
            {t('impostazioni.tema_chiaro')} {tema === 'chiaro' && t('impostazioni.attivo')}
          </button>
        </div>
      </div>
    </div>
  )
}

function ControlloColore() {
  const { t } = useTranslation()
  const { colore, impostaColore, ripristinaColore, COLORE_DEFAULT } = useColore()

  return (
    <div className="neo-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-body-md" style={{ fontWeight: 600 }}>{t('impostazioni.colore_titolo')}</span>
          {colore.toLowerCase() !== COLORE_DEFAULT.toLowerCase() && (
            <button
              type="button"
              className="link-testuale"
              style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}
              onClick={ripristinaColore}
            >
              {t('comune.ripristina_predefinito')}
            </button>
          )}
        </div>
        <p className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', margin: 0 }}>
          {t('impostazioni.colore_desc')}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 4 }}>
          <input
            id="picker-colore-interfaccia"
            type="color"
            value={colore}
            onChange={(e) => impostaColore(e.target.value)}
            style={{
              width: 50,
              height: 42,
              padding: 0,
              border: '2px solid var(--color-outline-variant)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: 0,
            }}
            aria-label={t('impostazioni.colore_titolo')}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15, color: 'var(--color-primary-fixed)' }}>
              {colore.toUpperCase()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
              {colore.toLowerCase() === COLORE_DEFAULT.toLowerCase() ? t('impostazioni.colore_predefinito') : t('impostazioni.colore_personalizzato')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ControlloZoom() {
  const { t } = useTranslation()
  const { livelloZoom, aumentaZoom, diminuisciZoom, ripristinaZoom, ZOOM_MINIMO, ZOOM_MASSIMO } = useZoom()

  return (
    <div className="neo-card">
      <div className="controllo-zoom">
        <div>
          <span className="text-body-md" style={{ fontWeight: 600, display: 'block' }}>{t('impostazioni.zoom_titolo')}</span>
          <button
            type="button"
            className="link-testuale"
            style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}
            onClick={ripristinaZoom}
          >
            {t('comune.ripristina_predefinito')}
          </button>
        </div>
        <div className="controllo-zoom-bottoni">
          <button
            type="button"
            className="btn-zoom"
            onClick={diminuisciZoom}
            disabled={livelloZoom <= ZOOM_MINIMO}
            aria-label={t('impostazioni.zoom_riduci')}
          >
            A-
          </button>
          <span className="zoom-percentuale">{livelloZoom}%</span>
          <button
            type="button"
            className="btn-zoom"
            onClick={aumentaZoom}
            disabled={livelloZoom >= ZOOM_MASSIMO}
            aria-label={t('impostazioni.zoom_aumenta')}
          >
            A+
          </button>
        </div>
      </div>
    </div>
  )
}

function SezioneEliminaAccount({ utente, onEliminato }) {
  const { t } = useTranslation()
  const [mostraForm, setMostraForm] = useState(false)
  const [password, setPassword] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciEliminazione() {
    if (!password) return
    setErrore('')
    setInviando(true)
    try {
      await chiamaFunzione('elimina-account', { utente_id: utente.id, password })
      onEliminato()
    } catch (err) {
      setErrore(err.message)
      setInviando(false)
    }
  }

  return (
    <div className="zona-pericolo">
      <div className="zona-pericolo-danger-header">
        <span aria-hidden="true">⚠️</span>
        <span>{t('impostazioni.elimina_account_titolo')}</span>
      </div>

      {!mostraForm ? (
        <>
          <p className="text-body-md" style={{ margin: 0, textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            {t('impostazioni.elimina_account_desc')}
          </p>
          <button className="btn-autodistruzione" onClick={() => setMostraForm(true)}>
            {t('impostazioni.btn_elimina')}
          </button>
        </>
      ) : (
        <div className="conferma-autodistruzione-box">
          <p className="text-body-md" style={{ margin: 0 }}>
            {t('impostazioni.elimina_conferma_desc')}
          </p>

          {errore && (
            <div className="messaggio-errore" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{errore}</span>
            </div>
          )}

          <div className="campo-input-wrap">
            <input
              id="password-elimina-account"
              className="input-brutalist"
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={inviando}
            />
            <label className="campo-label" htmlFor="password-elimina-account">{t('impostazioni.campo_password')}</label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              className="btn-autodistruzione"
              style={{ flex: 1 }}
              onClick={gestisciEliminazione}
              disabled={inviando || !password}
            >
              {inviando ? <span className="spinner" aria-hidden="true" /> : t('impostazioni.btn_conferma_elimina')}
            </button>
            <button
              className="btn-azione-piccolo"
              onClick={() => { setMostraForm(false); setPassword(''); setErrore('') }}
              disabled={inviando}
            >
              {t('admin.btn_annulla')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Impostazioni() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { utente, esci } = useAuth()

  function gestisciAccountEliminato() {
    esci()
    navigate('/accedi')
  }

  return (
    <LayoutApp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <h2 className="text-headline-md" style={{ margin: 0 }}>{t('impostazioni.titolo')}</h2>

        <ControlloLingua />
        <ControlloTema />
        <ControlloColore />
        <ControlloZoom />
        <SezioneEliminaAccount utente={utente} onEliminato={gestisciAccountEliminato} />
        
        <div className="neo-card" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <h3 className="text-title-lg" style={{ margin: '0 0 var(--space-sm) 0' }}>{t('impostazioni.risorse_titolo')}</h3>
          <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', margin: '0 0 var(--space-md) 0' }}>
            {t('impostazioni.risorse_desc')}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <a
              href="https://classchronicles.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutalist btn-secondary-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', textDecoration: 'none' }}
            >
              {t('impostazioni.sito_web')}
            </a>
            <a
              href="https://youtube.com/@classchroniclesdev?si=xG2_Uy0gknBKlGED"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutalist btn-secondary-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', textDecoration: 'none' }}
            >
              {t('impostazioni.canale_youtube')}
            </a>
          </div>
        </div>

        <BannerFeedback />
      </div>
    </LayoutApp>
  )
}
