/**
 * Seed : Top buteurs Ligue des Champions all-time (50 joueurs)
 * Run : npx tsx db/seeds/ldc-top-scorers.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { name: 'Cristiano Ronaldo',    nationality: 'Portugais',    goals: '140', club: 'Man. United / Real Madrid' },
  { name: 'Lionel Messi',         nationality: 'Argentin',     goals: '129', club: 'FC Barcelone / PSG' },
  { name: 'Robert Lewandowski',   nationality: 'Polonais',     goals: '94',  club: 'Dortmund / Bayern / Barcelone' },
  { name: 'Karim Benzema',        nationality: 'Français',     goals: '90',  club: 'Real Madrid' },
  { name: 'Raúl',                 nationality: 'Espagnol',     goals: '71',  club: 'Real Madrid' },
  { name: 'Mohamed Salah',        nationality: 'Égyptien',     goals: '57',  club: 'Liverpool' },
  { name: 'Ruud van Nistelrooy',  nationality: 'Néerlandais',  goals: '56',  club: 'Man. United / Real Madrid' },
  { name: 'Thomas Müller',        nationality: 'Allemand',     goals: '54',  club: 'Bayern Munich' },
  { name: 'Thierry Henry',        nationality: 'Français',     goals: '50',  club: 'Arsenal / Barcelone' },
  { name: 'Kylian Mbappé',        nationality: 'Français',     goals: '49',  club: 'PSG / Real Madrid' },
  { name: 'Filippo Inzaghi',      nationality: 'Italien',      goals: '46',  club: 'Juventus / AC Milan' },
  { name: 'Eusébio',              nationality: 'Portugais',    goals: '46',  club: 'Benfica' },
  { name: 'Andriy Shevchenko',    nationality: 'Ukrainien',    goals: '48',  club: 'Dynamo Kiev / AC Milan' },
  { name: 'Zlatan Ibrahimović',   nationality: 'Suédois',      goals: '48',  club: 'Ajax / Juventus / Inter / Barcelone / AC Milan / PSG' },
  { name: 'Didier Drogba',        nationality: 'Ivoirien',     goals: '44',  club: 'Chelsea' },
  { name: 'Neymar',               nationality: 'Brésilien',    goals: '43',  club: 'Barcelone / PSG' },
  { name: 'Erling Haaland',       nationality: 'Norvégien',    goals: '42',  club: 'Dortmund / Man. City' },
  { name: 'Arjen Robben',         nationality: 'Néerlandais',  goals: '40',  club: 'Chelsea / Real Madrid / Bayern' },
  { name: 'Samuel Eto\'o',        nationality: 'Camerounais',  goals: '36',  club: 'Barcelone / Inter Milan' },
  { name: 'Fernando Morientes',   nationality: 'Espagnol',     goals: '33',  club: 'Real Madrid / Monaco' },
  { name: 'Ronaldo (R9)',         nationality: 'Brésilien',    goals: '30',  club: 'Barcelone / Real Madrid' },
  { name: 'David Villa',          nationality: 'Espagnol',     goals: '30',  club: 'Valencia / Barcelone' },
  { name: 'Wayne Rooney',         nationality: 'Anglais',      goals: '30',  club: 'Man. United' },
  { name: 'Clarence Seedorf',     nationality: 'Néerlandais',  goals: '28',  club: 'Ajax / Real Madrid / AC Milan' },
  { name: 'Patrick Kluivert',     nationality: 'Néerlandais',  goals: '28',  club: 'Ajax / Barcelone' },
  { name: 'Gareth Bale',          nationality: 'Gallois',      goals: '27',  club: 'Real Madrid' },
  { name: 'Frank Ribéry',         nationality: 'Français',     goals: '26',  club: 'Bayern Munich' },
  { name: 'Antoine Griezmann',    nationality: 'Français',     goals: '26',  club: 'Atlético Madrid / Barcelone' },
  { name: 'Sadio Mané',           nationality: 'Sénégalais',   goals: '26',  club: 'Liverpool' },
  { name: 'Rivaldo',              nationality: 'Brésilien',    goals: '22',  club: 'Barcelone' },
  { name: 'Frank Lampard',        nationality: 'Anglais',      goals: '23',  club: 'Chelsea' },
  { name: 'Vinicius Junior',      nationality: 'Brésilien',    goals: '21',  club: 'Real Madrid' },
  { name: 'Alessandro Del Piero', nationality: 'Italien',      goals: '19',  club: 'Juventus' },
  { name: 'Hernán Crespo',        nationality: 'Argentin',     goals: '20',  club: 'Lazio / Inter / AC Milan' },
  { name: 'Luís Figo',            nationality: 'Portugais',    goals: '19',  club: 'Barcelone / Real Madrid' },
  { name: 'Steven Gerrard',       nationality: 'Anglais',      goals: '22',  club: 'Liverpool' },
  { name: 'Lautaro Martínez',     nationality: 'Argentin',     goals: '18',  club: 'Inter Milan' },
  { name: 'Álvaro Morata',        nationality: 'Espagnol',     goals: '19',  club: 'Real Madrid / Juventus / Chelsea / Atlético' },
  { name: 'Carlos Tevez',         nationality: 'Argentin',     goals: '18',  club: 'Man. United / Man. City / Juventus' },
  { name: 'Franck Ribéry',        nationality: 'Français',     goals: '26',  club: 'Bayern Munich' },
  { name: 'Iker Casillas',        nationality: 'Espagnol',     goals: '0',   club: 'Real Madrid / FC Porto' },
  { name: 'Xabi Alonso',          nationality: 'Espagnol',     goals: '15',  club: 'Liverpool / Real Madrid' },
  { name: 'Sergio Ramos',         nationality: 'Espagnol',     goals: '14',  club: 'Real Madrid' },
  { name: 'Nicolas Anelka',       nationality: 'Français',     goals: '14',  club: 'Arsenal / Real Madrid / Man. City / Chelsea' },
  { name: 'Pedri',                nationality: 'Espagnol',     goals: '8',   club: 'FC Barcelone' },
  { name: 'Luka Modrić',          nationality: 'Croate',       goals: '15',  club: 'Real Madrid' },
  { name: 'Iván Zamorano',        nationality: 'Chilien',      goals: '12',  club: 'Real Madrid / Inter Milan' },
  { name: 'Robinho',              nationality: 'Brésilien',    goals: '11',  club: 'Real Madrid / Man. City / AC Milan' },
  { name: 'Rui Costa',            nationality: 'Portugais',    goals: '11',  club: 'Fiorentina / AC Milan' },
  { name: 'Francesco Totti',      nationality: 'Italien',      goals: '11',  club: 'AS Roma' },
]

// Déduplique et trie par buts
const seen = new Set<string>()
const deduped = rows
  .filter(r => { if (seen.has(r.name)) return false; seen.add(r.name); return true })
  .sort((a, b) => Number(b.goals) - Number(a.goals))

async function seed() {
  const quiz = {
    title: 'Top buteurs Ligue des Champions all-time',
    description: 'Les 50 meilleurs buteurs de l\'histoire de la LDC / Coupe des Champions',
    sport: 'football',
    columns: [
      { key: 'name',        label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'goals',       label: 'Buts LDC',     is_answer: false, hint_order: 2 },
      { key: 'club',        label: 'Club(s)',       is_answer: false, hint_order: 3 },
    ],
    rows: deduped,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${deduped.length} joueurs) — ID: ${data.id}`)
}

seed()
