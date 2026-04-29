/**
 * Seed : Top buteurs de l'Équipe de France (compétitions officielles + amicaux, depuis 1996)
 * Run : npx tsx db/seeds/edf-buteurs.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Buteurs EDF all-time (sélections + buts au moment de la rédaction, 2024)
const rows = [
  { name: 'Olivier Giroud',    nationality: 'Français', goals_total: '57', goals_comp: '37', goals_friendly: '20', caps: '132', period: '2011–2024' },
  { name: 'Thierry Henry',     nationality: 'Français', goals_total: '51', goals_comp: '32', goals_friendly: '19', caps: '123', period: '1997–2010' },
  { name: 'Antoine Griezmann', nationality: 'Français', goals_total: '44', goals_comp: '28', goals_friendly: '16', caps: '137', period: '2014–2024' },
  { name: 'Michel Platini',    nationality: 'Français', goals_total: '41', goals_comp: '28', goals_friendly: '13', caps: '72',  period: '1976–1987' },
  { name: 'David Trezeguet',   nationality: 'Français', goals_total: '34', goals_comp: '22', goals_friendly: '12', caps: '71',  period: '1998–2008' },
  { name: 'Zinédine Zidane',   nationality: 'Français', goals_total: '31', goals_comp: '20', goals_friendly: '11', caps: '108', period: '1994–2006' },
  { name: 'Just Fontaine',     nationality: 'Français', goals_total: '30', goals_comp: '27', goals_friendly: '3',  caps: '21',  period: '1953–1960' },
  { name: 'Sylvain Wiltord',   nationality: 'Français', goals_total: '26', goals_comp: '14', goals_friendly: '12', caps: '92',  period: '1999–2008' },
  { name: 'Jean-Pierre Papin', nationality: 'Français', goals_total: '30', goals_comp: '19', goals_friendly: '11', caps: '54',  period: '1986–1995' },
  { name: 'Youri Djorkaeff',   nationality: 'Français', goals_total: '28', goals_comp: '18', goals_friendly: '10', caps: '82',  period: '1993–2002' },
  { name: 'Karim Benzema',     nationality: 'Français', goals_total: '37', goals_comp: '23', goals_friendly: '14', caps: '97',  period: '2007–2021' },
  { name: 'Nicolas Anelka',    nationality: 'Français', goals_total: '14', goals_comp: '8',  goals_friendly: '6',  caps: '69',  period: '1998–2010' },
  { name: 'Kylian Mbappé',     nationality: 'Français', goals_total: '48', goals_comp: '34', goals_friendly: '14', caps: '96',  period: '2017–2024' },
  { name: 'Robert Pirès',      nationality: 'Français', goals_total: '14', goals_comp: '8',  goals_friendly: '6',  caps: '79',  period: '1996–2004' },
  { name: 'Frank Leboeuf',     nationality: 'Français', goals_total: '6',  goals_comp: '3',  goals_friendly: '3',  caps: '50',  period: '1996–2000' },
  { name: 'Didier Deschamps',  nationality: 'Français', goals_total: '4',  goals_comp: '2',  goals_friendly: '2',  caps: '103', period: '1989–2000' },
]
.sort((a, b) => Number(b.goals_total) - Number(a.goals_total))

async function seed() {
  const quiz = {
    title: 'Top buteurs de l\'Équipe de France (all-time)',
    description: 'Joueurs ayant marqué le plus de buts sous le maillot bleu, compétitions et amicaux',
    sport: 'football',
    columns: [
      { key: 'name',           label: 'Joueur',            is_answer: true,  hint_order: 0 },
      { key: 'nationality',    label: 'Nationalité',       is_answer: false, hint_order: 1 },
      { key: 'goals_total',    label: 'Buts (total)',      is_answer: false, hint_order: 2 },
      { key: 'goals_comp',     label: 'Buts officiel',     is_answer: false, hint_order: 3 },
      { key: 'goals_friendly', label: 'Buts amicaux',      is_answer: false, hint_order: 4 },
      { key: 'caps',           label: 'Sélections',        is_answer: false, hint_order: 5 },
      { key: 'period',         label: 'Période',           is_answer: false, hint_order: 6 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
