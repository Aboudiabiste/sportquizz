/**
 * Seed : Top buteurs en Coupe du Monde FIFA all-time (30+ joueurs)
 * Run : npx tsx db/seeds/cdm-buteurs.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { name: 'Miroslav Klose',      nationality: 'Allemand',    goals: '16', editions: '2002, 2006, 2010, 2014',  best: '2002 (5), 2006 (5), 2010 (4), 2014 (2)' },
  { name: 'Ronaldo (R9)',        nationality: 'Brésilien',   goals: '15', editions: '1994, 1998, 2002, 2006',   best: '2002 (8 buts, champion)' },
  { name: 'Gerd Müller',        nationality: 'Allemand',    goals: '14', editions: '1970, 1974',               best: '1970 (10 buts)' },
  { name: 'Just Fontaine',       nationality: 'Français',    goals: '13', editions: '1958',                     best: '1958 (13 buts en 1 tournoi !)' },
  { name: 'Pelé',                nationality: 'Brésilien',   goals: '12', editions: '1958, 1962, 1966, 1970',   best: '1958 (6 buts, champion à 17 ans)' },
  { name: 'Kylian Mbappé',       nationality: 'Français',    goals: '12', editions: '2018, 2022',               best: '2022 (8 buts, Soulier d\'Or)' },
  { name: 'Sándor Kocsis',       nationality: 'Hongrois',    goals: '11', editions: '1954',                     best: '1954 (11 buts)' },
  { name: 'Jürgen Klinsmann',    nationality: 'Allemand',    goals: '11', editions: '1990, 1994, 1998',          best: '1994 (5 buts)' },
  { name: 'Helmut Rahn',         nationality: 'Allemand',    goals: '10', editions: '1954, 1958',               best: '1954 (4 buts)' },
  { name: 'Gary Lineker',        nationality: 'Anglais',     goals: '10', editions: '1986, 1990',               best: '1986 (6 buts, Soulier d\'Or)' },
  { name: 'Teófilo Cubillas',    nationality: 'Péruvien',    goals: '10', editions: '1970, 1978',               best: '1970 (5 buts)' },
  { name: 'Grzegorz Lato',       nationality: 'Polonais',    goals: '10', editions: '1974, 1978, 1982',          best: '1974 (7 buts, Soulier d\'Or)' },
  { name: 'Gabriel Batistuta',   nationality: 'Argentin',    goals: '10', editions: '1994, 1998, 2002',          best: '1994 (4 buts)' },
  { name: 'Thomas Müller',       nationality: 'Allemand',    goals: '10', editions: '2010, 2014, 2018',          best: '2010 (5 buts, 3e place)' },
  { name: 'Eusébio',             nationality: 'Portugais',   goals: '9',  editions: '1966',                     best: '1966 (9 buts, Soulier d\'Or)' },
  { name: 'Cristiano Ronaldo',   nationality: 'Portugais',   goals: '8',  editions: '2006, 2010, 2014, 2018, 2022', best: '2022 (3 buts)' },
  { name: 'Lionel Messi',        nationality: 'Argentin',    goals: '13', editions: '2006, 2010, 2014, 2018, 2022', best: '2022 (7 buts, Ballon d\'Or)' },
  { name: 'Uwe Seeler',          nationality: 'Allemand',    goals: '9',  editions: '1958, 1962, 1966, 1970',   best: '1970 (3 buts)' },
  { name: 'Vavá',                nationality: 'Brésilien',   goals: '9',  editions: '1958, 1962',               best: '1958 (5 buts, champion)' },
  { name: 'David Villa',         nationality: 'Espagnol',    goals: '9',  editions: '2006, 2010',               best: '2010 (5 buts, champion)' },
  { name: 'Aleksandar Mitrović', nationality: 'Serbe',       goals: '7',  editions: '2018, 2022',               best: '2022 (3 buts)' },
  { name: 'Karim Benzema',       nationality: 'Français',    goals: '6',  editions: '2014, 2022 (blessé)',      best: '2014 (1 but)' },
  { name: 'Harry Kane',          nationality: 'Anglais',     goals: '9',  editions: '2018, 2022',               best: '2018 (6 buts, Soulier d\'Or)' },
  { name: 'Luka Modrić',         nationality: 'Croate',      goals: '2',  editions: '2014, 2018, 2022',         best: '2018 (finaliste)' },
  { name: 'Rivaldo',             nationality: 'Brésilien',   goals: '8',  editions: '1998, 2002',               best: '2002 (5 buts, champion)' },
  { name: 'Thierry Henry',       nationality: 'Français',    goals: '6',  editions: '1998, 2002, 2006, 2010',   best: '1998 (3 buts, champion)' },
  { name: 'Zinédine Zidane',     nationality: 'Français',    goals: '5',  editions: '1998, 2002, 2006',         best: '1998 (2 buts en finale, champion)' },
  { name: 'Romário',             nationality: 'Brésilien',   goals: '5',  editions: '1994',                     best: '1994 (5 buts, champion, MVP)' },
  { name: 'Olivier Giroud',      nationality: 'Français',    goals: '4',  editions: '2014, 2018, 2022',         best: '2018 (0 but, champion !)' },
  { name: 'Antoine Griezmann',   nationality: 'Français',    goals: '7',  editions: '2014, 2018, 2022',         best: '2018 (3 buts, champion)' },
  { name: 'Robert Lewandowski',  nationality: 'Polonais',    goals: '10', editions: '2006, 2010, 2014, 2018, 2022', best: '2022 (2 buts)' },
  { name: 'Erling Haaland',      nationality: 'Norvégien',   goals: '0',  editions: '—',                        best: 'Jamais qualifié en CDM' },
]

const deduped = [...new Map(rows.map(r => [r.name, r])).values()]
  .sort((a, b) => Number(b.goals) - Number(a.goals))

async function seed() {
  const quiz = {
    title: 'Top buteurs Coupe du Monde FIFA all-time',
    description: 'Les meilleurs buteurs de l\'histoire de la Coupe du Monde',
    sport: 'football',
    columns: [
      { key: 'name',        label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'goals',       label: 'Buts CDM',     is_answer: false, hint_order: 2 },
      { key: 'editions',    label: 'Éditions',     is_answer: false, hint_order: 3 },
      { key: 'best',        label: 'Meilleur tournoi', is_answer: false, hint_order: 4 },
    ],
    rows: deduped,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${deduped.length} joueurs) — ID: ${data.id}`)
}

seed()
