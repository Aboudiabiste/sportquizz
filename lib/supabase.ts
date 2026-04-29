import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ──────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard'
export type ScoringMode = 'competitive' | 'individual' | 'speed'
export type GameStatus = 'lobby' | 'active' | 'finished'

export interface QuizColumn {
  key: string
  label: string
  is_answer: boolean   // colonne à deviner (toujours cachée)
  hint_order: number   // ordre de masquage selon difficulté (0 = masqué en premier)
}

export interface Quiz {
  id: string
  title: string
  description: string | null
  sport: string
  columns: QuizColumn[]
  rows: Record<string, string>[]
  created_at: string
}

export interface Game {
  id: string
  quiz_id: string | null
  code: string
  status: GameStatus
  difficulty: Difficulty
  scoring_mode: ScoringMode
  started_at: string | null
  finished_at: string | null
  winner_id: string | null
  created_at: string
}

export interface Player {
  id: string
  game_id: string
  name: string
  score: number
  joined_at: string
}

export interface Answer {
  id: string
  game_id: string
  row_index: number
  column_key: string
  player_id: string
  answered_at: string
}

// ── Helpers ────────────────────────────────────────────────────────

/** Normalise une réponse pour comparaison : sans accent, casse, tirets, espaces multiples */
export function normalizeAnswer(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // supprime les accents
    .replace(/[-_']/g, ' ')           // tirets/apostrophes → espace
    .replace(/\s+/g, ' ')             // espaces multiples → 1
    .trim()
    .toLowerCase()
}

/** Vérifie si une réponse saisie matche une valeur attendue.
 *  Accepte le nom complet, le nom seul ou le prénom seul. */
export function matchesAnswer(input: string, expected: string): boolean {
  const norm = normalizeAnswer(input)
  const exp = normalizeAnswer(expected)

  if (norm === exp) return true

  // Accepte un sous-token (nom de famille ou prénom seul)
  const expTokens = exp.split(' ')
  if (expTokens.length > 1 && expTokens.some(t => t === norm && t.length >= 3)) return true

  return false
}

/** Retourne les colonnes visibles selon la difficulté */
export function getVisibleColumns(columns: QuizColumn[], difficulty: Difficulty): Set<string> {
  const hints = columns.filter(c => !c.is_answer).sort((a, b) => a.hint_order - b.hint_order)
  const visible = new Set<string>()

  switch (difficulty) {
    case 'easy':
      // Tout visible sauf les colonnes is_answer
      hints.forEach(c => visible.add(c.key))
      break
    case 'medium':
      // La moitié des hints visible (les premiers dans hint_order)
      hints.slice(0, Math.ceil(hints.length / 2)).forEach(c => visible.add(c.key))
      break
    case 'hard':
      // Seulement 1 hint visible (le premier)
      if (hints.length > 0) visible.add(hints[0].key)
      break
  }

  return visible
}
