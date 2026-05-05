import { supabase } from '@/lib/carriere'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < 2) return NextResponse.json([])

  const { data, error } = await supabase
    .from('player_cards')
    .select('id, name, nationality, position, birth_year')
    .ilike('name', `%${q}%`)
    .order('name')
    .limit(10)

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data ?? [])
}
