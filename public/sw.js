// Service Worker per Class Chronicles - Gestione Notifiche Push
// NOTA: Nessun caching e nessun handler 'fetch' per evitare di servire versioni vecchie dell'app.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
    } catch {
      data = { corpo: event.data.text() }
    }
  }

  const titolo = data.titolo || 'Class Chronicles'
  const options = {
    body: data.corpo || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: {
      url: data.url || '/',
    },
  }

  event.waitUntil(self.registration.showNotification(titolo, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Se esiste già una finestra aperta, portala in primo piano e naviga all'URL se necessario
      for (const client of windowClients) {
        if ('focus' in client) {
          if (client.url === targetUrl || targetUrl === '/') {
            return client.focus()
          }
          if ('navigate' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }
      }
      // Altrimenti apri una nuova finestra
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
