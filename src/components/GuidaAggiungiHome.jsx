import { useState, useEffect } from 'react'
import { rilevaPiattaforma } from '../lib/rilevaPiattaforma'

const CONTENUTI = {
  'ios-safari': {
    titolo: 'Installa su iPhone/iPad',
    passi: [
      { icona: '⬆️', testo: <>Tocca l'icona <strong>Condividi</strong> nella barra in basso (il quadrato con la freccia verso l'alto)</> },
      { icona: '➕', testo: <>Scorri e tocca <strong>"Aggiungi a Home"</strong></> },
      { icona: '✅', testo: <>Tocca <strong>"Aggiungi"</strong> in alto a destra</> },
    ],
  },
  'ios-altro-browser': {
    titolo: 'Installa su iPhone/iPad',
    passi: [
      { icona: 'ℹ️', testo: <>Su iPhone/iPad, per installare l'app devi usare <strong>Safari</strong> (non funziona da altri browser come Chrome)</> },
      { icona: '🧭', testo: <>Apri questo sito in Safari, poi tocca <strong>Condividi</strong> → <strong>"Aggiungi a Home"</strong></> },
    ],
  },
  'android-chrome': {
    titolo: 'Installa su Android',
    passi: [
      { icona: '⋮', testo: <>Tocca i <strong>tre puntini</strong> in alto a destra nel browser</> },
      { icona: '📲', testo: <>Tocca <strong>"Installa app"</strong> oppure <strong>"Aggiungi a schermata Home"</strong></> },
      { icona: '✅', testo: <>Conferma toccando <strong>"Installa"</strong></> },
    ],
  },
  'samsung-browser': {
    titolo: 'Installa su Samsung Internet',
    passi: [
      { icona: '☰', testo: <>Tocca l'icona <strong>Menu</strong> in basso (le tre linee)</> },
      { icona: '➕', testo: <>Tocca <strong>"Aggiungi pagina a"</strong></> },
      { icona: '🏠', testo: <>Seleziona <strong>"Schermata Home"</strong></> },
    ],
  },
  'android-altro-browser': {
    titolo: 'Installa su Android',
    passi: [
      { icona: 'ℹ️', testo: <>Per la migliore esperienza, apri questo sito con <strong>Chrome</strong></> },
      { icona: '⋮', testo: <>Poi tocca il menu del browser e cerca <strong>"Aggiungi a schermata Home"</strong></> },
    ],
  },
  'desktop-o-non-supportato': {
    titolo: 'Installa Class Chronicles',
    passi: [
      { icona: '📱', testo: <>Questa funzione è pensata per smartphone. Apri questo sito dal tuo telefono per installarlo come app</> },
    ],
  },
}

export default function GuidaAggiungiHome({ pulsanteInline }) {
  const [piattaforma, setPiattaforma] = useState(null)
  const [mostraGuida, setMostraGuida] = useState(false)

  useEffect(() => {
    const rilevata = rilevaPiattaforma()
    setPiattaforma(rilevata)
  }, [])

  if (!piattaforma || piattaforma.tipo === 'installata') return null

  const contenuto = CONTENUTI[piattaforma.tipo]

  return (
    <>
      {pulsanteInline ? (
        <button
          type="button"
          className="btn-brutalist btn-secondary-outline"
          onClick={() => setMostraGuida(true)}
        >
          📲 Installa l'App sulla Home
        </button>
      ) : (
        !mostraGuida && (
          <button
            type="button"
            className="pulsante-mostra-guida btn-brutalist btn-primary-container"
            onClick={() => setMostraGuida(true)}
          >
            📲 Installa l'App
          </button>
        )
      )}

      {mostraGuida && (
        <div className="guida-home-overlay" onClick={() => setMostraGuida(false)}>
          <div className="guida-home-scheda" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="text-headline-md" style={{ margin: 0 }}>{contenuto.titolo}</h3>
              <button
                type="button"
                onClick={() => setMostraGuida(false)}
                aria-label="Chiudi"
                style={{ background: 'none', border: 'none', color: 'var(--color-on-surface)', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)', margin: 0 }}>
              Aggiungi Class Chronicles alla schermata Home per aprirla come una vera app, senza passare dal browser.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {contenuto.passi.map((passo, i) => (
                <div key={i} className="guida-home-passo">
                  <span className="guida-home-numero">{i + 1}</span>
                  <p className="text-body-md" style={{ margin: 0 }}>
                    <span className="guida-home-icona-esempio" style={{ marginRight: 8 }} aria-hidden="true">
                      {passo.icona}
                    </span>
                    {passo.testo}
                  </p>
                </div>
              ))}
            </div>

            <button type="button" className="btn-brutalist btn-secondary-outline" onClick={() => setMostraGuida(false)}>
              Ho Capito
            </button>
          </div>
        </div>
      )}
    </>
  )
}
