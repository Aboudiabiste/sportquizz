export { supabase } from '@/lib/supabase'

// ── Types ────────────────────────────────────────────────────────────

export interface ClubStint {
  club: string
  years: string
  apps: number | null
  goals: number | null
  isLoan: boolean
}

export interface NationalTeam {
  club: string
  years: string
  apps: number | null
  goals: number | null
}

export interface PlayerCard {
  id: string
  name: string
  nationality: string | null
  position: string | null
  birth_year: number | null
  career: ClubStint[]
  national_team: NationalTeam | null
  created_at: string
}

export type CarriereMode = 'host' | 'chain'
export type CarriereStatus = 'lobby' | 'active' | 'finished'
export type RevealMode = 'all' | 'progressive'

export interface CarriereSession {
  id: string
  code: string
  mode: CarriereMode
  status: CarriereStatus
  current_player_id: string | null
  reveal_mode: RevealMode
  revealed_count: number
  round_found: boolean
  round_found_by: string | null
  rounds_total: number
  rounds_done: number
  used_player_ids: string[]
  last_found_player_name: string | null
  last_found_by_name: string | null
  host_key: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
}

export interface CarrierePlayer {
  id: string
  session_id: string
  name: string
  score: number
  joined_at: string
}

// ── Helpers ──────────────────────────────────────────────────────────

export function normalizeGuess(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[-_']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function matchesPlayerName(input: string, name: string): boolean {
  const norm = normalizeGuess(input)
  const exp = normalizeGuess(name)
  if (norm === exp) return true
  const tokens = exp.split(' ')
  if (tokens.length > 1 && tokens.some(t => t === norm && t.length >= 3)) return true
  return false
}
