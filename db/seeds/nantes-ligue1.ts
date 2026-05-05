/**
 * Seed : Top buteurs du FC Nantes en Ligue 1 (2018–2023)
 * Sources : API-Football
 * Run : npx tsx db/seeds/nantes-ligue1.ts
 *
 * Team ID API-Football : 83 (FC Nantes)
 * Saisons : 2018 à 2023 (Ligue 1)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { getClubGoalscorers } from '../utils/api-football'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEAM_ID = 83
const SEASONS = [2018, 2019, 2020, 2021, 2022, 2023]
const LEAGUE_FILTER = ['Ligue 1']

async function seed() {
  console.log('Fetching FC Nantes Ligue 1 goalscorers from API-Football…')
  const scorers = await getClubGoalscorers(TEAM_ID, 'FC Nantes', SEASONS, LEAGUE_FILTER)

  if (scorers.length === 0) {
    console.error('❌ Aucun buteur trouvé — vérifier le team ID (83) et les saisons')
    process.exit(1)
  }

  // Garder les joueurs avec au moins 3 buts sur la période
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
    title: 'Top buteurs FC Nantes en Ligue 1 (2018–2024)',
    description: 'Les meilleurs buteurs nantais en Ligue 1 sur 6 saisons — Données API-Football',
    sport: 'football',
    columns: [
      { key: 'rank',    label: '#',        is_answer: false, hint_order: 0 },
      { key: 'player',  label: 'Joueur',   is_answer: true,  hint_order: 1 },
      { key: 'goals',   label: 'Buts',     is_answer: false, hint_order: 2 },
      { key: 'seasons', label: 'Saisons',  is_answer: false, hint_order: 3 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
