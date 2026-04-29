/**
 * Seed : Finales de l'Euro UEFA (1996–2024)
 * Run : npx tsx db/seeds/euro-finals.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1996', winner: 'Allemagne',      runner_up: 'République Tchèque', score: '2-1 (AP)', venue: 'Wembley, Londres',      top_scorer: 'Alan Shearer (5 buts)',        final_scorer: 'Bierhoff (2)' },
  { year: '2000', winner: 'France',         runner_up: 'Italie',             score: '2-1 (AP)', venue: 'Rotterdam',             top_scorer: 'Savo Milošević / Patrick Kluivert (5)', final_scorer: 'Wiltord, Trezeguet' },
  { year: '2004', winner: 'Grèce',          runner_up: 'Portugal',           score: '1-0',      venue: 'Lisbonne',              top_scorer: 'Milan Baroš (5)',              final_scorer: 'Charisteas' },
  { year: '2008', winner: 'Espagne',        runner_up: 'Allemagne',          score: '1-0',      venue: 'Vienne',                top_scorer: 'David Villa (4)',              final_scorer: 'Torres' },
  { year: '2012', winner: 'Espagne',        runner_up: 'Italie',             score: '4-0',      venue: 'Kiev',                  top_scorer: 'Fernando Torres (3)',          final_scorer: 'Silva, Alba, Torres, Mata' },
  { year: '2016', winner: 'Portugal',       runner_up: 'France',             score: '1-0 (AP)', venue: 'Saint-Denis',           top_scorer: 'Antoine Griezmann (6)',        final_scorer: 'Eder' },
  { year: '2020', winner: 'Italie',         runner_up: 'Angleterre',         score: '1-1 (4-3 tab)', venue: 'Wembley, Londres', top_scorer: 'Cristiano Ronaldo / Patrik Schick (5)', final_scorer: 'Bonucci' },
  { year: '2024', winner: 'Espagne',        runner_up: 'Angleterre',         score: '2-1',      venue: 'Berlin',                top_scorer: 'Cody Gakpo / Dani Olmo (3)',   final_scorer: 'Nico Williams, Oyarzabal' },
]

async function seed() {
  const quiz = {
    title: 'Finales de l\'Euro UEFA (1996–2024)',
    description: 'Vainqueurs, scores et buteurs de chaque finale depuis 1996',
    sport: 'football',
    columns: [
      { key: 'year',         label: 'Année',         is_answer: false, hint_order: 0 },
      { key: 'winner',       label: 'Vainqueur',     is_answer: true,  hint_order: 1 },
      { key: 'runner_up',    label: 'Finaliste',     is_answer: false, hint_order: 2 },
      { key: 'score',        label: 'Score',         is_answer: false, hint_order: 3 },
      { key: 'final_scorer', label: 'Buteur(s)',     is_answer: false, hint_order: 4 },
      { key: 'top_scorer',   label: 'Meilleur buteur tournoi', is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}

seed()
