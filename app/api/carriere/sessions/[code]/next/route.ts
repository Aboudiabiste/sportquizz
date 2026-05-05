import { supabase } from '@/lib/carriere'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ code: string }> }

export async function POST(req: Request, { params }: Ctx) {
  const code = (await params).code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const body = await req.json().catch(() => ({}))
  const player_card_id: string | null = body.player_card_id ?? null // null = random

  const admin = getSupabaseAdmin()

  const { data: session } = await admin
    .from('carriere_sessions')
    .select('id, status, mode, used_player_ids, rounds_done, rounds_total, current_player_id')
    .eq('code', code)
    .single()

  if (!session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  if (session.status === 'finished') return NextResponse.json({ error: 'Partie terminée' }, { status: 400 })

  let nextId = player_card_id

  if (!nextId) {
    const { data: allCards } = await admin.from('player_cards').select('id')
    const used: string[] = session.used_player_ids ?? []
    const prev = session.current_player_id
    const available = (allCards ?? [])
      .map((c: { id: string }) => c.id)
      .filter((id: string) => !used.includes(id) && id !== prev)

    if (available.length === 0) {
      return NextResponse.json({ error: 'Plus de joueurs disponibles' }, { status: 400 })
    }
    nextId = available[Math.floor(Math.random() * available.length)]
  }

  // Vérifie que la carte existe
  const { data: card } = await supabase
    .from('player_cards')
    .select('id, name')
    .eq('id', nextId)
    .single()

  if (!card) return NextResponse.json({ error: 'Joueur introuvable' }, { status: 404 })

  const usedIds: string[] = [
    ...(session.used_player_ids ?? []),
    ...(session.current_player_id ? [session.current_player_id] : []),
  ]

  const patch: Record<string, unknown> = {
    current_player_id: nextId,
    revealed_count: 0,
    round_found: false,
    round_found_by: null,
    status: 'active',
    used_player_ids: usedIds,
  }
  if (session.status === 'lobby') patch.started_at = new Date().toISOString()

  const { data: updated, error } = await admin
    .from('carriere_sessions')
    .update(patch)
    .eq('id', session.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(updated)
}
