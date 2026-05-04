/**
 * Seed : Buteurs du Stade Rennais en compétitions européennes (XXIe siècle)
 * Sources : API-Football (saisons 2018-2023)
 * Compétitions : UEFA Europa League, UEFA Champions League, UEFA Europa Conference League
 * Run : npx tsx db/seeds/rennes-europe.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { getClubGoalscorers } from '../utils/api-football'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Stade Rennais = team 94
// Saisons en Europe : 2018 (UEL), 2019 (UEL), 2020 (UCL), 2021 (UECL), 2022 (UEL), 2023 (UEL)
const TEAM_ID = 94
const SEASONS = [2018, 2019, 2020, 2021, 2022, 2023]
const LEAGUE_FILTER = ['Europa League', 'Champions League', 'Conference League']

async function seed() {
  console.log('Fetching Rennes European goalscorers from API-Football…')
  const scorers = await getClubGoalscorers(TEAM_ID, 'Stade Rennais', SEASONS, LEAGUE_FILTER)

  if (scorers.length === 0) {
    console.error('❌ Aucun buteur trouvé — vérifier les paramètres')
    process.exit(1)
  }

  console.log('\n--- Données récupérées ---')
  scorers.forEach((p, i) => console.log(`${i + 1}. ${p.name} — ${p.goals} but(s) [${p.competitions.join(', ')}]`))
  console.log('\n--- Insertion dans Supabase ---')

  const rows = scorers.map(p => ({
    rank: String(scorers.indexOf(p) + 1),
    player: p.name,
    goals: String(p.goals),
    competitions: p.competitions.join(', '),
    seasons: p.seasons.sort().join(', '),
  }))

  const quiz = {
    title: 'Buteurs Rennes en Europe · XXIe siècle',
    description: 'UEL · UCL · UECL — Données API-Football',
    sport: 'football',
    columns: [
      { key: 'rank',         label: '#',           is_answer: false, hint_order: 0 },
      { key: 'player',       label: 'Joueur',      is_answer: true,  hint_order: 1 },
      { key: 'goals',        label: 'Buts',        is_answer: false, hint_order: 2 },
      { key: 'competitions', label: 'Compétitions',is_answer: false, hint_order: 3 },
      { key: 'seasons',      label: 'Saisons',     is_answer: false, hint_order: 4 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
