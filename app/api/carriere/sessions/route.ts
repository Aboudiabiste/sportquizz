import { supabase } from '@/lib/carriere'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const mode = body.mode === 'chain' ? 'chain' : 'host'
  const reveal_mode = body.reveal_mode === 'all' ? 'all' : 'progressive'
  const rounds_total = mode === 'chain'
    ? Math.min(20, Math.max(1, Number(body.rounds_total) || 5))
    : 1
  const host_key = String(body.host_key ?? '').slice(0, 64) || null

  const { data: code, error: codeErr } = await supabase.rpc('generate_game_code')
  if (codeErr) return NextResponse.json({ error: 'Impossible de générer un code' }, { status: 500 })

  const { data: session, error } = await getSupabaseAdmin()
    .from('carriere_sessions')
    .insert({ code, mode, reveal_mode, rounds_total, host_key })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(session, { status: 201 })
}
