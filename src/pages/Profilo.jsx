import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'
import GuidaAggiungiHome from '../components/GuidaAggiungiHome'

function dataFormattata(dataIso, locale = 'it-IT') {
  if (!dataIso) return ''
  return new Date(dataIso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Profilo() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { utente, esci } = useAuth()
  const [statistiche, setStatistiche] = useState(null)
  const [datiClasse, setDatiClasse] = useState(null)
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const localeData = i18n.language?.startsWith('en') ? 'en-US' : 'it-IT'

  const caricaStatistiche = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('profilo-statistiche', { utente_id: utente.id })
      setStatistiche(risposta.statistiche || risposta)
      if (risposta.classe || risposta.statistiche?.classe || risposta.nome_classe || risposta.statistiche?.nome_classe || risposta.statistiche?.classe_nome) {
        setDatiClasse({
          nome: risposta.classe?.nome_classe || risposta.statistiche?.nome_classe || risposta.nome_classe || risposta.statistiche?.classe_nome,
        })
      }
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaStatistiche()
  }, [caricaStatistiche])

  const nomeClasse = datiClasse?.nome || statistiche?.nome_classe || statistiche?.classe_nome || utente?.nome_classe

  function gestisciUscita() {
    esci()
    navigate('/accedi')
  }

  const etichettaRuolo = utente.ruolo === 'root'
    ? t('profilo.ruolo_root')
    : utente.ruolo === 'admin'
    ? t('profilo.ruolo_admin')
    : t('profilo.ruolo_studente')

  return (
    <LayoutApp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div className="profilo-header">
          <div className="profilo-avatar" aria-hidden="true">👤</div>
          <div>
            <h2 className="text-headline-md" style={{ margin: 0 }}>{utente.nickname}</h2>
            <span className="text-label-caps" style={{ color: 'var(--color-primary-fixed-dim)' }}>
              {etichettaRuolo}
            </span>
          </div>
        </div>

        {caricamento && (
          <div className="stato-vuoto">
            <span className="spinner" aria-hidden="true" style={{ width: 28, height: 28 }} />
          </div>
        )}

        {!caricamento && errore && (
          <div className="messaggio-errore" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errore}</span>
          </div>
        )}

        {!caricamento && statistiche && (
          <>
            <div className="profilo-stats-griglia">
              <div className="profilo-stat-card">
                <span className="profilo-stat-numero">{statistiche.numero_cronache_pubblicate ?? 0}</span>
                <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {t('profilo.cronache')}
                </span>
              </div>
              <div className="profilo-stat-card">
                <span className="profilo-stat-numero">{statistiche.totale_mi_piace ?? 0}</span>
                <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {t('profilo.mi_piace_ricevuti')}
                </span>
              </div>
            </div>

            {/* Visualizzazione Nome Classe */}
            {nomeClasse && (
              <div className="neo-card">
                <div className="neo-card-header">
                  <span className="text-label-caps" style={{ color: 'var(--color-secondary)' }}>
                    {t('profilo.scheda_classe')}{' '}
                    {utente.ruolo === 'root'
                      ? t('profilo.fondata_da_te')
                      : utente.ruolo === 'admin'
                      ? t('profilo.amministrata_da_te')
                      : ''}
                  </span>
                  <span aria-hidden="true">📍</span>
                </div>
                <div>
                  <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', display: 'block', fontSize: 12 }}>
                    {t('profilo.nome_classe')}
                  </span>
                  <span className="text-headline-md" style={{ color: 'var(--color-primary-fixed-dim)' }}>
                    {nomeClasse}
                  </span>
                </div>
              </div>
            )}

            <div className="neo-card">
              <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)' }}>
                {t('profilo.membro_dal')}
              </span>
              <span className="text-body-md">{dataFormattata(statistiche.creato_il, localeData)}</span>
            </div>
          </>
        )}

        <button
          type="button"
          className="btn-brutalist btn-secondary-outline"
          onClick={() => navigate('/membri')}
        >
          {t('profilo.btn_membri')}
        </button>

        <GuidaAggiungiHome pulsanteInline />

        <button
          type="button"
          className="btn-brutalist btn-secondary-outline"
          onClick={() => navigate('/impostazioni')}
        >
          {t('profilo.btn_impostazioni')}
        </button>

        <button className="btn-brutalist btn-secondary-outline" onClick={gestisciUscita}>
          {t('profilo.btn_esci')}
        </button>
      </div>
    </LayoutApp>
  )
}
