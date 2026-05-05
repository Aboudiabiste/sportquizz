import { supabase } from '@/lib/carriere'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { matchesPlayerName } from '@/lib/carriere'
import { NextResponse } from 'next/server'

type Ctx = { params: Promise<{ code: string }> }

export async function POST(req: Request, { params }: Ctx) {
  const code = (await params).code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const body = await req.json().catch(() => ({}))
  const player_id = String(body.player_id ?? '').trim()
  const guess = String(body.guess ?? '').trim()

  if (!player_id || !guess) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const admin = getSupabaseAdmin()

  const { data: session } = await admin
    .from('carriere_sessions')
    .select('*')
    .eq('code', code)
    .single()

  if (!session) return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
  if (session.status !== 'active') return NextResponse.json({ error: 'Session non active' }, { status: 400 })
  if (!session.current_player_id) return NextResponse.json({ error: 'Aucun joueur en cours' }, { status: 400 })
  if (session.round_found) return NextResponse.json({ correct: false, alreadyFound: true })

  // Vérifie que le joueur appartient à la session
  const { data: player } = await admin
    .from('carriere_players')
    .select('id, name, score')
    .eq('id', player_id)
    .eq('session_id', session.id)
    .single()

  if (!player) return NextResponse.json({ error: 'Joueur non autorisé' }, { status: 403 })

  // Récupère le nom du joueur à deviner
  const { data: card } = await supabase
    .from('player_cards')
    .select('name')
    .eq('id', session.current_player_id)
    .single()

  if (!card) return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })

  if (!matchesPlayerName(guess, card.name)) {
    return NextResponse.json({ correct: false })
  }

  // Bonne réponse : incrémente le score
  await admin
    .from('carriere_players')
    .update({ score: player.score + 1 })
    .eq('id', player_id)

  if (session.mode === 'chain') {
    // Avance automatiquement à la manche suivante
    const usedIds: string[] = [...(session.used_player_ids ?? []), session.current_player_id]
    const rounds_done = (session.rounds_done ?? 0) + 1
    const isLast = rounds_done >= session.rounds_total

    let nextPlayerId: string | null = null
    if (!isLast) {
      const { data: allCards } = await admin.from('player_cards').select('id')
      const available = (allCards ?? [])
        .map((c: { id: string }) => c.id)
        .filter((id: string) => !usedIds.includes(id))
      if (available.length > 0) {
        nextPlayerId = available[Math.floor(Math.random() * available.length)]
      }
    }

    await admin.from('carriere_sessions').update({
      round_found: !nextPlayerId && !isLast ? false : true,
      round_found_by: player.name,
      last_found_player_name: card.name,
      last_found_by_name: player.name,
      rounds_done,
      used_player_ids: usedIds,
      current_player_id: nextPlayerId,
      revealed_count: 0,
      status: isLast || !nextPlayerId ? 'finished' : 'active',
      finished_at: isLast || !nextPlayerId ? new Date().toISOString() : null,
    }).eq('id', session.id)
  } else {
    // Mode host : marque juste le round comme trouvé
    await admin.from('carriere_sessions').update({
      round_found: true,
      round_found_by: player.name,
      last_found_player_name: card.name,
      last_found_by_name: player.name,
    }).eq('id', session.id)
  }

  return NextResponse.json({ correct: true, player_name: card.name })
}
