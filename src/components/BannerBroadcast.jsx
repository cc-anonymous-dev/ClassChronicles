import { useState } from 'react'

/**
 * Mostra i broadcast attivi come banner in cima al Feed.
 * Chiudere un banner lo nasconde solo per questa sessione del browser
 * (non lo marca come "letto" nel database): se l'utente ricarica la
 * pagina o il broadcast è ancora attivo, potrebbe ricomparire.
 * Questo è intenzionale: i broadcast sono avvisi importanti (es. da
 * parte del Supervisore) che non vogliamo si possano perdere per sempre
 * con un click accidentale.
 */
export default function BannerBroadcast({ broadcast }) {
  const [idNascosti, setIdNascosti] = useState([])

  const broadcastVisibili = broadcast.filter((b) => !idNascosti.includes(b.id))

  if (broadcastVisibili.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {broadcastVisibili.map((b) => (
        <div key={b.id} className="banner-broadcast">
          <span aria-hidden="true">📢</span>
          <span className="banner-broadcast-testo">{b.testo}</span>
          <button
            type="button"
            className="banner-broadcast-chiudi"
            onClick={() => setIdNascosti((prec) => [...prec, b.id])}
            aria-label="Nascondi avviso"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
