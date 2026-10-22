import { useTranslation } from 'react-i18next'

export default function SelettoreLinguaRapido({ style = {} }) {
  const { i18n } = useTranslation()
  const linguaAttuale = i18n.language?.startsWith('en') ? 'en' : 'it'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '2px solid var(--color-outline-variant, #444)',
        backgroundColor: 'var(--color-surface-container, #1e1e1e)',
        padding: '2px',
        gap: '4px',
        ...style,
      }}
    >
      <button
        type="button"
        onClick={() => i18n.changeLanguage('it')}
        style={{
          background: linguaAttuale === 'it' ? 'var(--color-primary-fixed, #00FFC2)' : 'transparent',
          color: linguaAttuale === 'it' ? 'var(--color-on-primary-fixed, #000)' : 'var(--color-on-surface-variant, #aaa)',
          border: 'none',
          fontWeight: 700,
          fontSize: '12px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          transition: 'all 0.15s ease',
        }}
        aria-label="Lingua Italiana"
      >
        🇮🇹 IT
      </button>
      <span style={{ color: 'var(--color-outline-variant, #666)', fontSize: '11px', userSelect: 'none' }}>|</span>
      <button
        type="button"
        onClick={() => i18n.changeLanguage('en')}
        style={{
          background: linguaAttuale === 'en' ? 'var(--color-primary-fixed, #00FFC2)' : 'transparent',
          color: linguaAttuale === 'en' ? 'var(--color-on-primary-fixed, #000)' : 'var(--color-on-surface-variant, #aaa)',
          border: 'none',
          fontWeight: 700,
          fontSize: '12px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
          transition: 'all 0.15s ease',
        }}
        aria-label="English Language"
      >
        🇬🇧 EN
      </button>
    </div>
  )
}
