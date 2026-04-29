import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('quizzes')
    .select('id, title, sport, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body invalide' }, { status: 400 })

  const { title, description, sport, columns, rows } = body

  if (!title?.trim()) return NextResponse.json({ error: 'Titre requis' }, { status: 400 })
  if (!Array.isArray(columns) || columns.length === 0) return NextResponse.json({ error: 'Colonnes requises' }, { status: 400 })
  if (!Array.isArray(rows) || rows.length === 0) return NextResponse.json({ error: 'Lignes requises' }, { status: 400 })
  if (!columns.some((c: { is_answer: boolean }) => c.is_answer)) {
    return NextResponse.json({ error: 'Au moins une colonne "réponse" requise' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .insert({ title: title.trim(), description: description?.trim() ?? null, sport: sport ?? 'football', columns, rows })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
