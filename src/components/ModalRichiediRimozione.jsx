import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ModalRichiediRimozione({ onConferma, onChiudi }) {
  const { t } = useTranslation()
  const [motivo, setMotivo] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciInvio() {
    setErrore('')
    setInviando(true)
    try {
      await onConferma(motivo.trim())
    } catch (err) {
      setErrore(err.message || 'Impossibile inviare la richiesta di rimozione. Riprova.')
    } finally {
      setInviando(false)
    }
  }

  return (
    <div className="rimozione-modal-overlay" onClick={onChiudi}>
      <div className="rimozione-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rimozione-modal-header">
          <div>
            <h3 className="text-headline-md" style={{ margin: 0, color: 'var(--color-tertiary-container)' }}>
              {t('postcard.modal_rimozione_titolo')}
            </h3>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4, fontSize: 14 }}>
              {t('postcard.modal_rimozione_sottotitolo')}
            </p>
          </div>
          <button
            type="button"
            onClick={onChiudi}
            aria-label={t('comune.chiudi')}
            style={{ background: 'none', border: 'none', color: 'var(--color-on-surface)', fontSize: 20, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        <div className="messaggio-errore" role="note" style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}>
          <span aria-hidden="true">⚠️</span>
          <span>
            {t('postcard.modal_rimozione_avviso')}
          </span>
        </div>

        <div className="campo-input-wrap">
          <textarea
            className="textarea-brutalist"
            style={{ minHeight: 90 }}
            placeholder={t('postcard.modal_rimozione_placeholder')}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            disabled={inviando}
            maxLength={300}
          />
        </div>

        <button
          className="btn-brutalist"
          style={{ backgroundColor: 'var(--color-error-strong)', color: 'var(--color-on-error)', '--shadow-color': 'var(--color-error)' }}
          onClick={gestisciInvio}
          disabled={inviando}
        >
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>🚩 {t('postcard.modal_rimozione_invia')}</>}
        </button>
      </div>
    </div>
  )
}
