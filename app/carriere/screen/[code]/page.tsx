'use client'

import { useEffect, useState, use, useRef } from 'react'
import { supabase as supabaseCarriere } from '@/lib/carriere'
import type { CarriereSession, CarrierePlayer, PlayerCard } from '@/lib/carriere'
import CareerTable from '@/app/carriere/components/CareerTable'

export default function CarriereScreenPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)

  const [session, setSession] = useState<CarriereSession | null>(null)
  const [players, setPlayers] = useState<CarrierePlayer[]>([])
  const [card, setCard] = useState<PlayerCard | null>(null)
  const [foundToast, setFoundToast] = useState<string | null>(null)

  const sessionRef = useRef<CarriereSession | null>(null)
  const prevFoundBy = useRef<string | null>(null)

  useEffect(() => {
    async function load() {
      const [sRes, pRes] = await Promise.all([
        fetch(`/api/carriere/sessions/${code}`),
        fetch(`/api/carriere/sessions/${code}/players`),
      ])
      if (sRes.ok) {
        const s: CarriereSession = await sRes.json()
        sessionRef.current = s
        setSession(s)
      }
      if (pRes.ok) setPlayers(await pRes.json())
    }
    load()

    const channel = supabaseCarriere
      .channel(`carriere-screen-${code}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'carriere_sessions', filter: `code=eq.${code}` },
        (payload) => {
          const s = payload.new as CarriereSession
          sessionRef.current = s
          setSession(s)
          if (s.last_found_by_name && s.last_found_by_name !== prevFoundBy.current) {
            prevFoundBy.current = s.last_found_by_name
            setFoundToast(`${s.last_found_by_name} a trouvé ${s.last_found_player_name} !`)
            setTimeout(() => setFoundToast(null), 4000)
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
  }, [code])

  useEffect(() => {
    if (session?.current_player_id) {
      supabaseCarriere.from('player_cards').select('*').eq('id', session.current_player_id).single()
        .then(({ data }) => { if (data) setCard(data as PlayerCard) })
    } else {
      setCard(null)
    }
  }, [session?.current_player_id])

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)

  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Chargement…</p>
      </div>
    )
  }

  if (session.status === 'finished') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-8xl">🏆</div>
        <h1 className="text-5xl font-black">Partie terminée !</h1>
        <div className="space-y-3 w-full max-w-md">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 bg-zinc-900 px-6 py-4 rounded-2xl">
              <span className="text-3xl font-black text-zinc-600 w-8">{i + 1}</span>
              <span className="flex-1 font-bold text-xl">{p.name}</span>
              <span className="text-violet-400 font-black text-2xl">{p.score}pts</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (session.status === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6">
        <div className="text-6xl">🃏</div>
        <h1 className="text-4xl font-black">Devine la Carrière</h1>
        <p className="text-zinc-400 text-xl">Code : <span className="font-mono font-black text-violet-400 text-3xl">{code}</span></p>
        <div className="space-y-2 mt-4">
          {players.map(p => (
            <div key={p.id} className="bg-zinc-900 px-6 py-3 rounded-xl text-center font-medium text-lg">{p.name}</div>
          ))}
        </div>
        <p className="text-zinc-600 text-sm mt-4 animate-pulse">En attente du lancement…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col lg:flex-row gap-0">
      {/* Toast */}
      {foundToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl shadow-2xl text-xl whitespace-nowrap">
          🎉 {foundToast}
        </div>
      )}

      {/* Tableau (colonne principale) */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-violet-400 font-mono font-bold text-lg">{code}</p>
            {session.mode === 'chain' && (
              <p className="text-zinc-400 text-sm">Manche {session.rounds_done + 1} / {session.rounds_total}</p>
            )}
          </div>
          {session.mode === 'host' && session.reveal_mode === 'progressive' && card && (
            <p className="text-zinc-500 text-sm">{session.revealed_count}/{card.career.length} clubs révélés</p>
          )}
        </div>

        {card ? (
          <div className="max-w-xl">
            <CareerTable
              career={card.career}
              nationalTeam={card.national_team}
              revealMode={session.reveal_mode}
              revealedCount={session.revealed_count}
              roundFound={session.round_found}
              playerName={session.round_found ? card.name : undefined}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 text-zinc-600 text-lg animate-pulse">
            En attente du joueur…
          </div>
        )}
      </div>

      {/* Scoreboard (colonne droite) */}
      <div className="lg:w-64 bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 p-5 flex flex-col gap-4">
        <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider">Scores</p>
        <div className="space-y-2">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-800 rounded-xl">
              <span className="text-zinc-500 text-sm w-4">{i + 1}.</span>
              <span className="flex-1 font-medium text-sm">{p.name}</span>
              <span className="text-violet-400 font-bold">{p.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
