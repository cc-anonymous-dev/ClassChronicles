import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { chiamaFunzione } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import LayoutApp from '../components/LayoutApp'
import PostCard from '../components/PostCard'
import BannerBroadcast from '../components/BannerBroadcast'

export default function Feed() {
  const { utente } = useAuth()
  const [post, setPost] = useState([])
  const [broadcast, setBroadcast] = useState([])
  const [caricamento, setCaricamento] = useState(true)
  const [errore, setErrore] = useState('')

  const caricaFeed = useCallback(async () => {
    setErrore('')
    try {
      const [rispostaPost, rispostaBroadcast] = await Promise.all([
        chiamaFunzione('ottieni-post', { utente_id: utente.id }),
        chiamaFunzione('ottieni-broadcast', { utente_id: utente.id }).catch(() => ({ broadcast: [] })),
      ])

      const postNormalizzati = rispostaPost.post.map((p) => ({
        ...p,
        numero_mi_piace: Number(p.numero_mi_piace) || 0,
        mi_piace_attivo: Boolean(p.mi_piace_attivo),
      }))
      setPost(postNormalizzati)
      setBroadcast(rispostaBroadcast.broadcast ?? [])
    } catch (err) {
      setErrore(err.message)
    } finally {
      setCaricamento(false)
    }
  }, [utente.id])

  useEffect(() => {
    caricaFeed()
  }, [caricaFeed])

  async function gestisciSegnalazione(postId) {
    return chiamaFunzione('segnala-post', { post_id: postId, utente_id: utente.id })
  }

  async function gestisciRichiestaRimozione(postId, motivo) {
    return chiamaFunzione('richiedi-rimozione', { post_id: postId, utente_id: utente.id, motivo })
  }

  async function gestisciMetiMiPiace(postId) {
    return chiamaFunzione('gestisci-like', { post_id: postId, utente_id: utente.id })
  }

  return (
    <LayoutApp>
      {!caricamento && broadcast.length > 0 && <BannerBroadcast broadcast={broadcast} />}

      {caricamento && (
        <div className="stato-vuoto">
          <span className="spinner" aria-hidden="true" style={{ width: 32, height: 32 }} />
          <p className="text-body-md">Caricamento cronache in corso...</p>
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
          <span style={{ fontSize: 40 }}>📭</span>
          <h3 className="text-headline-md" style={{ margin: 0 }}>Nessuna cronaca ancora</h3>
          <p className="text-body-md">
            Sii il primo a raccontare qualcosa! Le nuove cronache appariranno qui dopo l'approvazione dell'Admin.
          </p>
          <Link to="/crea" className="btn-brutalist btn-primary-container" style={{ width: 'auto', padding: '12px 24px' }}>
            Scrivi la prima cronaca
          </Link>
        </div>
      )}

      {!caricamento && !errore && post.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {post.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onSegnala={gestisciSegnalazione}
              onRichiediRimozione={gestisciRichiestaRimozione}
              onMetiMiPiace={gestisciMetiMiPiace}
            />
          ))}
        </div>
      )}

      <Link to="/crea" className="fab-nuovo-post" aria-label="Nuova cronaca">
        ➕
      </Link>
    </LayoutApp>
  )
}
