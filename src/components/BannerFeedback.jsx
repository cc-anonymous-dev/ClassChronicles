const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScnXRS5MAHirzkRLMryTlp-p9d8aGgctXADgtsz66xqaSThXA/viewform'

/**
 * Link di testo blu semplice che invita l'utente a compilare il form anonimo di feedback.
 * Usato in Benvenuto, Accedi, Bannato e Impostazioni.
 */
export default function BannerFeedback() {
  return (
    <div style={{ textAlign: 'center', margin: 'var(--space-md) 0' }}>
      <a
        href={FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--color-primary, #007bff)',
          textDecoration: 'underline',
          fontSize: '0.875rem',
          cursor: 'pointer',
        }}
      >
        Segnala un problema o invia un feedback anonimo
      </a>
    </div>
  )
}
