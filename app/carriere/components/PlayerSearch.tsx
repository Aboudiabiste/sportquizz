'use client'

import { useState, useRef, useEffect } from 'react'

interface PlayerResult {
  id: string
  name: string
  nationality: string | null
  position: string | null
}

interface Props {
  onSelect: (id: string, name: string) => void
  placeholder?: string
}

export default function PlayerSearch({ onSelect, placeholder = 'Chercher un joueur…' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlayerResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showWiki, setShowWiki] = useState(false)
  const [wikiTitle, setWikiTitle] = useState('')
  const [wikiNat, setWikiNat] = useState('')
  const [wikiPos, setWikiPos] = useState('')
  const [wikiLoading, setWikiLoading] = useState(false)
  const [wikiError, setWikiError] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.length < 2) { setResults([]); setShowWiki(false); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      const res = await fetch(`/api/carriere/players/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
      setShowWiki(Array.isArray(data) && data.length === 0)
      setLoading(false)
    }, 300)
  }, [query])

  async function fetchWiki() {
    if (!wikiTitle.trim()) return
    setWikiLoading(true)
    setWikiError('')
    const res = await fetch('/api/carriere/players/wiki', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wikiTitle: wikiTitle.trim(), nationality: wikiNat, position: wikiPos }),
    })
    const data = await res.json()
    setWikiLoading(false)
    if (!res.ok) { setWikiError(data.error ?? 'Erreur'); return }
    setShowWiki(false)
    setQuery('')
    onSelect(data.id, data.name)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Champ de recherche */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
        <input
          className="w-full bg-zinc-900 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-violet-500 transition-all placeholder:text-zinc-600"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs animate-pulse">…</span>
        )}
      </div>

      {/* Résultats DB */}
      {results.length > 0 && (
        <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => { setQuery(''); setResults([]); onSelect(p.id, p.name) }}
              className="w-full text-left px-4 py-2.5 hover:bg-zinc-800 transition-colors flex items-center justify-between gap-3 border-b border-zinc-800/60 last:border-0"
            >
              <span className="font-medium text-sm">{p.name}</span>
              <span className="text-zinc-500 text-xs shrink-0">
                {[p.position, p.nationality].filter(Boolean).join(' · ')}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Fallback Wikipedia */}
      {showWiki && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-zinc-400 text-xs">Aucun résultat en base. Importer depuis Wikipedia :</p>
          <input
            className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-violet-500 transition-all placeholder:text-zinc-600"
            placeholder="Titre exact page Wikipedia EN (ex: David Beckham)"
            value={wikiTitle}
            onChange={e => setWikiTitle(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-violet-500 transition-all placeholder:text-zinc-600"
              placeholder="Nationalité"
              value={wikiNat}
              onChange={e => setWikiNat(e.target.value)}
            />
            <input
              className="flex-1 bg-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-violet-500 transition-all placeholder:text-zinc-600"
              placeholder="Poste"
              value={wikiPos}
              onChange={e => setWikiPos(e.target.value)}
            />
          </div>
          {wikiError && <p className="text-red-400 text-xs">{wikiError}</p>}
          <button
            onClick={fetchWiki}
            disabled={wikiLoading || !wikiTitle.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            {wikiLoading ? 'Chargement Wikipedia…' : 'Importer'}
          </button>
        </div>
      )}
    </div>
  )
}
