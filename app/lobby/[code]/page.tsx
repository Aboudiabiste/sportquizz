'use client'

import { useEffect, useState, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Game, type Player } from '@/lib/supabase'

export default function LobbyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerId, setPlayerId] = useState<string>('')
  const [starting, setStarting] = useState(false)
  const [copied, setCopied] = useState(false)
  const gameRef = useRef<Game | null>(null)

  useEffect(() => {
    const pid = sessionStorage.getItem(`player_${code}`) ?? ''
    setPlayerId(pid)

    async function load() {
      const [gRes, pRes] = await Promise.all([
        fetch(`/api/games/${code}`),
        fetch(`/api/games/${code}/players`),
      ])
      if (gRes.ok) {
        const g = await gRes.json()
        gameRef.current = g
        setGame(g)
      }
      if (pRes.ok) setPlayers(await pRes.json())
    }
    load()

    const channel = supabase
      .channel(`lobby-${code}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        const id = gameRef.current?.id
        if (id) supabase.from('players').select('*').eq('game_id', id)
          .then(({ data }) => { if (data) setPlayers(data as Player[]) })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `code=eq.${code}` },
        (payload) => {
          const g = payload.new as Game
          gameRef.current = g
          setGame(g)
          if (g.status === 'active') router.push(`/play/${code}`)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [code, router])

  async function startGame() {
    setStarting(true)
    const res = await fetch(`/api/games/${code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active', started_at: new Date().toISOString() }),
    })
    if (res.ok) router.push(`/play/${code}`)
    else setStarting(false)
  }

  function copyCode() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const diffLabel: Record<string, string> = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }
  const modeLabel: Record<string, string> = { individual: 'Individuel', competitive: 'Compétitif', speed: 'Vitesse' }
  const AVATARS = ['🧑', '👩', '🧔', '👱', '🧕']

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-10 pb-8 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/60 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.15)_0%,_transparent_60%)]" />
        <div className="relative z-10">
          <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Accueil</Link>
          <p className="text-zinc-400 text-sm mb-2 mt-3">Code de la partie</p>
          <button
            onClick={copyCode}
            className="group flex items-center justify-center gap-3 mx-auto"
          >
            <span className="text-5xl font-black font-mono tracking-widest text-sky-400">
              {code}
            </span>
            <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors text-sm">
              {copied ? '✓ Copié' : '📋'}
            </span>
          </button>
          <p className="text-zinc-500 text-xs mt-2">Appuie pour copier · Partage ce code à tes amis</p>

          {game && (
            <div className="flex justify-center gap-2 mt-4">
              <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                {diffLabel[game.difficulty]}
              </span>
              <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300">
                {modeLabel[game.scoring_mode]}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Players */}
      <div className="flex-1 px-5 pb-8 flex flex-col gap-5 max-w-sm mx-auto w-full">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-3">
            Joueurs <span className="text-zinc-600">({players.length}/5)</span>
          </p>
          <div className="space-y-2">
            {players.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${p.id === playerId ? 'bg-sky-500/15 ring-1 ring-sky-500' : 'bg-zinc-900'}`}
              >
                <span className="text-xl">{AVATARS[i % AVATARS.length]}</span>
                <span className="font-medium flex-1">{p.name}</span>
                {p.id === playerId && (
                  <span className="text-sky-400 text-xs font-medium">toi</span>
                )}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 2 - players.length) }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-zinc-800">
                <span className="text-xl opacity-30">👤</span>
                <span className="text-zinc-700 text-sm">En attente…</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screen link */}
        <a
          href={`/screen/${code}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-2xl transition-colors"
        >
          <span className="text-xl">📺</span>
          <div>
            <p className="text-sm font-medium">Ouvrir l&apos;écran TV</p>
            <p className="text-zinc-500 text-xs">Pour projeter sur grand écran</p>
          </div>
          <span className="text-zinc-600 ml-auto">→</span>
        </a>

        <button
          onClick={startGame}
          disabled={starting || players.length === 0}
          className="w-full bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-40 text-black font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-sky-900/30"
        >
          {starting ? 'Lancement…' : '🚀 Lancer la partie'}
        </button>
        <p className="text-zinc-600 text-xs text-center -mt-2">N&apos;importe quel joueur peut lancer</p>
      </div>
    </div>
  )
}
