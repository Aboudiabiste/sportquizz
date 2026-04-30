'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { type Quiz, type QuizColumn, type Difficulty, type Answer, matchesAnswer, getVisibleColumns } from '@/lib/supabase'

interface Props {
  quiz: Quiz
  difficulty: Difficulty
  answers: Answer[]
  currentPlayerId: string
  onAnswer: (rowIndex: number, columnKey: string) => void
  disabled?: boolean
}

export default function QuizTable({ quiz, difficulty, answers, currentPlayerId, onAnswer, disabled }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null)
  const [flashWrong, setFlashWrong] = useState(false)
  const [pendingFound, setPendingFound] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleCols = getVisibleColumns(quiz.columns, difficulty)
  const answerCols = quiz.columns.filter(c => c.is_answer)

  const serverFound = useMemo(
    () => new Set(answers.map(a => `${a.row_index}-${a.column_key}`)),
    [answers]
  )

  const foundCells = useMemo(
    () => new Set([...serverFound, ...pendingFound]),
    [serverFound, pendingFound]
  )

  const myFoundKeys = useMemo(
    () => new Set([
      ...answers.filter(a => a.player_id === currentPlayerId).map(a => `${a.row_index}-${a.column_key}`),
      ...pendingFound,
    ]),
    [answers, currentPlayerId, pendingFound]
  )

  const totalAnswerCells = quiz.rows.length * answerCols.length
  const foundCount = foundCells.size
  const allFound = foundCount >= totalAnswerCells

  // Colonne à masquer sur mobile : colonnes hint avec hint_order >= 3 (anecdotes, détails secondaires)
  // On garde : numéro, réponse, et les 2 premiers indices (hint_order 0 et 1 si non-réponse)
  const hiddenOnMobile = useMemo(() => {
    const nonAnswerCols = quiz.columns
      .filter(c => !c.is_answer)
      .sort((a, b) => a.hint_order - b.hint_order)
    // Garde les 2 premiers, masque le reste sur mobile
    const toHide = new Set(nonAnswerCols.slice(2).map(c => c.key))
    return toHide
  }, [quiz.columns])

  // Nettoie les optimistic confirmés par le serveur
  useEffect(() => {
    setPendingFound(prev => {
      const next = new Set([...prev].filter(k => !serverFound.has(k)))
      return next.size === prev.size ? prev : next
    })
  }, [serverFound])

  // Auto-focus sur la première cellule vide au montage
  useEffect(() => {
    if (disabled || allFound) return
    for (let r = 0; r < quiz.rows.length; r++) {
      for (const col of answerCols) {
        if (!foundCells.has(`${r}-${col.key}`)) {
          setActiveCell({ row: r, col: col.key })
          setTimeout(() => inputRef.current?.focus(), 80)
          return
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function selectCell(row: number, col: string) {
    if (disabled || foundCells.has(`${row}-${col}`)) return
    setActiveCell({ row, col })
    setInputValue('')
    setFlashWrong(false)
    setTimeout(() => inputRef.current?.focus(), 30)
  }

  // Valide TOUTES les cellules qui correspondent à la réponse saisie (pas seulement la première)
  function checkMatch(value: string) {
    if (!value.trim()) return false

    const matched: Array<{ r: number; colKey: string }> = []
    for (let r = 0; r < quiz.rows.length; r++) {
      for (const col of answerCols) {
        const cellKey = `${r}-${col.key}`
        if (foundCells.has(cellKey)) continue
        if (matchesAnswer(value, quiz.rows[r][col.key])) {
          matched.push({ r, colKey: col.key })
        }
      }
    }

    if (matched.length === 0) return false

    const matchedKeys = matched.map(m => `${m.r}-${m.colKey}`)
    // Calcule le nouvel état found AVANT la mise à jour React (pour moveToNextEmpty)
    const newFoundCells = new Set([...foundCells, ...matchedKeys])

    setPendingFound(prev => new Set([...prev, ...matchedKeys]))
    matched.forEach(m => onAnswer(m.r, m.colKey))
    setInputValue('')

    // Avance vers la prochaine cellule vide en tenant compte des cellules qui viennent d'être validées
    const last = matched[matched.length - 1]
    moveToNextEmpty(last.r, last.colKey, newFoundCells)

    return true
  }

  function handleSubmit() {
    if (!inputValue.trim()) return
    const matched = checkMatch(inputValue)
    if (!matched) {
      setFlashWrong(true)
      setTimeout(() => setFlashWrong(false), 500)
    }
  }

  function moveToNextEmpty(currentRow: number, currentCol: string, currentFoundCells: Set<string> = foundCells) {
    for (let r = currentRow; r < quiz.rows.length; r++) {
      for (const col of answerCols) {
        const key = `${r}-${col.key}`
        if ((r === currentRow && col.key === currentCol) || currentFoundCells.has(key)) continue
        setActiveCell({ row: r, col: col.key })
        return
      }
    }
    for (let r = 0; r < currentRow; r++) {
      for (const col of answerCols) {
        const key = `${r}-${col.key}`
        if (currentFoundCells.has(key)) continue
        setActiveCell({ row: r, col: col.key })
        return
      }
    }
    setActiveCell(null)
  }

  function getCellDisplay(rowIndex: number, col: QuizColumn, rowData: Record<string, string>) {
    const cellKey = `${rowIndex}-${col.key}`
    const isFound = foundCells.has(cellKey)
    const isMyFind = myFoundKeys.has(cellKey)
    const isActive = activeCell?.row === rowIndex && activeCell?.col === col.key

    if (col.is_answer) {
      if (isFound) {
        return { text: rowData[col.key], style: isMyFind ? 'text-sky-400 font-bold' : 'text-blue-400 font-bold' }
      }
      if (isActive) {
        return { text: '←', style: 'bg-zinc-700 ring-2 ring-sky-400 text-sky-400' }
      }
      return { text: '?', style: 'text-zinc-600 cursor-pointer hover:text-zinc-400 hover:bg-zinc-800' }
    }

    if (!visibleCols.has(col.key)) {
      return { text: '—', style: 'text-zinc-700' }
    }
    return { text: rowData[col.key], style: 'text-zinc-300' }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Progress */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400">{foundCount}/{totalAnswerCells} trouvés</span>
        <div className="w-32 bg-zinc-800 rounded-full h-1.5">
          <div
            className="bg-sky-500 h-1.5 rounded-full transition-all"
            style={{ width: `${totalAnswerCells > 0 ? (foundCount / totalAnswerCells) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Input */}
      {!disabled && !allFound && (
        <input
          ref={inputRef}
          autoFocus
          className={`w-full bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500 text-sm transition-all ${flashWrong ? 'ring-2 ring-red-500 shake' : ''}`}
          placeholder="Tape ta réponse…"
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); checkMatch(e.target.value) }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      )}

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-x-auto">
        <table className="w-full text-xs border-collapse" style={{ minWidth: 0 }}>
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="px-1.5 py-2 text-left text-zinc-500 font-medium w-5 shrink-0">#</th>
              {quiz.columns.map(col => (
                <th
                  key={col.key}
                  className={`px-1.5 py-2 text-left text-zinc-400 font-medium whitespace-nowrap${hiddenOnMobile.has(col.key) ? ' hidden sm:table-cell' : ''}`}
                >
                  {col.label}
                  {!col.is_answer && !visibleCols.has(col.key) && (
                    <span className="ml-1 text-zinc-700">🔒</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quiz.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                <td className="px-1.5 py-2 text-zinc-600 w-5">{rowIndex + 1}</td>
                {quiz.columns.map(col => {
                  const { text, style } = getCellDisplay(rowIndex, col, row)
                  const cellKey = `${rowIndex}-${col.key}`
                  const isActive = activeCell?.row === rowIndex && activeCell?.col === col.key
                  return (
                    <td
                      key={col.key}
                      className={`px-1.5 py-2 transition-all leading-snug max-w-[120px] break-words${hiddenOnMobile.has(col.key) ? ' hidden sm:table-cell' : ''} ${style} ${col.is_answer && !foundCells.has(cellKey) ? 'cursor-pointer' : ''}`}
                      onClick={() => col.is_answer && selectCell(rowIndex, col.key)}
                    >
                      {isActive && !foundCells.has(cellKey) ? (
                        <span className="text-sky-400">←</span>
                      ) : (
                        text
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .shake { animation: shake 0.3s ease; }
      `}</style>
    </div>
  )
}
