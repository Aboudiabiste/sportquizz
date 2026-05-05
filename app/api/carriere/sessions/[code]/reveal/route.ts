import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ code: string }> }

export async function POST(_req: Request, { params }: Ctx) {
  const code = (await params).code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const admin = getSupabaseAdmin()

  const { data: session } = await admin
    .from('carriere_sessions')
    .select('id, status, reveal_mode, revealed_count, current_player_id')
    .eq('code', code)
    .single()

  if (!session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  if (session.status !== 'active') return NextResponse.json({ error: 'Session non active' }, { status: 400 })
  if (session.reveal_mode !== 'progressive') return NextResponse.json({ error: 'Pas en mode progressif' }, { status: 400 })

  const { data, error } = await admin
    .from('carriere_sessions')
    .update({ revealed_count: (session.revealed_count ?? 0) + 1 })
    .eq('id', session.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
