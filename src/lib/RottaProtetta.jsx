import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { chiamaFunzione } from './supabaseClient'
import Bloccato from '../pages/Bloccato'

const ROTTE_SEMPRE_ACCESSIBILI = ['/impostazioni']

export default function RottaProtetta({ children }) {
  const { utente, caricamento, accedi } = useAuth()
  const location = useLocation()
  const [statoPiattaforma, setStatoPiattaforma] = useState(null)
  const [controllando, setControllando] = useState(true)

  useEffect(() => {
    if (!utente) {
      setControllando(false)
      return
    }
    let cancellato = false

    async function eseguiControlli() {
      try {
        const risposta = await chiamaFunzione('controlla-stato-piattaforma', { utente_id: utente.id })
        if (!cancellato) {
          setStatoPiattaforma(risposta)

          // Se la Edge Function restituisce uno stato ban diverso da quello in sessione, aggiorniamo il Context
          // (La Edge Function usa service_role, quindi legge i dati reali dal DB senza blocchi RLS)
          const banCambiato = risposta.bannato_fino_a !== utente.bannato_fino_a
          if (banCambiato) {
            accedi({ ...utente, bannato_fino_a: risposta.bannato_fino_a, motivo_ban: risposta.motivo_ban })
          }
        }
      } catch {
        if (!cancellato) setStatoPiattaforma({ blocco_orario_attivo: false, classe_sospesa: false })
      } finally {
        if (!cancellato) setControllando(false)
      }
    }

    eseguiControlli()

    return () => { cancellato = true }
  }, [utente, location.pathname, accedi])

  if (caricamento || controllando) return null

  if (!utente) {
    return <Navigate to="/accedi" replace />
  }

  const eAncoraBannato = utente.bannato_fino_a && new Date(utente.bannato_fino_a) > new Date()
  if (eAncoraBannato) {
    return <Navigate to="/bannato" replace />
  }

  const rottaSempreAccessibile = ROTTE_SEMPRE_ACCESSIBILI.includes(location.pathname)

  if (!rottaSempreAccessibile && statoPiattaforma?.blocco_orario_attivo) {
    return <Bloccato tipo="orario" messaggio={statoPiattaforma.messaggio_blocco_orario} />
  }

  if (!rottaSempreAccessibile && statoPiattaforma?.classe_sospesa) {
    return <Bloccato tipo="sospensione" messaggio={statoPiattaforma.motivo_sospensione} />
  }

  return children
}
