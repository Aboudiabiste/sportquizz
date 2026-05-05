/**
 * Seed : Soulier d'Or de la Coupe du Monde FIFA (1966–2022)
 * Meilleur buteur de chaque édition
 * Run : npx tsx db/seeds/cdm-soulier-or.ts
 * Sources : FIFA.com (données officielles)
 * Note : 1994 — Salenko et Stoichkov co-lauréats (6 buts chacun)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1966', scorer: 'Eusébio',               nationality: 'Portugais',    goals: '9', club: 'Benfica',             note: 'Portugal 3e — la plus belle Coupe du Monde d\'Eusébio' },
  { year: '1970', scorer: 'Gerd Müller',            nationality: 'Allemand',     goals: '10', club: 'Bayern Munich',       note: '"Der Bomber" — 10 buts en 6 matchs, record de l\'époque' },
  { year: '1974', scorer: 'Grzegorz Lato',          nationality: 'Polonais',     goals: '7', club: 'Stal Mielec',         note: 'Pologne 3e — Lato ailier droit redoutable' },
  { year: '1978', scorer: 'Mario Kempes',           nationality: 'Argentin',     goals: '6', club: 'Valencia CF',         note: 'Doublé en finale — seul buteur argentin à jouer en Europe' },
  { year: '1982', scorer: 'Paolo Rossi',            nationality: 'Italien',      goals: '6', club: 'Juventus',            note: 'Hat-trick vs Brésil + 2 vs Pologne + but en finale' },
  { year: '1986', scorer: 'Gary Lineker',           nationality: 'Anglais',      goals: '6', club: 'Everton',             note: 'Soulier d\'Or malgré l\'élimination en QF par l\'Argentine de Maradona' },
  { year: '1990', scorer: 'Salvatore Schillaci',    nationality: 'Italien',      goals: '6', club: 'Juventus',            note: 'Révélation absolue — "Toto" inconnu avant le tournoi' },
  { year: '1994', scorer: 'Oleg Salenko',           nationality: 'Russe',        goals: '6', club: 'Valencia CF',         note: 'Co-lauréat avec Stoichkov — 5 buts contre le Cameroun en 1 match' },
  { year: '1994', scorer: 'Hristo Stoichkov',       nationality: 'Bulgare',      goals: '6', club: 'FC Barcelone',        note: 'Co-lauréat avec Salenko — porte la Bulgarie en demi-finale' },
  { year: '1998', scorer: 'Davor Šuker',            nationality: 'Croate',       goals: '6', club: 'Real Madrid',         note: 'Croatie 3e à sa 1ère Coupe du Monde — Šuker meilleur buteur' },
  { year: '2002', scorer: 'Ronaldo (R9)',            nationality: 'Brésilien',    goals: '8', club: 'Real Madrid',         note: 'Rédemption après 1998 — 2 buts en finale, champion du Monde' },
  { year: '2006', scorer: 'Miroslav Klose',         nationality: 'Allemand',     goals: '5', club: 'Bayern Munich',       note: 'Début d\'une série record — 16 buts en CDM en carrière' },
  { year: '2010', scorer: 'Thomas Müller',          nationality: 'Allemand',     goals: '5', club: 'Bayern Munich',       note: 'Partagé (5 buts + 3 passes) — Müller révélé au grand public' },
  { year: '2014', scorer: 'James Rodríguez',        nationality: 'Colombien',    goals: '6', club: 'AS Monaco',           note: 'Volée vs Uruguay — but du tournoi. Transfert au Real Madrid après' },
  { year: '2018', scorer: 'Harry Kane',             nationality: 'Anglais',      goals: '6', club: 'Tottenham',           note: 'Angleterre demi-finale — Kane récompensé dont 3 pénaltys' },
  { year: '2022', scorer: 'Kylian Mbappé',          nationality: 'Français',     goals: '8', club: 'PSG',                 note: 'Hat-trick en finale — France battue aux tab par l\'Argentine' },
]

async function seed() {
  const quiz = {
    title: 'Soulier d\'Or de la Coupe du Monde (1966–2022)',
    description: 'Le meilleur buteur de chaque édition du Mondial depuis 1966',
    sport: 'football',
    columns: [
      { key: 'year',        label: 'Édition',      is_answer: false, hint_order: 0 },
      { key: 'scorer',      label: 'Buteur',       is_answer: true,  hint_order: 1 },
      { key: 'goals',       label: 'Buts',         is_answer: false, hint_order: 2 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 3 },
      { key: 'club',        label: 'Club',         is_answer: false, hint_order: 4 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}

seed()
