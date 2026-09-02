import { useState } from 'react'

export default function ModalSegnalaUtente({ nickname, onConferma, onChiudi }) {
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
      setErrore(err.message || 'Impossibile inviare la segnalazione. Riprova.')
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
              SEGNALA @{nickname}
            </h3>
            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', marginTop: 4, fontSize: 14 }}>
              Descrivi il comportamento scorretto. La segnalazione è anonima.
            </p>
          </div>
          <button
            type="button"
            onClick={onChiudi}
            aria-label="Chiudi"
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
            Usa questo strumento solo per comportamenti scorretti reali. Segnalazioni false o
            usate per vendette personali possono comportare restrizioni del tuo account.
          </span>
        </div>

        <div className="campo-input-wrap">
          <textarea
            className="textarea-brutalist"
            style={{ minHeight: 90 }}
            placeholder="Es: continua a scrivere messaggi offensivi verso altri compagni..."
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
          {inviando ? <span className="spinner" aria-hidden="true" /> : <>🚩 Invia Segnalazione</>}
        </button>
      </div>
    </div>
  )
}
