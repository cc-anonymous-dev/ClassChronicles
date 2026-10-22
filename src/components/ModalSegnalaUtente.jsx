import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ModalSegnalaUtente({ nickname, onConferma, onChiudi }) {
  const { t } = useTranslation()
  const [motivo, setMotivo] = useState('')
  const [inviando, setInviando] = useState(false)
  const [errore, setErrore] = useState('')

  async function gestisciInvio() {
    if (!motivo.trim()) return
    setErrore('')
    setInviando(true)
    try {
      await onConferma(motivo.trim())
    } catch (err) {
      setErrore(err.message || t('comune.errore_generico'))
    } finally {
      setInviando(false)
    }
  }

  return (
    <div className="rimozione-modal-overlay" onClick={onChiudi}>
      <div className="rimozione-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rimozione-modal-header">
          <div>
            <h3 className="text-headline-md" style={{ margin: 0, color: 'var(--color-error)' }}>
              {t('membri.modal_segnala_titolo', { nickname })}
            </h3>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4, fontSize: 14 }}>
              {t('membri.modal_segnala_sottotitolo')}
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
            {t('membri.modal_segnala_avviso')}
          </span>
        </div>

        <div className="campo-input-wrap">
          <textarea
            className="textarea-brutalist"
            style={{ minHeight: 90 }}
            placeholder={t('membri.modal_segnala_placeholder')}
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
          disabled={inviando || !motivo.trim()}
        >
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>{t('membri.modal_segnala_invia')}</>}
        </button>
      </div>
    </div>
  )
}
