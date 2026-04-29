'use client'

import { useState, useRef, useEffect } from 'react'
import { type Quiz, type QuizColumn, type Difficulty, type Answer, matchesAnswer, getVisibleColumns } from '@/lib/supabase'

interface Props {
  quiz: Quiz
  difficulty: Difficulty
  answers: Answer[]           // cases déjà trouvées (toutes sources)
  currentPlayerId: string
  onAnswer: (rowIndex: number, columnKey: string) => void
  disabled?: boolean
}

export default function QuizTable({ quiz, difficulty, answers, currentPlayerId, onAnswer, disabled }: Props) {
  const [inputValue, setInputValue] = useState('')
  const [activeCell, setActiveCell] = useState<{ row: number; col: string } | null>(null)
  const [flashCorrect, setFlashCorrect] = useState<string | null>(null) // "rowIndex-colKey"
  const [flashWrong, setFlashWrong] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const visibleCols = getVisibleColumns(quiz.columns, difficulty)
  const answerCols = quiz.columns.filter(c => c.is_answer)

  // Set of found cells: "rowIndex-colKey"
  const foundCells = new Set(answers.map(a => `${a.row_index}-${a.column_key}`))
  const myFoundCells = new Set(
    answers.filter(a => a.player_id === currentPlayerId).map(a => `${a.row_index}-${a.column_key}`)
  )

  function selectCell(row: number, col: string) {
    if (disabled || foundCells.has(`${row}-${col}`)) return
    setActiveCell({ row, col })
    setInputValue('')
    setFlashWrong(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function handleSubmit() {
    if (!activeCell || !inputValue.trim()) return

    // Scan all unfound answer cells for a match (not just the active one)
    for (let r = 0; r < quiz.rows.length; r++) {
      for (const col of answerCols) {
        const cellKey = `${r}-${col.key}`
        if (foundCells.has(cellKey)) continue
        if (matchesAnswer(inputValue, quiz.rows[r][col.key])) {
          setFlashCorrect(cellKey)
          setTimeout(() => setFlashCorrect(null), 800)
          onAnswer(r, col.key)
          setInputValue('')
          moveToNextEmpty(r, col.key)
          return
        }
      }
    }

    setFlashWrong(true)
    setTimeout(() => setFlashWrong(false), 500)
  }

  function moveToNextEmpty(currentRow: number, currentCol: string) {
    for (let r = currentRow; r < quiz.rows.length; r++) {
      for (const col of answerCols) {
        const key = `${r}-${col.key}`
        if ((r === currentRow && col.key === currentCol) || foundCells.has(key)) continue
        setActiveCell({ row: r, col: col.key })
        return
      }
    }
    // Wrap from start
    for (let r = 0; r <= currentRow; r++) {
      for (const col of answerCols) {
        const key = `${r}-${col.key}`
        if (foundCells.has(key)) continue
        setActiveCell({ row: r, col: col.key })
        return
      }
    }
    setActiveCell(null)
  }

  function getCellDisplay(rowIndex: number, col: QuizColumn, rowData: Record<string, string>) {
    const cellKey = `${rowIndex}-${col.key}`
    const isFound = foundCells.has(cellKey)
    const isMyFind = myFoundCells.has(cellKey)
    const isActive = activeCell?.row === rowIndex && activeCell?.col === col.key
    const isFlashCorrect = flashCorrect === cellKey

    if (col.is_answer) {
      if (isFound) {
        return { text: rowData[col.key], style: isMyFind ? 'text-sky-400 font-bold' : 'text-blue-400 font-bold' }
      }
      if (isActive) {
        return { text: null, style: 'bg-zinc-700 ring-2 ring-sky-400' }
      }
      if (isFlashCorrect) {
        return { text: rowData[col.key], style: 'text-sky-400 font-bold animate-pulse' }
      }
      return { text: '???', style: 'text-zinc-600 cursor-pointer hover:text-zinc-400 hover:bg-zinc-800' }
    }

    // Hint column
    if (!visibleCols.has(col.key)) {
      return { text: '—', style: 'text-zinc-700' }
    }
    return { text: rowData[col.key], style: 'text-zinc-300' }
  }

  const totalAnswerCells = quiz.rows.length * answerCols.length
  const foundCount = answers.filter(a => answerCols.some(c => c.key === a.column_key)).length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{foundCount}/{totalAnswerCells} trouvés</span>
        <div className="w-48 bg-zinc-800 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all"
            style={{ width: `${(foundCount / totalAnswerCells) * 100}%` }}
          />
        </div>
      </div>

      {/* Input */}
      {activeCell && !disabled && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            className={`flex-1 bg-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500 text-sm transition-all ${flashWrong ? 'ring-2 ring-red-500 shake' : ''}`}
            placeholder={`${quiz.columns.find(c => c.key === activeCell.col)?.label}…`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="bg-sky-500 hover:bg-sky-400 text-black font-bold px-4 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b border-zinc-800">
              <th className="px-3 py-2 text-left text-zinc-500 font-medium w-8">#</th>
              {quiz.columns.map(col => (
                <th key={col.key} className="px-3 py-2 text-left text-zinc-400 font-medium whitespace-nowrap">
                  {col.label}
                  {!col.is_answer && !visibleCols.has(col.key) && (
                    <span className="ml-1 text-zinc-700 text-xs">🔒</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quiz.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                <td className="px-3 py-2 text-zinc-600">{rowIndex + 1}</td>
                {quiz.columns.map(col => {
                  const { text, style } = getCellDisplay(rowIndex, col, row)
                  const isActive = activeCell?.row === rowIndex && activeCell?.col === col.key
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 transition-all ${style} ${col.is_answer && !foundCells.has(`${rowIndex}-${col.key}`) ? 'cursor-pointer' : ''}`}
                      onClick={() => col.is_answer && selectCell(rowIndex, col.key)}
                    >
                      {isActive ? (
                        <span className="text-sky-400 text-xs">← saisie en cours</span>
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
