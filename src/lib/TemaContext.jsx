import { createContext, useContext, useState, useEffect } from 'react'

const TemaContext = createContext(null)
const CHIAVE_STORAGE_TEMA = 'classchronicles_tema'

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(() => {
    const salvato = localStorage.getItem(CHIAVE_STORAGE_TEMA)
    return salvato ? salvato : 'scuro' // Scuro come predefinito
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema)
    localStorage.setItem(CHIAVE_STORAGE_TEMA, tema)
  }, [tema])

  function impostaTemaScuro() {
    setTema('scuro')
  }

  function impostaTemaChiaro() {
    setTema('chiaro')
  }

  function toggleTema() {
    setTema((prec) => (prec === 'scuro' ? 'chiaro' : 'scuro'))
  }

  return (
    <TemaContext.Provider value={{ tema, setTema, impostaTemaScuro, impostaTemaChiaro, toggleTema }}>
      {children}
    </TemaContext.Provider>
  )
}

export function useTema() {
  const ctx = useContext(TemaContext)
  if (!ctx) throw new Error('useTema deve essere usato dentro un TemaProvider')
  return ctx
}
