import { supabase } from '@/lib/carriere'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ code: string }> }

function safeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
}

export async function GET(_req: Request, { params }: Ctx) {
  const code = safeCode((await params).code)

  const { data, error } = await supabase
    .from('carriere_sessions')
    .select('*')
    .eq('code', code)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  return NextResponse.json(data)
}

// Champs autorisés à patcher depuis le client (subset safe)
const PATCHABLE = new Set([
  'status', 'started_at', 'finished_at',
  'current_player_id', 'reveal_mode', 'revealed_count',
  'round_found', 'round_found_by',
  'rounds_total', 'rounds_done', 'used_player_ids',
  'last_found_player_name', 'last_found_by_name',
])

export async function PATCH(req: Request, { params }: Ctx) {
  const code = safeCode((await params).code)
  const body = await req.json().catch(() => ({}))

  const patch: Record<string, unknown> = {}
  for (const key of Object.keys(body)) {
    if (PATCHABLE.has(key)) patch[key] = body[key]
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Aucun champ modifiable' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('carriere_sessions')
    .update(patch)
    .eq('code', code)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
