'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JoinPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function join() {
    const trimCode = code.trim().toUpperCase()
    const trimName = name.trim()
    if (!trimCode || !trimName) return
    if (trimCode.length !== 6) { setError('Le code fait 6 caractères'); return }
    if (trimName.length > 20) { setError('Pseudo trop long (20 max)'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/games/${trimCode}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')
      sessionStorage.setItem(`player_${trimCode}`, data.id)
      router.push(`/lobby/${trimCode}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header gradient */}
      <div className="relative px-5 pt-10 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Accueil</Link>
          <h1 className="text-2xl font-black mt-2">Rejoindre une partie</h1>
          <p className="text-zinc-500 text-sm mt-1">Entre le code partagé par le créateur</p>
        </div>
      </div>

      <div className="flex-1 px-5 pb-10 flex flex-col gap-4 max-w-sm mx-auto w-full">
        {/* Code input */}
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-2">Code de la partie</p>
          <input
            className="w-full bg-zinc-900 rounded-2xl px-5 py-5 text-3xl font-black font-mono tracking-[0.3em] text-center uppercase outline-none focus:ring-2 ring-sky-500 transition-all"
            placeholder="XXXXXX"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            inputMode="text"
            autoCapitalize="characters"
          />
        </div>

        {/* Pseudo */}
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-2">Ton pseudo</p>
          <input
            className="w-full bg-zinc-900 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 ring-sky-500 transition-all"
            placeholder="Ex: Arthur le Hmar"
            maxLength={20}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && join()}
          />
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={join}
          disabled={loading || code.length !== 6 || !name.trim()}
          className="w-full bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-40 text-black font-bold py-4 rounded-2xl text-lg transition-all mt-2 shadow-lg shadow-sky-900/30"
        >
          {loading ? 'Connexion…' : 'Rejoindre la partie'}
        </button>
      </div>
    </div>
  )
}
