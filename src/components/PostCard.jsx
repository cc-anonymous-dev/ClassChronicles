import { useState, useRef } from 'react'
import { tempoRelativo } from '../lib/formattazione'
import ModalRichiediRimozione from './ModalRichiediRimozione'

export default function PostCard({ post, onSegnala, onRichiediRimozione, onMetiMiPiace }) {
  const [segnalazioneInviata, setSegnalazioneInviata] = useState(false)
  const [mostraConfermaSegnalazione, setMostraConfermaSegnalazione] = useState(false)
  const [mostraModalRimozione, setMostraModalRimozione] = useState(false)
  const [richiestaRimozioneInviata, setRichiestaRimozioneInviata] = useState(false)
  const [miPiaceAttivo, setMiPiaceAttivo] = useState(Boolean(post.mi_piace_attivo))
  const [numeroMiPiace, setNumeroMiPiace] = useState(Number(post.numero_mi_piace) || 0)
  const [elaborandoLike, setElaborandoLike] = useState(false)
  const [errore, setErrore] = useState('')
  // useRef invece di solo useState: il valore si aggiorna ISTANTANEAMENTE,
  // senza aspettare il prossimo render. Serve per bloccare davvero i click
  // doppi/ravvicinati (es. doppio tap su mobile), cosa che uno stato React
  // da solo non garantisce essere già aggiornato al click successivo.
  const richiestaInCorso = useRef(false)

  async function gestisciSegnalazione() {
    setErrore('')
    try {
      await onSegnala(post.id)
      setSegnalazioneInviata(true)
      setMostraConfermaSegnalazione(false)
    } catch (err) {
      setErrore(err.message || 'Impossibile inviare la segnalazione. Riprova.')
      setMostraConfermaSegnalazione(false)
    }
  }

  async function gestisciRichiestaRimozione(motivo) {
    setErrore('')
    try {
      await onRichiediRimozione(post.id, motivo)
      setRichiestaRimozioneInviata(true)
      setMostraModalRimozione(false)
    } catch (err) {
      setErrore(err.message || 'Impossibile inviare la richiesta di rimozione. Riprova.')
      throw err
    }
  }

  async function gestisciLike() {
    if (richiestaInCorso.current) return
    richiestaInCorso.current = true
    setElaborandoLike(true)
    setErrore('')

    // Aggiornamento ottimistico: cambiamo subito l'interfaccia,
    // poi correggiamo se il server risponde diversamente.
    const statoPrecedente = miPiaceAttivo
    const conteggioPrecedente = numeroMiPiace
    setMiPiaceAttivo(!statoPrecedente)
    setNumeroMiPiace(statoPrecedente ? conteggioPrecedente - 1 : conteggioPrecedente + 1)

    try {
      const risposta = await onMetiMiPiace(post.id)
      setMiPiaceAttivo(Boolean(risposta.mi_piace_attivo))
      setNumeroMiPiace(Number(risposta.numero_mi_piace) || 0)
    } catch (err) {
      // Ripristiniamo lo stato precedente in caso di errore
      setMiPiaceAttivo(statoPrecedente)
      setNumeroMiPiace(conteggioPrecedente)
      setErrore(err.message || 'Impossibile aggiornare il mi piace. Riprova.')
    } finally {
      setElaborandoLike(false)
      richiestaInCorso.current = false
    }
  }

  if (segnalazioneInviata) {
    return (
      <article className="post-card" style={{ opacity: 0.6 }}>
        <p className="text-body-md" style={{ margin: 0, textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
          🚩 Cronaca segnalata. Grazie per aver contribuito a mantenere la classe sicura.
        </p>
      </article>
    )
  }

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-card-autore">
          <span aria-hidden="true">🔒</span>
          <span>@{post.autore_nickname}</span>
        </div>
        <span className="post-card-tempo">{tempoRelativo(post.creato_il)}</span>
      </div>

      <h3 className="post-card-titolo">{post.titolo}</h3>
      <p className="post-card-contenuto">{post.contenuto}</p>

      {errore && (
        <div className="messaggio-errore" role="alert" style={{ marginBottom: 12 }}>
          <span aria-hidden="true">⚠️</span>
          <span>{errore}</span>
        </div>
      )}

      {richiestaRimozioneInviata && (
        <div className="messaggio-successo" role="status">
          <span aria-hidden="true">✅</span>
          <span>Richiesta di rimozione inviata in forma anonima.</span>
        </div>
      )}

      <div className="post-card-azioni" style={{ flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`post-card-azione-btn like-btn ${miPiaceAttivo ? 'like-attivo' : ''}`}
          onClick={gestisciLike}
          disabled={elaborandoLike}
          aria-pressed={miPiaceAttivo}
          aria-label={miPiaceAttivo ? 'Togli mi piace' : 'Metti mi piace'}
        >
          <span aria-hidden="true">{miPiaceAttivo ? '❤️' : '🤍'}</span>
          <span>{numeroMiPiace}</span>
        </button>

        {!richiestaRimozioneInviata && (
          <button
            type="button"
            className="post-card-azione-btn"
            onClick={() => setMostraModalRimozione(true)}
          >
            <span aria-hidden="true">🙈</span>
            <span>Mi riconosco</span>
          </button>
        )}

        {!mostraConfermaSegnalazione ? (
          <button
            type="button"
            className="post-card-azione-btn segnala"
            style={{ marginLeft: 'auto' }}
            onClick={() => setMostraConfermaSegnalazione(true)}
          >
            <span aria-hidden="true">🚩</span>
            <span>Segnala</span>
          </button>
        ) : (
          <span style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <span className="text-body-md" style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
              Confermi?
            </span>
            <button
              type="button"
              className="post-card-azione-btn segnala"
              onClick={gestisciSegnalazione}
              style={{ fontWeight: 700 }}
            >
              Sì
            </button>
            <button
              type="button"
              className="post-card-azione-btn"
              onClick={() => setMostraConfermaSegnalazione(false)}
            >
              No
            </button>
          </span>
        )}
      </div>

      {mostraModalRimozione && (
        <ModalRichiediRimozione
          onConferma={gestisciRichiestaRimozione}
          onChiudi={() => setMostraModalRimozione(false)}
        />
      )}
    </article>
  )
}
