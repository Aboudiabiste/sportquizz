import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request, ctx: RouteContext<'/api/games/[code]/answers'>) {
  const { code } = await ctx.params
  const safeCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const body = await req.json().catch(() => ({}))

  const player_id = String(body.player_id ?? '').trim()
  const row_index = Number(body.row_index)
  const column_key = String(body.column_key ?? '').trim()
  const total_rows = Number(body.total_rows) || 0

  if (!player_id || isNaN(row_index) || !column_key) {
    return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
  }

  const { data: game } = await supabase
    .from('games')
    .select('id, status, quiz_id, scoring_mode')
    .eq('code', safeCode)
    .single()
  if (!game) return NextResponse.json({ error: 'Partie introuvable' }, { status: 404 })
  if (game.status !== 'active') return NextResponse.json({ error: 'Partie non active' }, { status: 400 })

  const { data: player } = await supabase
    .from('players').select('id').eq('id', player_id).eq('game_id', game.id).single()
  if (!player) return NextResponse.json({ error: 'Joueur non autorisé' }, { status: 403 })

  // Competitive: first to find wins the cell — reject duplicates
  if (game.scoring_mode === 'competitive') {
    const { count } = await supabase
      .from('answers')
      .select('id', { count: 'exact', head: true })
      .eq('game_id', game.id)
      .eq('row_index', row_index)
      .eq('column_key', column_key)
    if ((count ?? 0) > 0) return NextResponse.json({ error: 'Case déjà prise' }, { status: 409 })
  }

  // Points calculation
  // - individual / speed : 1 pt flat
  // - competitive : weighted by row position (later rows = harder = more points)
  //   formula: 1 pt for row 0, scales up to 5 pts for the last row
  let points = 1
  if (game.scoring_mode === 'competitive' && total_rows > 1) {
    points = Math.max(1, Math.round(1 + (row_index / (total_rows - 1)) * 4))
  }

  // INSERT strict : si la case existe déjà pour ce joueur → 409 sans re-scorer
  const { data: answer, error } = await supabaseAdmin
    .from('answers')
    .insert({ game_id: game.id, row_index, column_key, player_id })
    .select()
    .single()

  if (error) {
    // 23505 = unique_violation → case déjà répondue par ce joueur
    if (error.code === '23505') return NextResponse.json({ error: 'Déjà répondu' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabaseAdmin.rpc('increment_player_score', { p_player_id: player_id, p_points: points })

  return NextResponse.json({ ...answer, points }, { status: 201 })
}
