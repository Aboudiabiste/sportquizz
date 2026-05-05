'use client'

import type { ClubStint, NationalTeam } from '@/lib/carriere'

// Largeurs déterministes pour les barres placeholder (évite les problèmes d'hydratation)
const WIDTHS = [68, 75, 82, 55, 72, 85, 60, 78, 65, 88, 63, 70, 80, 58, 74, 67, 83, 56]

interface Props {
  career: ClubStint[]
  nationalTeam: NationalTeam | null
  revealMode: 'all' | 'progressive'
  revealedCount: number
  roundFound: boolean
  playerName?: string
}

function isVisible(idx: number, revealMode: string, revealedCount: number, roundFound: boolean) {
  if (roundFound || revealMode === 'all') return true
  return idx < revealedCount
}

export default function CareerTable({ career, nationalTeam, revealMode, revealedCount, roundFound, playerName }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Banner "trouvé" */}
      {roundFound && playerName && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl px-4 py-3 text-center">
          <p className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-0.5">Joueur trouvé</p>
          <p className="text-white font-black text-xl">{playerName}</p>
        </div>
      )}

      {/* Tableau carrière */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="grid grid-cols-[4rem_1fr_2.5rem_2.5rem] bg-zinc-900 border-b border-zinc-800 px-3 py-2">
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Saison</span>
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Club</span>
          <span className="text-sky-500/80 text-xs font-semibold uppercase tracking-wider text-center">M</span>
          <span className="text-amber-500/80 text-xs font-semibold uppercase tracking-wider text-center">B</span>
        </div>

        {/* Lignes */}
        <div className="divide-y divide-zinc-800/60">
          {career.map((stint, idx) => {
            const visible = isVisible(idx, revealMode, revealedCount, roundFound)
            const isLoan = stint.isLoan

            return (
              <div
                key={idx}
                className={`grid grid-cols-[4rem_1fr_2.5rem_2.5rem] items-center px-3 py-2.5 transition-colors ${
                  isLoan ? 'bg-zinc-800/40' : 'bg-zinc-900/60'
                }`}
              >
                {/* Saison */}
                <span className="text-zinc-400 text-xs font-mono leading-tight">
                  {stint.years || '—'}
                </span>

                {/* Club */}
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  {isLoan && (
                    <span className="shrink-0 text-amber-500/70 text-sm leading-none">↳</span>
                  )}
                  {visible ? (
                    <span className={`text-sm font-medium truncate transition-all ${
                      isLoan ? 'text-zinc-300' : 'text-white'
                    }`}>
                      {stint.club}
                    </span>
                  ) : (
                    <div
                      className="h-3.5 bg-zinc-700 rounded-full animate-pulse"
                      style={{ width: `${WIDTHS[idx % WIDTHS.length]}%` }}
                    />
                  )}
                </div>

                {/* Matchs */}
                <span className="text-sky-400 text-xs font-mono text-center">
                  {stint.apps != null ? stint.apps : <span className="text-zinc-700">—</span>}
                </span>

                {/* Buts */}
                <span className="text-amber-400 text-xs font-mono text-center">
                  {stint.goals != null ? stint.goals : <span className="text-zinc-700">—</span>}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Équipe nationale */}
      {nationalTeam && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 flex items-center gap-3">
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider shrink-0">Sélection</span>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 min-w-0">
            {roundFound ? (
              <span className="text-zinc-200 text-sm font-medium">{nationalTeam.club}</span>
            ) : (
              <div className="h-3.5 w-24 bg-zinc-700 rounded-full animate-pulse" />
            )}
            {nationalTeam.years && (
              <span className="text-zinc-500 text-xs self-center">{nationalTeam.years}</span>
            )}
            {nationalTeam.apps != null && (
              <span className="text-sky-400 text-xs self-center">{nationalTeam.apps} sél.</span>
            )}
            {nationalTeam.goals != null && (
              <span className="text-amber-400 text-xs self-center">{nationalTeam.goals} buts</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
