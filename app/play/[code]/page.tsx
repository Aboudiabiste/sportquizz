'use client'

import { useEffect, useState, use, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, type Game, type Quiz, type Player, type Answer, type Difficulty } from '@/lib/supabase'
import QuizTable from '@/app/components/QuizTable'
import Timer from '@/app/components/Timer'

export default function PlayPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [playerId, setPlayerId] = useState<string>('')
  const [finished, setFinished] = useState(false)
  // Ref pour éviter une dépendance sur game?.id dans useEffect (évite re-subscribe)
  const gameRef = useRef<Game | null>(null)

  useEffect(() => {
    const pid = sessionStorage.getItem(`player_${code}`) ?? ''
    setPlayerId(pid)

    async function load() {
      const res = await fetch(`/api/games/${code}`)
      if (!res.ok) { router.push('/join'); return }
      const g: Game = await res.json()
      if (g.status === 'lobby') { router.push(`/lobby/${code}`); return }
      gameRef.current = g
      setGame(g)

      // Quiz + players + answers en parallèle (au lieu de 3 requêtes séquentielles)
      const [qRes, pRes, { data: answersData }] = await Promise.all([
        g.quiz_id ? fetch(`/api/quizzes/${g.quiz_id}`) : Promise.resolve(null),
        fetch(`/api/games/${code}/players`),
        supabase.from('answers').select('*').eq('game_id', g.id),
      ])
      if (qRes?.ok) setQuiz(await qRes.json())
      if (pRes.ok) setPlayers(await pRes.json())
      if (answersData) setAnswers(answersData as Answer[])
    }
    load()

    const channel = supabase
      .channel(`play-${code}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, () => {
        const id = gameRef.current?.id
        if (id) supabase.from('answers').select('*').eq('game_id', id)
          .then(({ data }) => { if (data) setAnswers(data as Answer[]) })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `code=eq.${code}` },
        (payload) => {
          const g = payload.new as Game
          gameRef.current = g
          setGame(g)
          if (g.status === 'finished') setFinished(true)
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, () => {
        const id = gameRef.current?.id
        if (id) supabase.from('players').select('*').eq('game_id', id)
          .then(({ data }) => { if (data) setPlayers(data as Player[]) })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [code, router]) // Plus game?.id ni loadAnswers dans les deps → subscribe une seule fois

  async function handleAnswer(rowIndex: number, columnKey: string) {
    if (!game || !playerId || !quiz) return

    const res = await fetch(`/api/games/${code}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, row_index: rowIndex, column_key: columnKey, total_rows: quiz.rows.length }),
    })
    if (!res.ok) return

    // Pas de loadAnswers ici : le realtime answers va se déclencher automatiquement
    // Vérification de completion en optimiste sur l'état courant
    const answerCols = quiz.columns.filter(c => c.is_answer)
    const totalCells = quiz.rows.length * answerCols.length
    const myAnswers = answers.filter(a => a.player_id === playerId).length + 1
    if (myAnswers >= totalCells) {
      await fetch(`/api/games/${code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'finished', finished_at: new Date().toISOString(), winner_id: playerId }),
      })
    }
  }

  async function handleTimerExpire() {
    if (!game || game.status === 'finished') return
    await fetch(`/api/games/${code}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'finished', finished_at: new Date().toISOString() }),
    })
    setFinished(true)
  }

  const sortedPlayers = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players])

  if (!game || !quiz) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">Chargement…</p>
      </div>
    )
  }

  if (finished || game.status === 'finished') {
    const winner = players.find(p => p.id === game.winner_id)
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <div className="text-6xl">🏆</div>
        <h1 className="text-3xl font-black">Partie terminée !</h1>
        {winner && <p className="text-sky-400 text-xl font-bold">{winner.name} a complété le tableau !</p>}
        <div className="w-full max-w-xs space-y-2">
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${p.id === playerId ? 'bg-sky-500/20 ring-1 ring-sky-500' : 'bg-zinc-900'}`}>
              <span className="text-zinc-500 w-5">{i + 1}.</span>
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="text-sky-400 font-bold">{p.score}pts</span>
            </div>
          ))}
        </div>
        <button onClick={() => router.push('/')} className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl transition-colors">
          Retour à l&apos;accueil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.push('/')} className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors mb-0.5">← Accueil</button>
          <h1 className="font-bold text-sm text-zinc-300">{quiz.title}</h1>
          <p className="text-zinc-500 text-xs">{quiz.sport}</p>
        </div>
        {game.started_at && (
          <Timer
            startedAt={game.started_at}
            durationSeconds={300}
            onExpire={handleTimerExpire}
          />
        )}
      </div>

      {/* Scoreboard mini */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sortedPlayers.map((p, i) => (
          <div key={p.id} className={`shrink-0 flex items-center gap-2 px-3 py-1 rounded-full text-xs ${p.id === playerId ? 'bg-sky-500/20 ring-1 ring-sky-500' : 'bg-zinc-900'}`}>
            <span className="text-zinc-500">{i + 1}.</span>
            <span>{p.name}</span>
            <span className="text-sky-400 font-bold">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Quiz table */}
      <QuizTable
        quiz={quiz}
        difficulty={game.difficulty as Difficulty}
        answers={answers}
        currentPlayerId={playerId}
        onAnswer={handleAnswer}
        disabled={finished}
      />
    </div>
  )
}
