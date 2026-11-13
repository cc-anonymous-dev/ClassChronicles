import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { disattivaNotifichePush } from './notifichePush'

const AuthContext = createContext(null)

const CHIAVE_STORAGE = 'classchronicles_sessione'

/**
 * Gestisce la sessione dell'utente loggato (nickname, id, classe_id).
 * Salviamo in localStorage SOLO informazioni non sensibili
 * (mai la password, mai il codice classe in chiaro).
 */
export function AuthProvider({ children }) {
  const [utente, setUtente] = useState(null)
  const [caricamento, setCaricamento] = useState(true)

  useEffect(() => {
    const salvato = localStorage.getItem(CHIAVE_STORAGE)
    if (salvato) {
      try {
        setUtente(JSON.parse(salvato))
      } catch {
        localStorage.removeItem(CHIAVE_STORAGE)
      }
    }
    setCaricamento(false)
  }, [])

  const accedi = useCallback((datiUtente) => {
    setUtente(datiUtente)
    localStorage.setItem(CHIAVE_STORAGE, JSON.stringify(datiUtente))
  }, [])

  const esci = useCallback(async () => {
    const idCorrente = utente?.id
    setUtente(null)
    localStorage.removeItem(CHIAVE_STORAGE)
    if (idCorrente) {
      await disattivaNotifichePush(idCorrente).catch(() => {})
    }
  }, [utente?.id])

  return (
    <AuthContext.Provider value={{ utente, accedi, esci, caricamento }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro un AuthProvider')
  return ctx
}


