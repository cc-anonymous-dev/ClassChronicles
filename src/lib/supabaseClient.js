import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'ATTENZIONE: variabili VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY mancanti. Controlla il file .env'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// URL base per chiamare le nostre Edge Functions
export const FUNCTIONS_URL = `${supabaseUrl}/functions/v1`

/**
 * Helper per chiamare una Edge Function passando il body JSON
 * e gestendo in modo uniforme gli errori restituiti in italiano.
 */
export async function chiamaFunzione(nomeFunzione, body) {
  const risposta = await fetch(`${FUNCTIONS_URL}/${nomeFunzione}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(body),
  })

  const dati = await risposta.json()

  if (!risposta.ok) {
    throw new Error(dati.errore || 'Si è verificato un errore imprevisto.')
  }

  return dati
}
