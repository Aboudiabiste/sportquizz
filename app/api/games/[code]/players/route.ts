import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, ctx: RouteContext<'/api/games/[code]/players'>) {
  const { code } = await ctx.params
  const safeCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)

  const { data: game } = await supabase.from('games').select('id').eq('code', safeCode).single()
  if (!game) return NextResponse.json({ error: 'Partie introuvable' }, { status: 404 })

  const { data: players, error } = await supabase
    .from('players')
    .select('*')
    .eq('game_id', game.id)
    .order('score', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(players)
}

export async function POST(req: Request, ctx: RouteContext<'/api/games/[code]/players'>) {
  const { code } = await ctx.params
  const safeCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const body = await req.json().catch(() => ({}))

  const name = String(body.name ?? '').trim().slice(0, 20)
  if (!name) return NextResponse.json({ error: 'Pseudo requis' }, { status: 400 })

  const { data: game, error: gameErr } = await supabase
    .from('games')
    .select('id, status')
    .eq('code', safeCode)
    .single()

  if (gameErr || !game) return NextResponse.json({ error: 'Partie introuvable' }, { status: 404 })
  if (game.status === 'finished') return NextResponse.json({ error: 'Partie terminée' }, { status: 400 })

  // Max 5 players
  const { count } = await supabase
    .from('players')
    .select('id', { count: 'exact', head: true })
    .eq('game_id', game.id)
  if ((count ?? 0) >= 5) return NextResponse.json({ error: 'Partie complète (5 joueurs max)' }, { status: 400 })

  const { data: player, error } = await getSupabaseAdmin()
    .from('players')
    .insert({ game_id: game.id, name })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(player, { status: 201 })
}
