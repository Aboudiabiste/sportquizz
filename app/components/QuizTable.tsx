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
  const [flashCorrect, setFlashCorrect] = useState(false)        // flash vert sur l'input
  const [flashedCells, setFlashedCells] = useState<Set<string>>(new Set()) // cellules en animation
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

  const hiddenOnMobile = useMemo(() => {
    const nonAnswerCols = quiz.columns
      .filter(c => !c.is_answer)
      .sort((a, b) => a.hint_order - b.hint_order)
    return new Set(nonAnswerCols.slice(2).map(c => c.key))
  }, [quiz.columns])

  useEffect(() => {
    setPendingFound(prev => {
      const next = new Set([...prev].filter(k => !serverFound.has(k)))
      return next.size === prev.size ? prev : next
    })
  }, [serverFound])

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
    const newFoundCells = new Set([...foundCells, ...matchedKeys])

    setPendingFound(prev => new Set([...prev, ...matchedKeys]))
    matched.forEach(m => onAnswer(m.r, m.colKey))
    setInputValue('')

    // Flash vert sur l'input
    setFlashCorrect(true)
    setTimeout(() => setFlashCorrect(false), 350)

    // Flash pop sur les cellules trouvées
    setFlashedCells(new Set(matchedKeys))
    setTimeout(() => setFlashedCells(new Set()), 600)

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
          className={`w-full rounded-xl px-4 py-3 outline-none text-sm transition-all duration-200 ${
            flashCorrect
              ? 'bg-sky-500/20 ring-2 ring-sky-400 text-sky-300'
              : flashWrong
              ? 'bg-zinc-800 ring-2 ring-red-500 shake'
              : 'bg-zinc-800 focus:ring-2 ring-sky-500'
          }`}
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
                  const isFlashing = flashedCells.has(cellKey)
                  return (
                    <td
                      key={col.key}
                      className={`px-1.5 py-2 leading-snug max-w-[120px] break-words${hiddenOnMobile.has(col.key) ? ' hidden sm:table-cell' : ''} ${style} ${col.is_answer && !foundCells.has(cellKey) ? 'cursor-pointer' : ''} ${isFlashing ? 'cell-pop' : 'transition-all'}`}
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

        @keyframes cellPop {
          0%   { transform: scale(1);    background-color: transparent; }
          30%  { transform: scale(1.15); background-color: rgba(14,165,233,0.25); }
          70%  { transform: scale(1.05); background-color: rgba(14,165,233,0.15); }
          100% { transform: scale(1);    background-color: transparent; }
        }
        .cell-pop { animation: cellPop 0.55s ease; }
      `}</style>
    </div>
  )
}
