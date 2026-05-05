'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function randomKey() {
  return Math.random().toString(36).slice(2, 18)
}

export default function CarriereLanding() {
  const router = useRouter()

  const [mode, setMode] = useState<'host' | 'chain' | null>(null)
  const [revealMode, setRevealMode] = useState<'all' | 'progressive'>('progressive')
  const [rounds, setRounds] = useState(5)
  const [pseudo, setPseudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function create() {
    const trimPseudo = pseudo.trim()
    if (!trimPseudo || !mode) return
    setLoading(true)
    setError('')
    const hostKey = randomKey()
    try {
      const res = await fetch('/api/carriere/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, reveal_mode: revealMode, rounds_total: rounds, host_key: hostKey }),
      })
      const session = await res.json()
      if (!res.ok) throw new Error(session.error ?? 'Erreur')

      // Rejoint sa propre session
      const pRes = await fetch(`/api/carriere/sessions/${session.code}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimPseudo }),
      })
      const player = await pRes.json()
      if (!pRes.ok) throw new Error(player.error ?? 'Erreur')

      sessionStorage.setItem(`carriere_player_${session.code}`, player.id)
      sessionStorage.setItem(`carriere_host_${session.code}`, hostKey)
      router.push(`/carriere/host/${session.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-10 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.12)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Accueil</Link>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-4xl">🃏</span>
            <div>
              <h1 className="text-2xl font-black">Devine la Carrière</h1>
              <p className="text-zinc-400 text-sm">Identifie le joueur grâce à sa carrière</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pb-10 flex flex-col gap-5 max-w-sm mx-auto w-full">

        {/* Rejoindre */}
        <Link
          href="/carriere/join"
          className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-2xl transition-colors border border-zinc-800"
        >
          <span className="text-xl">🔗</span>
          <div>
            <p className="font-medium text-sm">Rejoindre une partie</p>
            <p className="text-zinc-500 text-xs">J&apos;ai un code de 6 caractères</p>
          </div>
          <span className="text-zinc-600 ml-auto">→</span>
        </Link>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-zinc-950 px-3 text-zinc-600 text-xs">ou créer une partie</span>
          </div>
        </div>

        {/* Choix du mode */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode('host')}
            className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl text-center transition-all ${
              mode === 'host' ? 'bg-violet-500/20 ring-2 ring-violet-500' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            <span className="text-3xl">🎮</span>
            <p className={`font-bold text-sm ${mode === 'host' ? 'text-violet-400' : ''}`}>Mode Host</p>
            <p className="text-zinc-500 text-xs leading-tight">Tu choisis le joueur et contrôles les indices</p>
          </button>
          <button
            onClick={() => setMode('chain')}
            className={`flex flex-col items-center gap-2 py-5 px-3 rounded-2xl text-center transition-all ${
              mode === 'chain' ? 'bg-violet-500/20 ring-2 ring-violet-500' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            <span className="text-3xl">⚡</span>
            <p className={`font-bold text-sm ${mode === 'chain' ? 'text-violet-400' : ''}`}>Enchaînement</p>
            <p className="text-zinc-500 text-xs leading-tight">Joueurs random, premier qui trouve = 1 point</p>
          </button>
        </div>

        {/* Options selon mode */}
        {mode === 'host' && (
          <div className="flex flex-col gap-3">
            <p className="text-zinc-400 text-sm font-medium">Révélation des clubs</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRevealMode('progressive')}
                className={`py-3 px-3 rounded-xl text-center transition-colors ${revealMode === 'progressive' ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'bg-zinc-900 hover:bg-zinc-800'}`}
              >
                <p className={`font-bold text-sm ${revealMode === 'progressive' ? 'text-violet-400' : ''}`}>Progressive</p>
                <p className="text-zinc-500 text-xs mt-0.5">Tu révèles club par club</p>
              </button>
              <button
                onClick={() => setRevealMode('all')}
                className={`py-3 px-3 rounded-xl text-center transition-colors ${revealMode === 'all' ? 'bg-violet-500/20 ring-1 ring-violet-500' : 'bg-zinc-900 hover:bg-zinc-800'}`}
              >
                <p className={`font-bold text-sm ${revealMode === 'all' ? 'text-violet-400' : ''}`}>Tout visible</p>
                <p className="text-zinc-500 text-xs mt-0.5">Tous les clubs dès le départ</p>
              </button>
            </div>
          </div>
        )}

        {mode === 'chain' && (
          <div className="flex flex-col gap-2">
            <p className="text-zinc-400 text-sm font-medium">Nombre de manches</p>
            <div className="flex gap-2">
              {[3, 5, 8, 10, 15].map(n => (
                <button
                  key={n}
                  onClick={() => setRounds(n)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${rounds === n ? 'bg-violet-500/20 ring-1 ring-violet-500 text-violet-400' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pseudo */}
        {mode && (
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-2">Ton pseudo</p>
            <input
              className="w-full bg-zinc-900 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 ring-violet-500 transition-all"
              placeholder="Ex: Arthur le Hmar"
              maxLength={20}
              value={pseudo}
              autoFocus
              onChange={e => setPseudo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && pseudo.trim() && create()}
            />
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {mode && (
          <button
            onClick={create}
            disabled={loading || !pseudo.trim()}
            className="w-full bg-violet-600 hover:bg-violet-500 active:scale-95 disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-violet-900/30"
          >
            {loading ? 'Création…' : 'Créer la partie 🚀'}
          </button>
        )}
      </div>
    </div>
  )
}
