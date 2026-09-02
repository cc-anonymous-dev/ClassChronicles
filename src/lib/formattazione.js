/**
 * Converte una data ISO in una stringa relativa in italiano,
 * es. "10m fa", "2h fa", "3g fa".
 */
export function tempoRelativo(dataIso) {
  const data = new Date(dataIso)
  const oraAttuale = new Date()
  const secondiTrascorsi = Math.floor((oraAttuale - data) / 1000)

  if (secondiTrascorsi < 60) return 'ora'
  const minuti = Math.floor(secondiTrascorsi / 60)
  if (minuti < 60) return `${minuti}m fa`
  const ore = Math.floor(minuti / 60)
  if (ore < 24) return `${ore}h fa`
  const giorni = Math.floor(ore / 24)
  if (giorni < 30) return `${giorni}g fa`
  const mesi = Math.floor(giorni / 30)
  return `${mesi} mesi fa`
}

export const ETICHETTE_CATEGORIE = {
  confessione: 'Confessione',
  gossip: 'Gossip',
  sfogo: 'Sfogo',
  cotta: 'Cotta',
  personalizzato: 'Personalizzato',
}
