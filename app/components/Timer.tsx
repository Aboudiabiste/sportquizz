'use client'

import { useEffect, useState } from 'react'

interface Props {
  startedAt: string
  durationSeconds: number
  onExpire?: () => void
}

export default function Timer({ startedAt, durationSeconds, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds)

  useEffect(() => {
    const elapsed = (Date.now() - new Date(startedAt).getTime()) / 1000
    const initial = Math.max(0, durationSeconds - elapsed)
    setTimeLeft(Math.ceil(initial))

    if (initial <= 0) { onExpire?.(); return }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); onExpire?.(); return 0 }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [startedAt, durationSeconds, onExpire])

  const pct = (timeLeft / durationSeconds) * 100
  const urgent = timeLeft <= 30

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = minutes > 0
    ? `${minutes}:${String(seconds).padStart(2, '0')}`
    : `${seconds}s`

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`font-mono text-3xl font-black tabular-nums ${urgent ? 'text-red-400' : 'text-sky-400'}`}>
        {display}
      </span>
      <div className="w-32 bg-zinc-800 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${urgent ? 'bg-red-500' : 'bg-sky-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
