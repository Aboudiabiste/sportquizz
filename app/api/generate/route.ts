import { NextResponse } from 'next/server'
import { generateQuiz, TEMPLATES } from '@/lib/quiz/generator'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  return NextResponse.json(TEMPLATES)
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.template_id) return NextResponse.json({ error: 'template_id requis' }, { status: 400 })

  try {
    const quiz = await generateQuiz(body.template_id, body.params ?? {})

    // If save=true, persist to DB
    if (body.save) {
      const { data, error } = await getSupabaseAdmin()
        .from('quizzes')
        .insert(quiz)
        .select()
        .single()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ quiz: data, saved: true }, { status: 201 })
    }

    return NextResponse.json({ quiz, saved: false })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Erreur génération' }, { status: 500 })
  }
}
