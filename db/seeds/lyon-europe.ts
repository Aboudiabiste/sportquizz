/**
 * Seed : Top buteurs de l'Olympique Lyonnais en Ligue 1 (2022–2024)
 * Sources : API-Football (plan gratuit : saisons 2022-2024 uniquement)
 * Run : npx tsx db/seeds/lyon-europe.ts
 *
 * Team ID API-Football : 80 (Olympique Lyonnais)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { getClubGoalscorers } from '../utils/api-football'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEAM_ID = 80
const SEASONS = [2022, 2023, 2024]
const LEAGUE_FILTER = ['Ligue 1']

async function seed() {
  console.log('Fetching OL Ligue 1 goalscorers from API-Football…')
  const scorers = await getClubGoalscorers(TEAM_ID, 'Olympique Lyonnais', SEASONS, LEAGUE_FILTER)

  if (scorers.length === 0) {
    console.error('❌ Aucun buteur trouvé — vérifier le team ID (80) et les saisons')
    process.exit(1)
  }

  const filtered = scorers.filter(p => p.goals >= 3)

  console.log('\n--- Données récupérées ---')
  filtered.forEach((p, i) => console.log(`${i + 1}. ${p.name} — ${p.goals} but(s)`))
  console.log('\n--- Insertion dans Supabase ---')

  const rows = filtered.map((p, i) => ({
    rank:    String(i + 1),
    player:  p.name,
    goals:   String(p.goals),
    seasons: p.seasons.sort().join(', '),
  }))

  const quiz = {
    title: 'Top buteurs OL en Ligue 1 (2022–2024)',
    description: 'Les meilleurs buteurs lyonnais en Ligue 1 sur 3 saisons — Données API-Football',
    sport: 'football',
    columns: [
      { key: 'rank',    label: '#',       is_answer: false, hint_order: 0 },
      { key: 'player',  label: 'Joueur',  is_answer: true,  hint_order: 1 },
      { key: 'goals',   label: 'Buts',    is_answer: false, hint_order: 2 },
      { key: 'seasons', label: 'Saisons', is_answer: false, hint_order: 3 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
