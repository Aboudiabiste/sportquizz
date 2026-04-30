import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import type { Difficulty, ScoringMode } from '@/lib/supabase'

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']
const VALID_MODES: ScoringMode[] = ['individual', 'competitive', 'speed']

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const difficulty: Difficulty = VALID_DIFFICULTIES.includes(body.difficulty) ? body.difficulty : 'medium'
  const scoring_mode: ScoringMode = VALID_MODES.includes(body.scoring_mode) ? body.scoring_mode : 'individual'
  const quiz_id: string | null = body.quiz_id ?? null

  const { data: code, error: codeErr } = await supabase.rpc('generate_game_code')
  if (codeErr) return NextResponse.json({ error: 'Impossible de générer un code' }, { status: 500 })

  const { data: game, error } = await getSupabaseAdmin()
    .from('games')
    .insert({ code, difficulty, scoring_mode, status: 'lobby', quiz_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(game, { status: 201 })
}
