import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../lib/AuthContext'

/**
 * Layout condiviso per tutte le schermate "interne" (dopo il login):
 * Feed, Crea Post, Admin, Profilo. Fornisce header fisso e barra
 * di navigazione inferiore, come nei mockup.
 */
export default function LayoutApp({ children }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { utente } = useAuth()
  const puoModerare = utente?.ruolo === 'admin' || utente?.ruolo === 'root'

  return (
    <div className="layout-app">
      <header className="app-header">
        <div className="app-header-brand">
          <span aria-hidden="true">🛡️</span>
          <h1 className="text-headline-md" style={{ fontSize: 18, margin: 0 }}>
            {t('nav.titolo_app')}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Regole e Privacy"
          onClick={() => navigate('/regole')}
          style={{
            background: 'none', border: 'none', color: 'var(--color-primary)',
            cursor: 'pointer', fontSize: 20, padding: 'var(--space-xs)',
          }}
        >
          ⚠️
        </button>
      </header>

      <main className="app-main">{children}</main>

      <nav className="app-bottom-nav">
        <NavLink to="/feed" className={({ isActive }) => `nav-tab ${isActive ? 'attivo' : ''}`}>
          <span className="nav-tab-icona" aria-hidden="true">📖</span>
          <span className="text-label-caps">{t('nav.feed')}</span>
        </NavLink>
        <NavLink to="/crea" className={({ isActive }) => `nav-tab ${isActive ? 'attivo' : ''}`}>
          <span className="nav-tab-icona" aria-hidden="true">➕</span>
          <span className="text-label-caps">{t('nav.crea')}</span>
        </NavLink>
        {puoModerare && (
          <NavLink to="/admin" className={({ isActive }) => `nav-tab ${isActive ? 'attivo' : ''}`}>
            <span className="nav-tab-icona" aria-hidden="true">🖥️</span>
            <span className="text-label-caps">{t('nav.admin')}</span>
          </NavLink>
        )}
        <NavLink to="/profilo" className={({ isActive }) => `nav-tab ${isActive ? 'attivo' : ''}`}>
          <span className="nav-tab-icona" aria-hidden="true">👤</span>
          <span className="text-label-caps">{t('nav.profilo')}</span>
        </NavLink>
      </nav>
    </div>
  )
}
