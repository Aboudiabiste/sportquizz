'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase as supabaseCarriere } from '@/lib/carriere'
import type { CarriereSession, CarrierePlayer, PlayerCard } from '@/lib/carriere'
import CareerTable from '@/app/carriere/components/CareerTable'

export default function CarrierePlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()

  const [session, setSession] = useState<CarriereSession | null>(null)
  const [players, setPlayers] = useState<CarrierePlayer[]>([])
  const [card, setCard] = useState<PlayerCard | null>(null)
  const [playerId, setPlayerId] = useState('')
  const [guess, setGuess] = useState('')
  const [shake, setShake] = useState(false)
  const [foundToast, setFoundToast] = useState<string | null>(null)

  const sessionRef = useRef<CarriereSession | null>(null)
  const prevFoundBy = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const pid = sessionStorage.getItem(`carriere_player_${code}`) ?? ''
    if (!pid) { router.push(`/carriere/join`); return }
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
      if (pRes.ok) setPlayers(await pRes.json())
    }
    load()

    const channel = supabaseCarriere
      .channel(`carriere-play-${code}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'carriere_sessions', filter: `code=eq.${code}` },
        (payload) => {
          const s = payload.new as CarriereSession
          sessionRef.current = s
          setSession(s)
          // Toast trouvé
          if (s.last_found_by_name && s.last_found_by_name !== prevFoundBy.current) {
            prevFoundBy.current = s.last_found_by_name
            setFoundToast(`${s.last_found_by_name} a trouvé ${s.last_found_player_name} !`)
            setTimeout(() => setFoundToast(null), 3000)
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

  // Charge la fiche quand current_player_id change
  useEffect(() => {
    if (session?.current_player_id) {
      supabaseCarriere.from('player_cards').select('*').eq('id', session.current_player_id).single()
        .then(({ data }) => {
          if (data) { setCard(data as PlayerCard); setGuess('') }
        })
    } else {
      setCard(null)
    }
  }, [session?.current_player_id])

  async function submitGuess() {
    const trimGuess = guess.trim()
    if (!trimGuess || !playerId || !session || session.status !== 'active') return

    const res = await fetch(`/api/carriere/sessions/${code}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, guess: trimGuess }),
    })
    const data = await res.json()

    if (data.correct) {
      setGuess('')
    } else if (!data.alreadyFound) {
      // Mauvaise réponse : shake + clear
      setShake(true)
      setTimeout(() => { setShake(false); setGuess('') }, 500)
      inputRef.current?.focus()
    }
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const myPlayer = players.find(p => p.id === playerId)

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Chargement…</p>
      </div>
    )
  }

  // ── LOBBY ─────────────────────────────────────────────────────────
  if (session.status === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-4xl animate-pulse">⏳</div>
        <h2 className="text-xl font-black">En attente du host…</h2>
        <p className="text-zinc-400 text-sm">La partie va bientôt commencer</p>
        <div className="space-y-1.5 w-full max-w-xs">
          {players.map(p => (
            <div key={p.id} className={`flex items-center gap-3 px-4 py-2 rounded-xl ${p.id === playerId ? 'bg-violet-500/15 ring-1 ring-violet-500' : 'bg-zinc-900'}`}>
              <span className="flex-1 text-sm">{p.name}</span>
              {p.id === playerId && <span className="text-violet-400 text-xs">toi</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── FINISHED ──────────────────────────────────────────────────────
  if (session.status === 'finished') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl">🏆</div>
        <h1 className="text-3xl font-black">Partie terminée !</h1>
        {session.mode === 'chain' && (
          <p className="text-zinc-400 text-sm">{session.rounds_done} manches jouées</p>
        )}
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

  // ── ACTIVE ────────────────────────────────────────────────────────
  const alreadyFound = session.round_found

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Toast trouvé */}
      {foundToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold px-5 py-3 rounded-2xl shadow-xl text-sm whitespace-nowrap">
          🎉 {foundToast}
        </div>
      )}

      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between gap-3">
        <div>
          {session.mode === 'chain' && (
            <p className="text-zinc-500 text-xs">Manche {session.rounds_done + 1} / {session.rounds_total}</p>
          )}
          <p className="text-zinc-400 text-xs">
            Ton score : <span className="text-violet-400 font-bold">{myPlayer?.score ?? 0} pts</span>
          </p>
        </div>
        {/* Scoreboard mini */}
        <div className="flex gap-1.5 overflow-x-auto">
          {sortedPlayers.slice(0, 4).map((p, i) => (
            <div key={p.id} className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-xs ${p.id === playerId ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'bg-zinc-900'}`}>
              <span className="text-zinc-500">{i + 1}.</span>
              <span className="truncate max-w-[50px]">{p.name}</span>
              <span className="text-violet-400 font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau carrière */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {card ? (
          <CareerTable
            career={card.career}
            nationalTeam={card.national_team}
            revealMode={session.reveal_mode}
            revealedCount={session.revealed_count}
            roundFound={session.round_found}
            playerName={alreadyFound ? card.name : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-40 text-zinc-600 text-sm animate-pulse">
            En attente du joueur…
          </div>
        )}
      </div>

      {/* Input devinette */}
      {!alreadyFound && card && (
        <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-4 py-4">
          <div className={`flex gap-2 transition-all ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
            <input
              ref={inputRef}
              className="flex-1 bg-zinc-900 rounded-2xl px-4 py-3.5 text-base outline-none focus:ring-2 ring-violet-500 transition-all placeholder:text-zinc-600"
              placeholder="Quel joueur ?"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitGuess()}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              onClick={submitGuess}
              disabled={!guess.trim()}
              className="shrink-0 bg-violet-600 hover:bg-violet-500 active:scale-95 disabled:opacity-40 text-white font-bold px-5 rounded-2xl transition-all"
            >
              ✓
            </button>
          </div>
        </div>
      )}

      {alreadyFound && (
        <div className="sticky bottom-0 bg-zinc-950 border-t border-zinc-800 px-4 py-3 text-center">
          {session.mode === 'chain' ? (
            <p className="text-zinc-400 text-sm animate-pulse">Prochaine fiche en cours…</p>
          ) : (
            <p className="text-zinc-400 text-sm">En attente du host pour la suite…</p>
          )}
        </div>
      )}
    </div>
  )
}
