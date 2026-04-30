'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { supabase, type Game, type Quiz, type Player, type Answer, type Difficulty, getVisibleColumns } from '@/lib/supabase'
import Timer from '@/app/components/Timer'

export default function ScreenPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [game, setGame] = useState<Game | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])

  const loadAll = useCallback(async () => {
    const [gRes, pRes] = await Promise.all([
      fetch(`/api/games/${code}`),
      fetch(`/api/games/${code}/players`),
    ])
    if (gRes.ok) {
      const g = await gRes.json()
      setGame(g)
      if (g.quiz_id) {
        const qRes = await fetch(`/api/quizzes/${g.quiz_id}`)
        if (qRes.ok) setQuiz(await qRes.json())
      }
    }
    if (pRes.ok) setPlayers(await pRes.json())
  }, [code])

  const loadAnswers = useCallback(async (gameId: string) => {
    const { data } = await supabase.from('answers').select('*').eq('game_id', gameId)
    if (data) setAnswers(data as Answer[])
  }, [])

  useEffect(() => {
    loadAll()

    const channel = supabase
      .channel(`screen-${code}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' },
        () => { if (game?.id) loadAnswers(game.id) }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, loadAll)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: `code=eq.${code}` },
        (payload) => setGame(payload.new as Game)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [code, loadAll, loadAnswers, game?.id])

  useEffect(() => {
    if (game?.id) loadAnswers(game.id)
  }, [game?.id, loadAnswers])

  if (!game || !quiz) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 text-2xl animate-pulse">Chargement…</p>
      </div>
    )
  }

  const difficulty = game.difficulty as Difficulty
  const visibleCols = getVisibleColumns(quiz.columns, difficulty)
  const answerCols = quiz.columns.filter(c => c.is_answer)
  const foundCells = new Set(answers.map(a => `${a.row_index}-${a.column_key}`))
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const totalCells = quiz.rows.length * answerCols.length
  const foundCount = foundCells.size

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <a href="/" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors block mb-1">← Accueil</a>
          <h1 className="text-2xl font-black">{quiz.title}</h1>
          <p className="text-zinc-500 text-sm">{quiz.sport} · Code : <span className="font-mono text-sky-400">{code}</span></p>
        </div>
        <div className="flex items-center gap-6">
          {game.status === 'active' && game.started_at && (
            <Timer startedAt={game.started_at} durationSeconds={300} />
          )}
          {game.status === 'finished' && (
            <span className="text-red-400 font-bold text-xl">Terminé</span>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Table — large */}
        <div className="flex-1 overflow-x-auto">
          <div className="mb-3 flex items-center gap-3">
            <div className="w-48 bg-zinc-800 rounded-full h-3">
              <div className="bg-sky-500 h-3 rounded-full transition-all" style={{ width: `${(foundCount / totalCells) * 100}%` }} />
            </div>
            <span className="text-zinc-400 text-sm">{foundCount}/{totalCells}</span>
          </div>

          <table className="w-full text-base">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-zinc-500 w-10">#</th>
                {quiz.columns.map(col => (
                  <th key={col.key} className="px-4 py-3 text-left text-zinc-300 font-semibold">
                    {col.label}
                    {!col.is_answer && !visibleCols.has(col.key) && <span className="ml-1 text-zinc-700">🔒</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quiz.rows.map((row, i) => (
                <tr key={i} className="border-b border-zinc-800/50">
                  <td className="px-4 py-3 text-zinc-600">{i + 1}</td>
                  {quiz.columns.map(col => {
                    const cellKey = `${i}-${col.key}`
                    const found = foundCells.has(cellKey)
                    const foundBy = answers.find(a => a.row_index === i && a.column_key === col.key)
                    const finder = foundBy ? players.find(p => p.id === foundBy.player_id) : null
                    if (col.is_answer) {
                      return (
                        <td key={col.key} className="px-4 py-3">
                          {found ? (
                            <span className="text-sky-400 font-bold">
                              {row[col.key]}
                              {finder && <span className="text-zinc-500 text-xs ml-2">({finder.name})</span>}
                            </span>
                          ) : (
                            <span className="text-zinc-700">{'█'.repeat(Math.min(row[col.key].length, 12))}</span>
                          )}
                        </td>
                      )
                    }
                    return (
                      <td key={col.key} className="px-4 py-3 text-zinc-300">
                        {visibleCols.has(col.key) ? row[col.key] : <span className="text-zinc-700">—</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scoreboard */}
        <div className="w-56 shrink-0">
          <h2 className="text-zinc-400 text-sm font-medium mb-3 uppercase tracking-wider">Classement</h2>
          <div className="space-y-2">
            {sortedPlayers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 bg-zinc-900 px-4 py-3 rounded-xl">
                <span className={`text-lg font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-300' : i === 2 ? 'text-amber-600' : 'text-zinc-600'}`}>
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-sm truncate">{p.name}</span>
                <span className="text-sky-400 font-bold">{p.score}</span>
              </div>
            ))}
          </div>
          {game.status === 'finished' && game.winner_id && (
            <div className="mt-4 text-center">
              <p className="text-yellow-400 font-black text-lg">🏆 {players.find(p => p.id === game.winner_id)?.name}</p>
              <p className="text-zinc-500 text-xs">a complété le tableau !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
