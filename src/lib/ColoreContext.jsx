import { createContext, useContext, useState, useEffect } from 'react'

const ColoreContext = createContext(null)
const CHIAVE_STORAGE_COLORE = 'classchronicles_colore_interfaccia'
export const COLORE_DEFAULT = '#00ffc2'

/**
 * Calcola se usare testo chiaro o scuro in base alla luminosità percepita del colore HEX.
 * Formula standard WCAG: Luminosità = 0.299*R + 0.587*G + 0.114*B (0-255)
 * Se > 128 usa testo scuro, altrimenti testo chiaro.
 */
function calcolaColoreContrasto(hex) {
  let pulito = hex.replace('#', '')
  if (pulito.length === 3) {
    pulito = pulito.split('').map((c) => c + c).join('')
  }
  const r = parseInt(pulito.substring(0, 2), 16) || 0
  const g = parseInt(pulito.substring(2, 4), 16) || 0
  const b = parseInt(pulito.substring(4, 6), 16) || 0

  const luminosita = 0.299 * r + 0.587 * g + 0.114 * b
  return luminosita > 128 ? '#0e0e0e' : '#ffffff'
}

export function ColoreProvider({ children }) {
  const [colore, setColoreState] = useState(() => {
    const salvato = localStorage.getItem(CHIAVE_STORAGE_COLORE)
    return salvato ? salvato : COLORE_DEFAULT
  })

  useEffect(() => {
    const root = document.documentElement
    const coloreContrasto = calcolaColoreContrasto(colore)

    root.style.setProperty('--color-primary-container', colore)
    root.style.setProperty('--color-on-primary-container', coloreContrasto)
    root.style.setProperty('--color-primary-fixed', colore)
    root.style.setProperty('--color-primary-fixed-dim', colore)

    localStorage.setItem(CHIAVE_STORAGE_COLORE, colore)
  }, [colore])

  function impostaColore(nuovoColore) {
    setColoreState(nuovoColore)
  }

  function ripristinaColore() {
    setColoreState(COLORE_DEFAULT)
  }

  return (
    <ColoreContext.Provider value={{ colore, impostaColore, ripristinaColore, COLORE_DEFAULT }}>
      {children}
    </ColoreContext.Provider>
  )
}

export function useColore() {
  const ctx = useContext(ColoreContext)
  if (!ctx) throw new Error('useColore deve essere usato dentro un ColoreProvider')
  return ctx
}
