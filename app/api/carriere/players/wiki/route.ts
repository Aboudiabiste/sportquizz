import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'
import { fetchPlayerCareer } from '@/db/utils/wikipedia-career'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const wikiTitle = String(body.wikiTitle ?? '').trim()
  const nationality = String(body.nationality ?? '').trim() || null
  const position = String(body.position ?? '').trim() || null

  if (!wikiTitle) return NextResponse.json({ error: 'wikiTitle requis' }, { status: 400 })

  const admin = getSupabaseAdmin()

  // Déjà en base ?
  const { data: existing } = await admin
    .from('player_cards')
    .select('*')
    .ilike('name', wikiTitle)
    .maybeSingle()

  if (existing) return NextResponse.json(existing)

  // Fetch Wikipedia
  const career = await fetchPlayerCareer(wikiTitle)
  if (!career) {
    return NextResponse.json(
      { error: 'Joueur introuvable sur Wikipedia. Vérifie le titre exact de la page anglaise.' },
      { status: 404 },
    )
  }

  const mainTeam = career.nationalTeams.find(
    t =>
      !t.club.toLowerCase().includes('u21') &&
      !t.club.toLowerCase().includes('u23') &&
      !t.club.toLowerCase().includes('youth') &&
      !t.club.toLowerCase().includes('olympic'),
  ) ?? null

  const { data: card, error } = await admin
    .from('player_cards')
    .insert({
      name: wikiTitle,
      nationality,
      position,
      career: career.clubs,
      national_team: mainTeam
        ? { club: mainTeam.club, years: mainTeam.years, apps: mainTeam.apps, goals: mainTeam.goals }
        : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(card, { status: 201 })
}
