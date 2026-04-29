'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Difficulty, ScoringMode } from '@/lib/supabase'

interface QuizSummary { id: string; title: string; sport: string; description: string | null }

const SPORT_EMOJI: Record<string, string> = { football: '⚽', f1: '🏎️', tennis: '🎾', cyclisme: '🚴', autre: '🏆' }
const SPORT_LABELS: Record<string, string> = { football: 'Football', f1: 'Formule 1', tennis: 'Tennis', cyclisme: 'Cyclisme', autre: 'Autre' }
const ALL_SPORTS = Object.keys(SPORT_EMOJI)

export default function NewGamePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 — quiz selection
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [sportFilter, setSportFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [quizId, setQuizId] = useState<string>('demo')

  // Step 2 — options
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [scoringMode, setScoringMode] = useState<ScoringMode>('individual')

  // Step 3 — pseudo + launch
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/quizzes').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setQuizzes(data)
    })
  }, [])

  const filtered = quizzes
    .filter(q => sportFilter === 'all' || q.sport === sportFilter)
    .filter(q => !search.trim() || q.title.toLowerCase().includes(search.trim().toLowerCase()))

  const selectedQuiz = quizId === 'demo'
    ? { title: 'Buteurs LDC (démo)', sport: 'football' }
    : quizzes.find(q => q.id === quizId)

  async function launch() {
    const trimName = name.trim()
    if (!trimName) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty,
          scoring_mode: scoringMode,
          quiz_id: quizId === 'demo' ? null : quizId,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur')

      const pRes = await fetch(`/api/games/${data.code}/players`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimName }),
      })
      const player = await pRes.json()
      if (!pRes.ok) throw new Error(player.error ?? 'Erreur')

      sessionStorage.setItem(`player_${data.code}`, player.id)
      router.push(`/lobby/${data.code}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-10 pb-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(14,165,233,0.12)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          {step === 1
            ? <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Accueil</Link>
            : <button onClick={() => setStep(step - 1)} className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Retour</button>
          }
          <h1 className="text-2xl font-black mt-2">Nouvelle partie</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < step ? 'bg-sky-500 text-black' :
                  s === step ? 'bg-sky-500/20 ring-2 ring-sky-500 text-sky-400' :
                  'bg-zinc-800 text-zinc-600'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-8 rounded-full transition-all ${s < step ? 'bg-sky-500' : 'bg-zinc-800'}`} />}
              </div>
            ))}
            <span className="text-zinc-500 text-xs ml-2">
              {step === 1 ? 'Choix du quiz' : step === 2 ? 'Options' : 'Lancer'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pb-8">

        {/* ── STEP 1 : Quiz selection ─────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            {/* Sport filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button
                onClick={() => setSportFilter('all')}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sportFilter === 'all' ? 'bg-sky-500 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
              >
                Tous
              </button>
              {ALL_SPORTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSportFilter(s)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${sportFilter === s ? 'bg-sky-500 text-black' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                >
                  {SPORT_EMOJI[s]} {SPORT_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
              <input
                className="w-full bg-zinc-900 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-sky-500 transition-all placeholder:text-zinc-600"
                placeholder="Rechercher un quiz…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">✕</button>
              )}
            </div>

            {/* Quiz list */}
            <div className="space-y-2">
              {/* Demo */}
              {(sportFilter === 'all' || sportFilter === 'football') && (
                <QuizCard
                  emoji="⚽"
                  title="Buteurs LDC all-time"
                  subtitle="Quiz de démonstration · Football"
                  selected={quizId === 'demo'}
                  onSelect={() => setQuizId('demo')}
                />
              )}
              {filtered.map(q => (
                <QuizCard
                  key={q.id}
                  emoji={SPORT_EMOJI[q.sport] ?? '🏆'}
                  title={q.title}
                  subtitle={`${SPORT_LABELS[q.sport] ?? q.sport}${q.description ? ' · ' + q.description : ''}`}
                  selected={quizId === q.id}
                  onSelect={() => setQuizId(q.id)}
                />
              ))}
            </div>

            {/* Create new quiz */}
            <div className="mt-2 border-t border-zinc-800 pt-4">
              <p className="text-zinc-500 text-xs mb-3">Tu ne trouves pas ton quiz ?</p>
              <Link
                href="/admin"
                className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-2xl transition-colors"
              >
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-medium text-sm">Créer un quiz manuellement</p>
                  <p className="text-zinc-500 text-xs">Ajoute tes propres colonnes et données</p>
                </div>
              </Link>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-sky-500 hover:bg-sky-400 active:scale-95 text-black font-bold py-4 rounded-2xl text-lg transition-all mt-2"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* ── STEP 2 : Options ────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Selected quiz recap */}
            <div className="bg-zinc-900 px-4 py-3 rounded-xl flex items-center gap-3">
              <span className="text-xl">{SPORT_EMOJI[selectedQuiz?.sport ?? 'football'] ?? '🏆'}</span>
              <span className="text-sm font-medium text-zinc-300">{selectedQuiz?.title}</span>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-3">Difficulté</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ['easy', 'Facile', 'Tous les indices visibles'],
                  ['medium', 'Moyen', 'Moitié des indices'],
                  ['hard', 'Difficile', '1 seul indice'],
                ] as [Difficulty, string, string][]).map(([d, label, desc]) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex flex-col items-center py-3 px-2 rounded-xl text-center transition-colors ${difficulty === d ? 'bg-sky-500/20 ring-2 ring-sky-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                  >
                    <span className={`font-bold text-sm ${difficulty === d ? 'text-sky-400' : ''}`}>{label}</span>
                    <span className="text-zinc-500 text-xs mt-0.5 leading-tight">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scoring */}
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-3">Mode de scoring</p>
              <div className="space-y-2">
                {([
                  ['individual', 'Individuel', 'Tout le monde score, même si la réponse est déjà trouvée'],
                  ['competitive', 'Compétitif', 'Premier qui trouve = il vole la case'],
                  ['speed', 'Vitesse', 'Plus tu réponds vite, plus tu gagnes de points'],
                ] as [ScoringMode, string, string][]).map(([mode, label, desc]) => (
                  <button
                    key={mode}
                    onClick={() => setScoringMode(mode)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${scoringMode === mode ? 'bg-sky-500/20 ring-1 ring-sky-500' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                  >
                    <div className={`font-medium text-sm ${scoringMode === mode ? 'text-sky-400' : ''}`}>{label}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 font-bold py-4 rounded-2xl transition-colors">
                ← Retour
              </button>
              <button onClick={() => setStep(3)} className="flex-1 bg-sky-500 hover:bg-sky-400 active:scale-95 text-black font-bold py-4 rounded-2xl transition-all">
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 : Pseudo + launch ─────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            {/* Recap */}
            <div className="bg-zinc-900 px-4 py-3 rounded-xl space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Quiz</span>
                <span className="font-medium">{selectedQuiz?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Difficulté</span>
                <span className="font-medium">{difficulty === 'easy' ? 'Facile' : difficulty === 'medium' ? 'Moyen' : 'Difficile'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Scoring</span>
                <span className="font-medium capitalize">{scoringMode}</span>
              </div>
            </div>

            <div>
              <p className="text-zinc-400 text-sm font-medium mb-2">Ton pseudo</p>
              <input
                className="w-full bg-zinc-900 rounded-2xl px-5 py-4 text-lg outline-none focus:ring-2 ring-sky-500 transition-all"
                placeholder="Ex: Arthur le Hmar"
                maxLength={20}
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && launch()}
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 font-bold py-4 rounded-2xl transition-colors">
                ← Retour
              </button>
              <button
                onClick={launch}
                disabled={loading || !name.trim()}
                className="flex-1 bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-40 text-black font-bold py-4 rounded-2xl transition-all"
              >
                {loading ? 'Création…' : 'Créer 🚀'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function QuizCard({ emoji, title, subtitle, selected, onSelect }: {
  emoji: string; title: string; subtitle: string; selected: boolean; onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${selected ? 'bg-sky-500/15 ring-2 ring-sky-500' : 'bg-zinc-900 hover:bg-zinc-800'}`}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm truncate ${selected ? 'text-sky-400' : ''}`}>{title}</p>
        <p className="text-zinc-500 text-xs truncate">{subtitle}</p>
      </div>
      {selected && <span className="text-sky-400 shrink-0">✓</span>}
    </button>
  )
}
