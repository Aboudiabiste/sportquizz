import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

const ALLOWED_PATCH_FIELDS = ['status', 'started_at', 'finished_at', 'winner_id'] as const

export async function GET(_req: Request, ctx: RouteContext<'/api/games/[code]'>) {
  const { code } = await ctx.params
  const safeCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)

  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('code', safeCode)
    .single()

  if (error || !game) return NextResponse.json({ error: 'Partie introuvable' }, { status: 404 })
  return NextResponse.json(game)
}

export async function PATCH(req: Request, ctx: RouteContext<'/api/games/[code]'>) {
  const { code } = await ctx.params
  const safeCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  const body = await req.json().catch(() => ({}))

  // Whitelist fields
  const update: Record<string, unknown> = {}
  for (const field of ALLOWED_PATCH_FIELDS) {
    if (field in body) update[field] = body[field]
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Aucun champ valide' }, { status: 400 })
  }

  const { data: game, error } = await getSupabaseAdmin()
    .from('games')
    .update(update)
    .eq('code', safeCode)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(game)
}
