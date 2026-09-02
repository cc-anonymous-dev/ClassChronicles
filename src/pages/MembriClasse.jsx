import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'
import ModalSegnalaUtente from '../components/ModalSegnalaUtente'

function RigaMembro({ membro, onSegnala, ruoloCorrente }) {
  const [mostraModal, setMostraModal] = useState(false)
  const [segnalato, setSegnalato] = useState(false)

  async function gestisciConferma(motivo) {
    await onSegnala(membro.id, motivo)
    setSegnalato(true)
    setMostraModal(false)
  }

  const puoVedereBadge = ruoloCorrente === 'admin' || ruoloCorrente === 'root'

  return (
    <div className="riga-membro">
      <div className="riga-membro-nome">
        <span aria-hidden="true">👤</span>
        <span className="text-body-md">{membro.nickname}</span>
        {puoVedereBadge && membro.e_moderatore && <span className="badge-moderatore">Staff</span>}
      </div>

      {segnalato ? (
        <span className="text-label-caps" style={{ color: 'var(--color-on-surface-variant)', fontSize: 11 }}>
          ✅ Segnalato
        </span>
      ) : (
        <button className="btn-segnala-membro" onClick={() => setMostraModal(true)}>
          🚩 Segnala
        </button>
      )}

      {mostraModal && (
        <ModalSegnalaUtente
          nickname={membro.nickname}
          onConferma={gestisciConferma}
          onChiudi={() => setMostraModal(false)}
        />
      )}
    </div>
  )
}

export default function MembriClasse() {
  const navigate = useNavigate()
  const { utente } = useAuth()
  const [membri, setMembri] = useState([])
  const [ricerca, setRicerca] = useState('')
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaMembri = useCallback(async () => {
    setErrore('')
    try {
      const risposta = await chiamaFunzione('ottieni-membri-classe', { utente_id: utente.id })
      setMembri(risposta.membri)
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaMembri()
  }, [caricaMembri])

  async function gestisciSegnalazione(utenteSegnalatoId, motivo) {
    return chiamaFunzione('segnala-utente', {
      utente_segnalante_id: utente.id,
      utente_segnalato_id: utenteSegnalatoId,
      motivo,
    })
  }

  const membriFiltrati = membri.filter((m) =>
    m.nickname.toLowerCase().includes(ricerca.toLowerCase())
  )

  return (
    <LayoutApp>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <button
            type="button"
            onClick={() => navigate('/profilo')}
            aria-label="Torna al profilo"
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 20, cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 className="text-headline-md" style={{ margin: 0 }}>Membri della Classe</h2>
        </div>

        <input
          type="text"
          className="campo-ricerca-membri"
          placeholder="Cerca un nickname..."
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
        />

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

        {!caricamento && !errore && membriFiltrati.length === 0 && (
          <div className="stato-vuoto">
            <span style={{ fontSize: 32 }}>🔍</span>
            <p className="text-body-md">Nessun membro trovato.</p>
          </div>
        )}

        {!caricamento && membriFiltrati.map((m) => (
          <RigaMembro key={m.id} membro={m} onSegnala={gestisciSegnalazione} ruoloCorrente={utente?.ruolo} />
        ))}
      </div>
    </LayoutApp>
  )
}
