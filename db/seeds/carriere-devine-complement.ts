/**
 * Ajoute les joueurs manquants au quiz "Devine le joueur — Carrière"
 * Run : npx tsx db/seeds/carriere-devine-complement.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fetchPlayerCareer, ClubStint } from '../utils/wikipedia-career'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const QUIZ_ID   = '256a7bd2-862c-4e79-83d3-095a87785c3c'
const MAX_CLUBS = 10

const PLAYERS = [
  { wikiTitle: 'Rivaldo',        display: 'Rivaldo',        nat: 'Brésilien',  pos: 'Attaquant' },
  { wikiTitle: 'Arturo Vidal',   display: 'Arturo Vidal',   nat: 'Chilien',    pos: 'Milieu' },
  { wikiTitle: 'Lassana Diarra', display: 'Lassana Diarra', nat: 'Français',   pos: 'Milieu' },
  { wikiTitle: 'Emmanuel Petit', display: 'Emmanuel Petit', nat: 'Français',   pos: 'Milieu' },
]

function formatStint(s: ClubStint): string {
  let label = s.club
  if (s.years) label += `\n${s.years}`
  const stats: string[] = []
  if (s.apps  != null) stats.push(`${s.apps} M`)
  if (s.goals != null) stats.push(`${s.goals} B`)
  if (stats.length > 0) label += ` · ${stats.join(' ')}`
  return label
}

function formatSelection(teams: ClubStint[]): string {
  const main = teams.find(t => !/(u21|u23|youth|olympic)/i.test(t.club))
  if (!main) return ''
  let label = main.club
  if (main.years) label += ` · ${main.years}`
  const stats: string[] = []
  if (main.apps  != null) stats.push(`${main.apps} sél.`)
  if (main.goals != null) stats.push(`${main.goals} buts`)
  if (stats.length > 0) label += ` · ${stats.join(', ')}`
  return label
}

async function run() {
  // Récupère les rows existants
  const { data: quiz, error: fetchErr } = await supabase
    .from('quizzes').select('rows').eq('id', QUIZ_ID).single()
  if (fetchErr) { console.error('❌', fetchErr.message); process.exit(1) }

  const existingRows: Record<string, string>[] = (quiz as any).rows ?? []
  const newRows: Record<string, string>[] = []

  for (const p of PLAYERS) {
    process.stdout.write(`  Fetching ${p.display}... `)
    const career = await fetchPlayerCareer(p.wikiTitle)

    if (!career) { console.log('⚠️  skipped'); continue }

    const seniorClubs = career.clubs.filter(c => !c.isLoan)
    if (seniorClubs.length === 0) { console.log('⚠️  no clubs'); continue }

    const row: Record<string, string> = {
      joueur:      p.display,
      selection:   formatSelection(career.nationalTeams),
      nationalite: p.nat,
      poste:       p.pos,
    }
    for (let i = 0; i < MAX_CLUBS; i++) {
      row[`club_${i + 1}`] = seniorClubs[i] ? formatStint(seniorClubs[i]) : ''
    }
    newRows.push(row)
    console.log(`✓ (${seniorClubs.length} clubs)`)

    await new Promise(r => setTimeout(r, 3000))
  }

  if (newRows.length === 0) { console.log('Rien à ajouter.'); return }

  const { error } = await supabase
    .from('quizzes')
    .update({ rows: [...existingRows, ...newRows] })
    .eq('id', QUIZ_ID)

  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`\n✅ ${newRows.length} joueur(s) ajouté(s) — total: ${existingRows.length + newRows.length}`)
}

run()
