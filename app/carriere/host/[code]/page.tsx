'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase as supabaseCarriere } from '@/lib/carriere'
import type { CarriereSession, CarrierePlayer, PlayerCard } from '@/lib/carriere'
import CareerTable from '@/app/carriere/components/CareerTable'
import PlayerSearch from '@/app/carriere/components/PlayerSearch'

const AVATARS = ['🧑', '👩', '🧔', '👱', '🧕']

export default function CarriereHostPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  const [session, setSession] = useState<CarriereSession | null>(null)
  const [players, setPlayers] = useState<CarrierePlayer[]>([])
  const [card, setCard] = useState<PlayerCard | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [copied, setCopied] = useState(false)
  const [foundToast, setFoundToast] = useState<string | null>(null)

  const sessionRef = useRef<CarriereSession | null>(null)
  const prevFoundBy = useRef<string | null>(null)

  useEffect(() => {
    const pid = sessionStorage.getItem(`carriere_player_${code}`) ?? ''
    const hkey = sessionStorage.getItem(`carriere_host_${code}`) ?? ''
    setPlayerId(pid)

    async function load() {
      const [sRes, pRes] = await Promise.all([
        fetch(`/api/carriere/sessions/${code}`),
        fetch(`/api/carriere/sessions/${code}/players`),
      ])
      if (!sRes.ok) { router.push('/carriere'); return }
      const s: CarriereSession = await sRes.json()
      sessionRef.current = s
      setSession(s)
      setIsHost(!!hkey && s.host_key === hkey)
      if (pRes.ok) setPlayers(await pRes.json())
    }
    load()

    const channel = supabaseCarriere
      .channel(`carriere-host-${code}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'carriere_sessions', filter: `code=eq.${code}` },
        (payload) => {
          const s = payload.new as CarriereSession
          sessionRef.current = s
          setSession(s)
          if (s.last_found_by_name && s.last_found_by_name !== prevFoundBy.current) {
            prevFoundBy.current = s.last_found_by_name
            setFoundToast(`${s.last_found_by_name} a trouvé ${s.last_found_player_name} !`)
            setTimeout(() => setFoundToast(null), 3500)
          }
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'carriere_players' }, () => {
        const sid = sessionRef.current?.id
        if (sid) {
          supabaseCarriere.from('carriere_players').select('*').eq('session_id', sid)
            .then(({ data }) => { if (data) setPlayers(data as CarrierePlayer[]) })
        }
      })
      .subscribe()

    return () => { supabaseCarriere.removeChannel(channel) }
  }, [code, router])

  // Charge la fiche quand current_player_id change (y compris au load initial)
  useEffect(() => {
    if (session?.current_player_id) {
      supabaseCarriere.from('player_cards').select('*').eq('id', session.current_player_id).single()
        .then(({ data }) => { if (data) setCard(data as PlayerCard) })
    } else {
      setCard(null)
    }
  }, [session?.current_player_id])

  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function startWithPlayer(playerCardId: string) {
    await fetch(`/api/carriere/sessions/${code}/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_card_id: playerCardId }),
    })
  }

  async function startRandom() {
    await fetch(`/api/carriere/sessions/${code}/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
  }

  async function revealNext() {
    await fetch(`/api/carriere/sessions/${code}/reveal`, { method: 'POST' })
  }

  async function nextPlayer() {
    await fetch(`/api/carriere/sessions/${code}/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Chargement…</p>
      </div>
    )
  }

  // ── FINISHED ──────────────────────────────────────────────────────
  if (session.status === 'finished') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl">🏆</div>
        <h1 className="text-3xl font-black">Partie terminée !</h1>
        <div className="w-full max-w-xs space-y-2">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${p.id === playerId ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'bg-zinc-900'}`}>
              <span className="text-zinc-500 w-5">{i + 1}.</span>
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="text-violet-400 font-bold">{p.score}pts</span>
            </div>
          ))}
        </div>
        <Link href="/carriere" className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl transition-colors">
          Retour
        </Link>
      </div>
    )
  }

  // ── LOBBY ─────────────────────────────────────────────────────────
  if (session.status === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <div className="relative px-5 pt-10 pb-8 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-950/60 via-zinc-950 to-zinc-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15)_0%,_transparent_60%)]" />
          <div className="relative z-10">
            <Link href="/carriere" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Retour</Link>
            <p className="text-zinc-400 text-sm mb-2 mt-3">Code de la partie</p>
            <button onClick={copyCode} className="group flex items-center justify-center gap-3 mx-auto">
              <span className="text-5xl font-black font-mono tracking-widest text-violet-400">{code}</span>
              <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-sm">
                {copied ? '✓ Copié' : '📋'}
              </span>
            </button>
            <p className="text-zinc-500 text-xs mt-2">Appuie pour copier · Partage ce code</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                {session.mode === 'host' ? '🎮 Mode Host' : '⚡ Enchaînement'}
              </span>
              {session.mode === 'chain' && (
                <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                  {session.rounds_total} manches
                </span>
              )}
              {session.mode === 'host' && (
                <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                  {session.reveal_mode === 'all' ? 'Tout visible' : 'Progressive'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 pb-8 flex flex-col gap-5 max-w-sm mx-auto w-full">
          {/* Joueurs */}
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-3">Joueurs ({players.length})</p>
            <div className="space-y-2">
              {players.map((p, i) => (
                <div key={p.id} className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${p.id === playerId ? 'bg-violet-500/15 ring-1 ring-violet-500' : 'bg-zinc-900'}`}>
                  <span className="text-xl">{AVATARS[i % AVATARS.length]}</span>
                  <span className="flex-1 font-medium">{p.name}</span>
                  {p.id === playerId && <span className="text-violet-400 text-xs">toi</span>}
                </div>
              ))}
              {players.length === 0 && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-zinc-800">
                  <span className="text-xl opacity-30">👤</span>
                  <span className="text-zinc-700 text-sm">En attente de joueurs…</span>
                </div>
              )}
            </div>
          </div>

          {/* Lien écran TV */}
          <a href={`/carriere/screen/${code}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-2xl transition-colors">
            <span className="text-xl">📺</span>
            <div>
              <p className="text-sm font-medium">Ouvrir l&apos;écran TV</p>
              <p className="text-zinc-500 text-xs">Pour projeter sur grand écran</p>
            </div>
            <span className="text-zinc-600 ml-auto">→</span>
          </a>

          {/* Sélection joueur (mode host) */}
          {session.mode === 'host' && (
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-2">Choisir le joueur à deviner</p>
              <PlayerSearch onSelect={(id) => startWithPlayer(id)} placeholder="Chercher ou importer un joueur…" />
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 border-t border-zinc-800" />
                <span className="text-zinc-600 text-xs">ou</span>
                <div className="flex-1 border-t border-zinc-800" />
              </div>
              <button onClick={startRandom}
                className="mt-2 w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm font-medium transition-colors">
                🎲 Joueur aléatoire
              </button>
            </div>
          )}

          {/* Lancer (mode chain) */}
          {session.mode === 'chain' && (
            <button onClick={startRandom}
              className="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-violet-900/30">
              🚀 Lancer la partie
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── ACTIVE ────────────────────────────────────────────────────────
  const totalClubs = card?.career.length ?? 0
  const canRevealMore = session.reveal_mode === 'progressive' && session.revealed_count < totalClubs && !session.round_found

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Toast "trouvé" */}
      {foundToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-xl text-sm whitespace-nowrap animate-bounce">
          🎉 {foundToast}
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-6 pb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-zinc-600 text-xs">🎮 HOST · <span className="font-mono font-bold text-violet-400">{code}</span></p>
          {session.mode === 'chain' && (
            <p className="text-zinc-400 text-xs mt-0.5">Manche {session.rounds_done + 1} / {session.rounds_total}</p>
          )}
        </div>
        {/* Scoreboard mini */}
        <div className="flex gap-1.5 overflow-x-auto">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${p.id === playerId ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'bg-zinc-900'}`}>
              <span className="text-zinc-400">{i + 1}.</span>
              <span className="truncate max-w-[60px]">{p.name}</span>
              <span className="text-violet-400 font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau carrière (HOST voit tout) */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {card ? (
          <CareerTable
            career={card.career}
            nationalTeam={card.national_team}
            revealMode="all"
            revealedCount={totalClubs}
            roundFound={session.round_found}
            playerName={card.name}
          />
        ) : (
          <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">Aucun joueur sélectionné</div>
        )}
      </div>

      {/* Contrôles host (mode host uniquement) */}
      {session.mode === 'host' && card && (
        <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-4 py-4 flex flex-col gap-2">
          {session.round_found ? (
            <>
              <p className="text-emerald-400 text-sm font-bold text-center">
                ✓ Trouvé par {session.round_found_by}
              </p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <PlayerSearch onSelect={(id) => startWithPlayer(id)} placeholder="Choisir le joueur suivant…" />
                </div>
                <button onClick={nextPlayer}
                  className="shrink-0 bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
                  🎲 Random
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              {canRevealMore && (
                <button onClick={revealNext}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold py-3 rounded-xl transition-all">
                  Révéler club suivant ({session.revealed_count}/{totalClubs})
                </button>
              )}
              {!canRevealMore && session.reveal_mode === 'progressive' && (
                <span className="flex-1 text-center text-zinc-500 text-sm self-center">Tous les clubs révélés</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chain mode : le host est spectateur */}
      {session.mode === 'chain' && (
        <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-4 py-3">
          <p className="text-zinc-500 text-xs text-center">Les joueurs devinent — avance auto à chaque bonne réponse</p>
        </div>
      )}
    </div>
  )
}
