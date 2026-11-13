import { chiamaFunzione } from './supabaseClient'
import { rilevaPiattaforma } from './rilevaPiattaforma'

/**
 * Converte una chiave VAPID Base64 in Uint8Array per PushManager.subscribe
 */
export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Verifica se il browser supporta sia i Service Worker che PushManager e Notification
 */
export function supportaNotifichePush() {
  if (typeof window === 'undefined') return false
  const haSW = 'serviceWorker' in navigator
  const haPush = 'PushManager' in window
  const piattaforma = rilevaPiattaforma()
  const eIOS = Boolean(piattaforma?.tipo && (piattaforma.tipo.startsWith('ios') || piattaforma.tipo === 'installata'))
  return haSW && (haPush || eIOS)
}

/**
 * Verifica se ci troviamo su iOS non in modalità standalone (non aperto dalla Home)
 */
export function eIOSNonStandalone() {
  const piattaforma = rilevaPiattaforma()
  return piattaforma.tipo !== 'installata' && piattaforma.tipo.startsWith('ios')
}

/**
 * Recupera l'iscrizione PushManager attiva (se presente)
 */
export async function ottieniIscrizionePush() {
  if (!supportaNotifichePush() || eIOSNonStandalone() || typeof window === 'undefined' || !('PushManager' in window)) return null
  try {
    const reg = await navigator.serviceWorker.ready
    if (!reg?.pushManager) return null
    return await reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

/**
 * Richiede il permesso e attiva l'iscrizione alle notifiche push per l'utente
 */
export async function attivaNotifichePush(utenteId) {
  if (!supportaNotifichePush()) {
    throw new Error('Il tuo browser non supporta le notifiche push.')
  }

  if (eIOSNonStandalone()) {
    throw new Error("Installa l'app sulla Home per attivare le notifiche.")
  }

  const permesso = await Notification.requestPermission()
  if (permesso !== 'granted') {
    throw new Error('Permesso per le notifiche non concesso nel browser.')
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!vapidPublicKey) {
    throw new Error('Chiave pubblica VAPID non configurata nell\'applicazione.')
  }

  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()

  if (!sub) {
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    })
  }

  await chiamaFunzione('registra-notifiche', {
    utente_id: utenteId,
    azione: 'attiva',
    subscription: sub.toJSON(),
  })

  return sub
}

/**
 * Disattiva l'iscrizione alle notifiche push locale e sul server
 */
export async function disattivaNotifichePush(utenteId) {
  if (!supportaNotifichePush()) return

  try {
    const reg = await navigator.serviceWorker.ready.catch(() => null)
    if (!reg?.pushManager) return

    const sub = await reg.pushManager.getSubscription().catch(() => null)
    if (!sub) return

    const endpoint = sub.endpoint

    // Disiscrizione browser
    await sub.unsubscribe().catch(() => {})

    // Notifica backend
    if (utenteId) {
      await chiamaFunzione('registra-notifiche', {
        utente_id: utenteId,
        azione: 'disattiva',
        endpoint,
      }).catch(() => {})
    }
  } catch (err) {
    console.error('Errore durante disattivazione notifiche push:', err)
  }
}
