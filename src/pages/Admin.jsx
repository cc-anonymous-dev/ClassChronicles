import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import { tempoRelativo } from '../lib/formattazione'
import LayoutApp from '../components/LayoutApp'

function AccessoNegato() {
  const { t } = useTranslation()
  return (
    <div className="stato-vuoto">
      <span style={{ fontSize: 40 }}>🔒</span>
      <h3 className="text-headline-md" style={{ margin: 0 }}>{t('admin.accesso_negato_titolo')}</h3>
      <p className="text-body-md">
        {t('admin.accesso_negato_testo')}
      </p>
    </div>
  )
}

function CardModerazione({ post, onModera, onBanna, motiviPredefiniti, eRoot }) {
  const { t } = useTranslation()
  const [elaborando, setElaborando] = useState(false)
  const [mostraFormBan, setMostraFormBan] = useState(false)

  async function gestisci(azione) {
    setElaborando(true)
    await onModera(post.id, azione)
    setElaborando(false)
  }

  const eSegnalato = post.stato === 'segnalato'

  return (
    <div className={`admin-card-moderazione ${eSegnalato ? 'segnalato' : ''}`}>
      <div className="admin-card-header" style={{ justifyContent: 'flex-end' }}>
        <span className="admin-card-id">
          {eSegnalato ? t('admin.segnalato_badge', { conteggio: post.numero_segnalazioni }) : `ID: #${post.id.slice(0, 6).toUpperCase()}`}
        </span>
      </div>

      <h4 className="post-card-titolo" style={{ fontSize: 18 }}>{post.titolo}</h4>
      <p className="post-card-contenuto">{post.contenuto}</p>
      {post.autore_nickname && (
        <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: 4 }}>
          {t('admin.autore', { nickname: post.autore_nickname })}
        </span>
      )}
      <span className="post-card-tempo">{tempoRelativo(post.creato_il)}</span>

      <div className="admin-card-azioni">
        <button className="btn-approva" onClick={() => gestisci('approva')} disabled={elaborando}>
          {t('admin.btn_approva')}
        </button>
        <button className="btn-rifiuta" onClick={() => gestisci('rifiuta')} disabled={elaborando}>
          {t('admin.btn_rifiuta')}
        </button>
      </div>

      {post.autore_id && (
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <button
            className="btn-azione-piccolo pericolo"
            style={{ width: '100%' }}
            onClick={() => setMostraFormBan(!mostraFormBan)}
            disabled={elaborando}
          >
            {mostraFormBan ? `🚫 ${t('admin.btn_annulla')}` : t('admin.btn_banna_autore')}
          </button>
          {mostraFormBan && (
            <FormBanUtente
              utenteTarget={{ id: post.autore_id, nickname: post.autore_nickname || '???' }}
              motiviPredefiniti={motiviPredefiniti}
              onAnnulla={() => setMostraFormBan(false)}
              onBanna={async (id, giorni, motivo) => {
                await onBanna(id, giorni, motivo)
                setMostraFormBan(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

function CodaApprovazione({ utente }) {
  const { t } = useTranslation()
  const [post, setPost] = useState([])
  const [numeroParoleVietate, setNumeroParoleVietate] = useState(0)
  const [filtroAttivo, setFiltroAttivo] = useState(true)
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')
  const [motiviPredefiniti, setMotiviPredefiniti] = useState([])

  const eRoot = utente.ruolo === 'root'

  const caricaCoda = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('admin-coda-approvazione', { utente_id: utente.id })
      setPost(risposta.post)
      setNumeroParoleVietate(risposta.numero_parole_vietate)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaCoda()
  }, [caricaCoda])

  // Carica i motivi ban predefiniti per il form inline
  useEffect(() => {
    chiamaFunzione('root-ottieni-utenti', { richiedente_id: utente.id })
      .then((r) => setMotiviPredefiniti(r.motivi_ban_predefiniti ?? []))
      .catch(() => {})
  }, [utente.id])

  async function gestisciModerazione(postId, azione) {
    try {
      await chiamaFunzione('admin-modera-post', { post_id: postId, utente_id: utente.id, azione })
      setPost((prec) => prec.filter((p) => p.id !== postId))
    } catch (err) {
      setErrore(err.message)
    }
  }

  async function gestisciBanAutore(autoreId, giorni, motivo) {
    try {
      await chiamaFunzione('root-gestisci-utente', {
        richiedente_id: utente.id,
        utente_target_id: autoreId,
        azione: 'banna',
        giorni_ban: giorni,
        motivo_ban: motivo,
      })
    } catch (err) {
      setErrore(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div className="admin-sezione-controlli">
        <div className="admin-riga-controllo">
          <div className="admin-riga-controllo-testo">
            <span className="text-body-md" style={{ fontWeight: 600 }}>{t('admin.filtro_parole_titolo')}</span>
            <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
              {t('admin.intercettando_termini', { numero: numeroParoleVietate })}
            </span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={filtroAttivo} onChange={(e) => setFiltroAttivo(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-headline-md" style={{ margin: 0, fontSize: 18 }}>{t('admin.in_attesa_approvazione')}</h3>
        <span className="admin-badge-coda">{t('admin.elementi_in_coda', { conteggio: post.length })}</span>
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

      {!caricamento && !errore && post.length === 0 && (
        <div className="stato-vuoto">
          <span style={{ fontSize: 32 }}>✅</span>
          <p className="text-body-md">{t('admin.nessuna_cronaca_coda')}</p>
        </div>
      )}

      {!caricamento && post.map((p) => (
        <CardModerazione
          key={p.id}
          post={p}
          onModera={gestisciModerazione}
          onBanna={gestisciBanAutore}
          motiviPredefiniti={motiviPredefiniti}
          eRoot={eRoot}
        />
      ))}
    </div>
  )
}

function FormBanUtente({ utenteTarget, motiviPredefiniti, onBanna, onAnnulla }) {
  const { t } = useTranslation()
  const [giorni, setGiorni] = useState(3)
  const [motivo, setMotivo] = useState('')
  const [inviando, setInviando] = useState(false)

  async function gestisciConferma() {
    if (!motivo.trim() || giorni < 1) return
    setInviando(true)
    await onBanna(utenteTarget.id, giorni, motivo.trim())
    setInviando(false)
  }

  return (
    <div className="pannello-ban-form">
      <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>
        {t('admin.banna_titolo', { nickname: utenteTarget.nickname })}
      </span>

      <table className="tabella-motivi-ban">
        <thead>
          <tr>
            <th>{t('admin.motivo_suggerito')}</th>
            <th>{t('admin.giorni')}</th>
          </tr>
        </thead>
        <tbody>
          {motiviPredefiniti.map((m) => (
            <tr
              key={m.id}
              className="selezionabile"
              onClick={() => { setMotivo(m.motivo); setGiorni(m.giorni_suggeriti) }}
            >
              <td>{m.motivo}</td>
              <td>{m.giorni_suggeriti}g</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="campo-input-wrap">
        <input
          id="motivo-ban-custom"
          className="input-brutalist"
          type="text"
          placeholder=" "
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          disabled={inviando}
        />
        <label className="campo-label" htmlFor="motivo-ban-custom">{t('admin.motivo_del_ban')}</label>
      </div>

      <div className="campo-input-wrap">
        <input
          id="giorni-ban"
          className="input-brutalist"
          type="number"
          min={1}
          max={365}
          value={giorni}
          onChange={(e) => setGiorni(Number(e.target.value))}
          disabled={inviando}
        />
        <label className="campo-label" htmlFor="giorni-ban">{t('admin.giorni_sospensione')}</label>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button className="btn-rifiuta" style={{ flex: 1 }} onClick={gestisciConferma} disabled={inviando || !motivo.trim()}>
          {inviando ? <span className="spinner" aria-hidden="true" /> : t('admin.btn_banna_per_giorni', { giorni })}
        </button>
        <button className="btn-azione-piccolo" onClick={onAnnulla} disabled={inviando}>{t('admin.btn_annulla')}</button>
      </div>
    </div>
  )
}

function RigaUtente({ u, onBanna, onRimuoviBan, onPromuovi, onRimuoviAdmin, motiviPredefiniti }) {
  const { t, i18n } = useTranslation()
  const [mostraFormBan, setMostraFormBan] = useState(false)

  return (
    <div className="riga-utente">
      <div className="riga-utente-header">
        <span className="text-body-md" style={{ fontWeight: 600 }}>@{u.nickname}</span>
        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
          <span className={`badge-ruolo ${u.ruolo}`}>{u.ruolo}</span>
          {u.bannato_attualmente && <span className="badge-bannato">{t('admin.badge_bannato')}</span>}
        </div>
      </div>

      {u.bannato_attualmente && (
        <span style={{ fontSize: 13, color: 'var(--color-error)' }}>
          {t('admin.bannato_fino_al', {
            motivo: u.motivo_ban,
            data: new Date(u.bannato_fino_a).toLocaleDateString(i18n.language?.startsWith('en') ? 'en-US' : 'it-IT')
          })}
        </span>
      )}

      {u.ruolo !== 'root' && (
        <div className="riga-utente-azioni">
          {u.bannato_attualmente ? (
            <button className="btn-azione-piccolo" onClick={() => onRimuoviBan(u.id)}>
              {t('admin.rimuovi_ban')}
            </button>
          ) : (
            <button className="btn-azione-piccolo pericolo" onClick={() => setMostraFormBan(!mostraFormBan)}>
              {t('admin.btn_banna')}
            </button>
          )}

          {u.ruolo === 'admin' ? (
            <button className="btn-azione-piccolo" onClick={() => onRimuoviAdmin(u.id)}>
              {t('admin.rimuovi_admin')}
            </button>
          ) : (
            <button className="btn-azione-piccolo" onClick={() => onPromuovi(u.id)}>
              {t('admin.promuovi_admin')}
            </button>
          )}
        </div>
      )}

      {mostraFormBan && (
        <FormBanUtente
          utenteTarget={u}
          motiviPredefiniti={motiviPredefiniti}
          onAnnulla={() => setMostraFormBan(false)}
          onBanna={async (id, giorni, motivo) => {
            await onBanna(id, giorni, motivo)
            setMostraFormBan(false)
          }}
        />
      )}
    </div>
  )
}

function ZonaPericolo({ utente }) {
  const { t } = useTranslation()
  const [scaricando, setScaricando] = useState(false)
  const [mostraConferma, setMostraConferma] = useState(false)
  const [testoConferma, setTestoConferma] = useState('')
  const [distruggendo, setDistruggendo] = useState(false)
  const [errore, setErrore] = useState('')
  const [completato, setCompletato] = useState(false)

  async function gestisciBackup() {
    setErrore('')
    setScaricando(true)
    try {
      const risposta = await chiamaFunzione('root-backup-testo', { richiedente_id: utente.id })
      const blob = new Blob([risposta.testo_backup], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const dataOggi = new Date().toISOString().slice(0, 10)
      link.href = url
      link.download = `backup-cronache-${dataOggi}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setScaricando(false)
    }
  }

  async function gestisciAutodistruzione() {
    setErrore('')
    setDistruggendo(true)
    try {
      await chiamaFunzione('root-autodistruzione', {
        richiedente_id: utente.id,
        conferma_testuale: testoConferma,
      })
      setCompletato(true)
    } catch (err) {
      setErrore(err.message)
      setDistruggendo(false)
    }
  }

  if (completato) {
    return (
      <div className="zona-pericolo">
        <span style={{ fontSize: 32 }}>💥</span>
        <p className="text-body-md">
          {t('admin.distruzione_completata')}
        </p>
      </div>
    )
  }

  return (
    <div className="zona-pericolo">
      <div className="zona-pericolo-titolo">
        <span aria-hidden="true">⚠️</span>
        <span>{t('admin.zona_pericolo_titolo')}</span>
      </div>
      <p className="text-body-md" style={{ margin: 0, color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
        {t('admin.zona_pericolo_desc')}
      </p>

      {errore && (
        <div className="messaggio-errore" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>{errore}</span>
        </div>
      )}

      <button className="btn-zona-pericolo" onClick={gestisciBackup} disabled={scaricando}>
        {scaricando ? <span className="spinner" aria-hidden="true" /> : t('admin.scarica_backup')}
      </button>

      {!mostraConferma ? (
        <button className="btn-autodistruzione" onClick={() => setMostraConferma(true)}>
          {t('admin.autodistruzione')}
        </button>
      ) : (
        <div className="conferma-autodistruzione-box">
          <p className="text-body-md" style={{ margin: 0 }}>
            {t('admin.autodistruzione_avviso')}
          </p>
          <div className="campo-input-wrap">
            <input
              id="conferma-distruzione"
              className="input-brutalist"
              type="text"
              placeholder=" "
              value={testoConferma}
              onChange={(e) => setTestoConferma(e.target.value)}
              disabled={distruggendo}
            />
            <label className="campo-label" htmlFor="conferma-distruzione">
              {t('admin.scrivi_conferma')}
            </label>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button
              className="btn-autodistruzione"
              style={{ flex: 1 }}
              onClick={gestisciAutodistruzione}
              disabled={distruggendo || testoConferma !== 'CONFERMA'}
            >
              {distruggendo ? <span className="spinner" aria-hidden="true" /> : t('admin.elimina_tutto_definitivamente')}
            </button>
            <button
              className="btn-azione-piccolo"
              onClick={() => { setMostraConferma(false); setTestoConferma('') }}
              disabled={distruggendo}
            >
              {t('admin.btn_annulla')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function GestioneUtenti({ utente }) {
  const { t } = useTranslation()
  const { accedi } = useAuth()
  const [utenti, setUtenti] = useState([])
  const [motiviPredefiniti, setMotiviPredefiniti] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaUtenti = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('root-ottieni-utenti', { richiedente_id: utente.id })
      setUtenti(risposta.utenti)
      setMotiviPredefiniti(risposta.motivi_ban_predefiniti)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaUtenti()
  }, [caricaUtenti])

  async function eseguiAzione(utente_target_id, azione, extra = {}) {
    try {
      await chiamaFunzione('root-gestisci-utente', {
        richiedente_id: utente.id,
        utente_target_id,
        azione,
        ...extra,
      })
      if (utente_target_id === utente.id) {
        if (azione === 'promuovi_admin') accedi({ ...utente, ruolo: 'admin' })
        if (azione === 'rimuovi_admin') accedi({ ...utente, ruolo: 'studente' })
      }
      await caricaUtenti()
    } catch (err) {
      setErrore(err.message)
    }
  }

  if (caricamento) {
    return (
      <div className="stato-vuoto">
        <span className="spinner" aria-hidden="true" style={{ width: 28, height: 28 }} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <ZonaPericolo utente={utente} />

      {errore && (
        <div className="messaggio-errore" role="alert">
          <span aria-hidden="true">⚠️</span>
          <span>{errore}</span>
        </div>
      )}

      <h3 className="text-headline-md" style={{ margin: 0, fontSize: 18 }}>{t('admin.utenti_della_classe')}</h3>

      {utenti.map((u) => (
        <RigaUtente
          key={u.id}
          u={u}
          motiviPredefiniti={motiviPredefiniti}
          onBanna={(id, giorni, motivo) => eseguiAzione(id, 'banna', { giorni_ban: giorni, motivo_ban: motivo })}
          onRimuoviBan={(id) => eseguiAzione(id, 'rimuovi_ban')}
          onPromuovi={(id) => eseguiAzione(id, 'promuovi_admin')}
          onRimuoviAdmin={(id) => eseguiAzione(id, 'rimuovi_admin')}
        />
      ))}
    </div>
  )
}

function CardRichiestaRimozione({ richiesta, onDecidi, onBanna, motiviPredefiniti, eRoot }) {
  const { t } = useTranslation()
  const [elaborando, setElaborando] = useState(false)
  const [mostraFormBan, setMostraFormBan] = useState(false)

  async function gestisci(decisione) {
    setElaborando(true)
    await onDecidi(richiesta.id, decisione)
    setElaborando(false)
  }

  const autoreId = richiesta.post?.autore_id
  const autoreNickname = richiesta.post?.autore_nickname

  return (
    <div className="card-richiesta-rimozione">
      <span className="text-label-caps" style={{ color: 'var(--color-tertiary-container)' }}>
        {t('admin.richiesta_rimozione_titolo')}
      </span>
      <h4 className="post-card-titolo" style={{ fontSize: 18 }}>{richiesta.post?.titolo ?? t('admin.cronaca_non_disponibile')}</h4>
      {richiesta.post?.contenuto && (
        <p className="post-card-contenuto">{richiesta.post.contenuto}</p>
      )}
      {richiesta.motivo && (
        <p className="text-body-md" style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', margin: '4px 0' }}>
          <strong>{t('admin.motivo_label')}</strong> {richiesta.motivo}
        </p>
      )}
      {autoreNickname && (
        <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: 4 }}>
          {t('admin.autore', { nickname: autoreNickname })}
        </span>
      )}
      <span className="post-card-tempo">{tempoRelativo(richiesta.creata_il)}</span>

      <div className="admin-card-azioni">
        <button className="btn-accoglie" onClick={() => gestisci('accoglie')} disabled={elaborando}>
          {t('admin.accogli_rimuovi')}
        </button>
        <button className="btn-rifiuta" onClick={() => gestisci('rifiuta')} disabled={elaborando}>
          {t('admin.rifiuta_richiesta')}
        </button>
      </div>

      {autoreId && (
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <button
            type="button"
            className="btn-azione-piccolo pericolo"
            style={{ width: '100%' }}
            onClick={() => setMostraFormBan(!mostraFormBan)}
            disabled={elaborando}
          >
            {mostraFormBan ? `🚫 ${t('admin.btn_annulla')}` : t('admin.btn_banna_autore')}
          </button>
          {mostraFormBan && (
            <FormBanUtente
              utenteTarget={{ id: autoreId, nickname: autoreNickname || '???' }}
              motiviPredefiniti={motiviPredefiniti}
              onAnnulla={() => setMostraFormBan(false)}
              onBanna={async (id, giorni, motivo) => {
                await onBanna(id, giorni, motivo)
                setMostraFormBan(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

function RichiesteRimozione({ utente }) {
  const { t } = useTranslation()
  const [richieste, setRichieste] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')
  const [motiviPredefiniti, setMotiviPredefiniti] = useState([])

  const eRoot = utente.ruolo === 'root'

  const caricaRichieste = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('admin-gestisci-rimozioni', { azione: 'lista', utente_id: utente.id })
      setRichieste(risposta.richieste)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaRichieste()
  }, [caricaRichieste])

  useEffect(() => {
    chiamaFunzione('root-ottieni-utenti', { richiedente_id: utente.id })
      .then((r) => setMotiviPredefiniti(r.motivi_ban_predefiniti ?? []))
      .catch(() => {})
  }, [utente.id])

  async function gestisciBanAutore(autoreId, giorni, motivo) {
    try {
      await chiamaFunzione('root-gestisci-utente', {
        richiedente_id: utente.id,
        utente_target_id: autoreId,
        azione: 'banna',
        giorni_ban: giorni,
        motivo_ban: motivo,
      })
    } catch (err) {
      setErrore(err.message)
    }
  }

  async function gestisciDecisione(richiestaId, decisione) {
    try {
      await chiamaFunzione('admin-gestisci-rimozioni', {
        azione: 'decidi',
        utente_id: utente.id,
        richiesta_id: richiestaId,
        decisione,
      })
      setRichieste((prec) => prec.filter((r) => r.id !== richiestaId))
    } catch (err) {
      setErrore(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-headline-md" style={{ margin: 0, fontSize: 18 }}>{t('admin.tab_rimozioni')}</h3>
        <span className="admin-badge-coda">{t('admin.in_attesa_conteggio', { conteggio: richieste.length })}</span>
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

      {!caricamento && !errore && richieste.length === 0 && (
        <div className="stato-vuoto">
          <span style={{ fontSize: 32 }}>✅</span>
          <p className="text-body-md">{t('admin.nessuna_richiesta_rimozione')}</p>
        </div>
      )}

      {!caricamento && richieste.map((r) => (
        <CardRichiestaRimozione
          key={r.id}
          richiesta={r}
          onDecidi={gestisciDecisione}
          onBanna={gestisciBanAutore}
          motiviPredefiniti={motiviPredefiniti}
          eRoot={eRoot}
        />
      ))}
    </div>
  )
}

function CardSegnalazioneUtente({ segnalazione, onArchivia, onBanna, motiviPredefiniti, eRoot }) {
  const { t } = useTranslation()
  const [elaborando, setElaborando] = useState(false)
  const [mostraFormBan, setMostraFormBan] = useState(false)

  async function gestisci() {
    setElaborando(true)
    await onArchivia(segnalazione.id)
    setElaborando(false)
  }

  const utenteTarget = segnalazione.utenti

  return (
    <div className="card-richiesta-rimozione">
      <span className="text-label-caps" style={{ color: 'var(--color-error)' }}>
        {t('admin.segnalazione_utente_titolo')}
      </span>
      <h4 className="post-card-titolo" style={{ fontSize: 18 }}>
        {utenteTarget?.nickname ? `@${utenteTarget.nickname}` : t('admin.utente_non_disponibile')}
        {utenteTarget?.ruolo && utenteTarget.ruolo !== 'studente' && (
          <span className="badge-moderatore" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
            {utenteTarget.ruolo}
          </span>
        )}
      </h4>
      {segnalazione.motivo && (
        <p className="post-card-contenuto">{segnalazione.motivo}</p>
      )}
      <span className="post-card-tempo">{tempoRelativo(segnalazione.creata_il)}</span>

      <div className="admin-card-azioni">
        <button className="btn-approva" onClick={gestisci} disabled={elaborando}>
          {t('admin.segna_come_esaminata')}
        </button>
      </div>

      {utenteTarget?.id && (
        <div style={{ marginTop: 'var(--space-sm)' }}>
          <button
            type="button"
            className="btn-azione-piccolo pericolo"
            style={{ width: '100%' }}
            onClick={() => setMostraFormBan(!mostraFormBan)}
            disabled={elaborando}
          >
            {mostraFormBan ? `🚫 ${t('admin.btn_annulla')}` : t('admin.banna_utente')}
          </button>
          {mostraFormBan && (
            <FormBanUtente
              utenteTarget={{ id: utenteTarget.id, nickname: utenteTarget.nickname || '???' }}
              motiviPredefiniti={motiviPredefiniti}
              onAnnulla={() => setMostraFormBan(false)}
              onBanna={async (id, giorni, motivo) => {
                await onBanna(id, giorni, motivo)
                setMostraFormBan(false)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}

function SegnalazioniUtenti({ utente }) {
  const { t } = useTranslation()
  const [segnalazioni, setSegnalazioni] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')
  const [motiviPredefiniti, setMotiviPredefiniti] = useState([])

  const eRoot = utente.ruolo === 'root'

  const caricaSegnalazioni = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('admin-segnalazioni-utenti', { azione: 'lista', utente_id: utente.id })
      setSegnalazioni(risposta.segnalazioni)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaSegnalazioni()
  }, [caricaSegnalazioni])

  useEffect(() => {
    chiamaFunzione('root-ottieni-utenti', { richiedente_id: utente.id })
      .then((r) => setMotiviPredefiniti(r.motivi_ban_predefiniti ?? []))
      .catch(() => {})
  }, [utente.id])

  async function gestisciBanUtente(utenteId, giorni, motivo) {
    try {
      await chiamaFunzione('root-gestisci-utente', {
        richiedente_id: utente.id,
        utente_target_id: utenteId,
        azione: 'banna',
        giorni_ban: giorni,
        motivo_ban: motivo,
      })
    } catch (err) {
      setErrore(err.message)
    }
  }

  async function gestisciArchiviazione(segnalazioneId) {
    try {
      await chiamaFunzione('admin-segnalazioni-utenti', {
        azione: 'archivia',
        utente_id: utente.id,
        segnalazione_id: segnalazioneId,
      })
      setSegnalazioni((prec) => prec.filter((s) => s.id !== segnalazioneId))
    } catch (err) {
      setErrore(err.message)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="text-headline-md" style={{ margin: 0, fontSize: 18 }}>{t('admin.tab_segnalazioni')}</h3>
        <span className="admin-badge-coda">{t('admin.in_attesa_conteggio', { conteggio: segnalazioni.length })}</span>
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

      {!caricamento && !errore && segnalazioni.length === 0 && (
        <div className="stato-vuoto">
          <span style={{ fontSize: 32 }}>✅</span>
          <p className="text-body-md">{t('admin.nessuna_segnalazione_attesa')}</p>
        </div>
      )}

      {!caricamento && segnalazioni.map((s) => (
        <CardSegnalazioneUtente
          key={s.id}
          segnalazione={s}
          onArchivia={gestisciArchiviazione}
          onBanna={gestisciBanUtente}
          motiviPredefiniti={motiviPredefiniti}
          eRoot={eRoot}
        />
      ))}
    </div>
  )
}

function DashboardAdmin({ utente }) {
  const { t } = useTranslation()
  const [tab, setTab] = useState('coda')
  const eRoot = utente.ruolo === 'root'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2 className="text-headline-md" style={{ margin: 0 }}>{t('admin.titolo')}</h2>

      <div className="root-tab-selector">
        <button
          className={`root-tab-btn ${tab === 'coda' ? 'attivo' : ''}`}
          onClick={() => setTab('coda')}
        >
          {t('admin.tab_coda')}
        </button>
        <button
          className={`root-tab-btn ${tab === 'rimozioni' ? 'attivo' : ''}`}
          onClick={() => setTab('rimozioni')}
        >
          {t('admin.tab_rimozioni')}
        </button>
        <button
          className={`root-tab-btn ${tab === 'segnalazioni-utenti' ? 'attivo' : ''}`}
          onClick={() => setTab('segnalazioni-utenti')}
        >
          {t('admin.tab_segnalazioni')}
        </button>
        {eRoot && (
          <button
            className={`root-tab-btn ${tab === 'utenti' ? 'attivo' : ''}`}
            onClick={() => setTab('utenti')}
          >
            {t('admin.tab_utenti')}
          </button>
        )}
      </div>

      {tab === 'coda' && <CodaApprovazione utente={utente} />}
      {tab === 'rimozioni' && <RichiesteRimozione utente={utente} />}
      {tab === 'segnalazioni-utenti' && <SegnalazioniUtenti utente={utente} />}
      {tab === 'utenti' && eRoot && <GestioneUtenti utente={utente} />}
    </div>
  )
}

export default function Admin() {
  const { utente } = useAuth()
  const puoModerare = utente?.ruolo === 'admin' || utente?.ruolo === 'root'

  return (
    <LayoutApp>
      {puoModerare ? <DashboardAdmin utente={utente} /> : <AccessoNegato />}
    </LayoutApp>
  )
}
