/**
 * Rileva dispositivo/browser per mostrare istruzioni "Aggiungi alla Home"
 * specifiche. Usiamo lo user agent perché non esiste un'API standard
 * per chiedere "che browser sei" — è la tecnica comune per questo scopo.
 */
export function rilevaPiattaforma() {
  const ua = navigator.userAgent || navigator.vendor || window.opera

  const eIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
  const eAndroid = /Android/.test(ua)
  const eSamsungBrowser = /SamsungBrowser/.test(ua)
  const eChrome = /Chrome/.test(ua) && !/Edg|OPR|SamsungBrowser/.test(ua)
  const eSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua)
  const eFirefox = /Firefox|FxiOS/.test(ua)

  // Rileva se l'app è già installata (in modalità standalone)
  const eGiaInstallata =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  if (eGiaInstallata) return { tipo: 'installata' }

  if (eIOS && eSafari) return { tipo: 'ios-safari' }
  if (eIOS) return { tipo: 'ios-altro-browser' } // iOS forza il motore Safari, ma il menu varia
  if (eSamsungBrowser) return { tipo: 'samsung-browser' }
  if (eAndroid && eChrome) return { tipo: 'android-chrome' }
  if (eAndroid) return { tipo: 'android-altro-browser' }
  if (eFirefox) return { tipo: 'desktop-o-non-supportato' }

  return { tipo: 'desktop-o-non-supportato' }
}
