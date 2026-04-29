import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, ctx: RouteContext<'/api/quizzes/[id]'>) {
  const { id } = await ctx.params

  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Quiz introuvable' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, ctx: RouteContext<'/api/quizzes/[id]'>) {
  const { id } = await ctx.params

  const { error } = await supabaseAdmin.from('quizzes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
