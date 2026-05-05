import { supabase } from '@/lib/carriere'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ code: string }> }

function safeCode(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
}

export async function GET(_req: Request, { params }: Ctx) {
  const code = safeCode((await params).code)

  const { data: session } = await supabase
    .from('carriere_sessions')
    .select('id')
    .eq('code', code)
    .single()

  if (!session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })

  const { data } = await supabase
    .from('carriere_players')
    .select('*')
    .eq('session_id', session.id)
    .order('joined_at')

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request, { params }: Ctx) {
  const code = safeCode((await params).code)
  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim().slice(0, 20)

  if (!name) return NextResponse.json({ error: 'Pseudo requis' }, { status: 400 })

  const { data: session } = await supabase
    .from('carriere_sessions')
    .select('id, status')
    .eq('code', code)
    .single()

  if (!session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  if (session.status === 'finished') return NextResponse.json({ error: 'Partie terminée' }, { status: 400 })

  const { data: player, error } = await getSupabaseAdmin()
    .from('carriere_players')
    .insert({ session_id: session.id, name })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(player, { status: 201 })
}
