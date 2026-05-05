/**
 * Seed : Devine le joueur — Carrière
 *
 * Deux modes de jeu :
 *   • Direct      (easy)   → tous les clubs visibles en même temps
 *   • Progressif  (medium/hard) → clubs dévoilés un par un, du 1er club (obscur) au plus connu
 *
 * Chaque cellule affiche : Nom du club · Années · X matchs Y buts
 * hint_order croissant = 1er club de carrière révélé en premier (le plus difficile)
 *
 * Run : npx tsx db/seeds/carriere-devine.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fetchPlayerCareer, ClubStint } from '../utils/wikipedia-career'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_CLUBS = 10
const EXISTING_ID = '5183c7e8-6ae7-4b35-b04e-5d9aab35fc4a' // supprimé et recréé à chaque run

// Liste des joueurs — wikiTitle = titre exact de la page Wikipedia EN
const PLAYERS = [
  { wikiTitle: 'Zlatan Ibrahimović',              display: 'Zlatan Ibrahimović',  nat: 'Suédois',      pos: 'Attaquant' },
  { wikiTitle: 'Nicolas Anelka',                   display: 'Nicolas Anelka',      nat: 'Français',     pos: 'Attaquant' },
  { wikiTitle: 'Ronaldo (Brazilian footballer)',    display: 'Ronaldo (R9)',         nat: 'Brésilien',    pos: 'Attaquant' },
  { wikiTitle: 'David Beckham',                    display: 'David Beckham',        nat: 'Anglais',      pos: 'Milieu' },
  { wikiTitle: 'Patrick Vieira',                   display: 'Patrick Vieira',       nat: 'Français',     pos: 'Milieu' },
  { wikiTitle: 'Clarence Seedorf',                 display: 'Clarence Seedorf',     nat: 'Néerlandais',  pos: 'Milieu' },
  { wikiTitle: 'Arjen Robben',                     display: 'Arjen Robben',         nat: 'Néerlandais',  pos: 'Ailier' },
  { wikiTitle: 'Xabi Alonso',                      display: 'Xabi Alonso',          nat: 'Espagnol',     pos: 'Milieu' },
  { wikiTitle: 'Thierry Henry',                    display: 'Thierry Henry',        nat: 'Français',     pos: 'Attaquant' },
  { wikiTitle: 'Ronaldinho',                       display: 'Ronaldinho',           nat: 'Brésilien',    pos: 'Attaquant' },
  { wikiTitle: 'Zinedine Zidane',                  display: 'Zinedine Zidane',      nat: 'Français',     pos: 'Milieu' },
  { wikiTitle: "Samuel Eto'o",                     display: "Samuel Eto'o",         nat: 'Camerounais',  pos: 'Attaquant' },
  { wikiTitle: 'Didier Drogba',                    display: 'Didier Drogba',        nat: 'Ivoirien',     pos: 'Attaquant' },
  { wikiTitle: 'Michael Ballack',                  display: 'Michael Ballack',      nat: 'Allemand',     pos: 'Milieu' },
  { wikiTitle: 'Rivaldo',                          display: 'Rivaldo',              nat: 'Brésilien',    pos: 'Attaquant' },
  { wikiTitle: 'Arturo Vidal',                     display: 'Arturo Vidal',         nat: 'Chilien',      pos: 'Milieu' },
  { wikiTitle: 'Lassana Diarra',                   display: 'Lassana Diarra',       nat: 'Français',     pos: 'Milieu' },
  { wikiTitle: 'Emmanuel Petit',                   display: 'Emmanuel Petit',       nat: 'Français',     pos: 'Milieu' },
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
  // On prend la sélection principale (pas les U21/U23)
  const main = teams.find(t => !t.club.toLowerCase().includes('u21') && !t.club.toLowerCase().includes('u23') && !t.club.toLowerCase().includes('youth') && !t.club.toLowerCase().includes('olympic'))
  if (!main) return ''
  let label = main.club
  if (main.years) label += ` · ${main.years}`
  const stats: string[] = []
  if (main.apps  != null) stats.push(`${main.apps} sél.`)
  if (main.goals != null) stats.push(`${main.goals} buts`)
  if (stats.length > 0) label += ` · ${stats.join(', ')}`
  return label
}

async function seed() {
  // Supprime le quiz précédent s'il existe
  await supabase.from('quizzes').delete().eq('id', EXISTING_ID)
  const columns = [
    { key: 'joueur',     label: 'Joueur',       is_answer: true,  hint_order: 0 },
    ...Array.from({ length: MAX_CLUBS }, (_, i) => ({
      key:        `club_${i + 1}`,
      label:      `Club ${i + 1}`,
      is_answer:  false,
      hint_order: i + 1,   // club_1 révélé en premier (hard = plus obscur), club_10 en dernier (easy)
    })),
    { key: 'selection',   label: 'Sélection',   is_answer: false, hint_order: MAX_CLUBS + 1 },
    { key: 'nationalite', label: 'Nationalité',  is_answer: false, hint_order: MAX_CLUBS + 2 },
    { key: 'poste',       label: 'Poste',        is_answer: false, hint_order: MAX_CLUBS + 3 },
  ]

  const rows: Record<string, string>[] = []

  for (const p of PLAYERS) {
    process.stdout.write(`  Fetching ${p.display}... `)
    const career = await fetchPlayerCareer(p.wikiTitle)

    if (!career) { console.log('⚠️  skipped (page not found)'); continue }

    // On exclut les prêts pour garder uniquement les clubs principaux
    const seniorClubs = career.clubs.filter(c => !c.isLoan)

    if (seniorClubs.length === 0) { console.log('⚠️  skipped (no clubs found)'); continue }

    const row: Record<string, string> = {
      joueur:      p.display,
      selection:   formatSelection(career.nationalTeams),
      nationalite: p.nat,
      poste:       p.pos,
    }

    for (let i = 0; i < MAX_CLUBS; i++) {
      row[`club_${i + 1}`] = seniorClubs[i] ? formatStint(seniorClubs[i]) : ''
    }

    rows.push(row)
    console.log(`✓ (${seniorClubs.length} clubs)`)

    await new Promise(r => setTimeout(r, 2500))  // évite le rate-limiting Wikipedia
  }

  if (rows.length === 0) { console.error('❌ Aucun joueur récupéré'); process.exit(1) }

  const quiz = {
    title:       'Devine le joueur — Carrière',
    description: 'Retrouve le joueur grâce aux clubs par lesquels il est passé (du premier au plus célèbre)',
    sport:       'football',
    columns,
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`\n✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
