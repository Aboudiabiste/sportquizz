/**
 * Seed : Vainqueurs du Tour de France (1996–2024)
 * Run : npx tsx db/seeds/tour-de-france.ts
 * Note : 1999-2005 Armstrong, titres annulés → aucun vainqueur officiel
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1996', winner: 'Bjarne Riis',        nationality: 'Danois',      team: 'Telekom',              stages: '1' },
  { year: '1997', winner: 'Jan Ullrich',         nationality: 'Allemand',    team: 'Telekom',              stages: '2' },
  { year: '1998', winner: 'Marco Pantani',       nationality: 'Italien',     team: 'Mercatone Uno',        stages: '3' },
  { year: '1999', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2000', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2001', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2002', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2003', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2004', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2005', winner: 'Aucun vainqueur officiel', nationality: '—',     team: '(Armstrong annulé)',   stages: '—' },
  { year: '2006', winner: 'Óscar Pereiro',       nationality: 'Espagnol',    team: 'Caisse d\'Epargne',    stages: '1' },
  { year: '2007', winner: 'Alberto Contador',    nationality: 'Espagnol',    team: 'Discovery Channel',    stages: '1' },
  { year: '2008', winner: 'Carlos Sastre',       nationality: 'Espagnol',    team: 'CSC',                  stages: '1' },
  { year: '2009', winner: 'Alberto Contador',    nationality: 'Espagnol',    team: 'Astana',               stages: '2' },
  { year: '2010', winner: 'Andy Schleck',        nationality: 'Luxembourgeois', team: 'Saxo Bank',         stages: '0' },
  { year: '2011', winner: 'Cadel Evans',         nationality: 'Australien',  team: 'BMC Racing',           stages: '1' },
  { year: '2012', winner: 'Bradley Wiggins',     nationality: 'Britannique', team: 'Sky',                  stages: '1' },
  { year: '2013', winner: 'Chris Froome',        nationality: 'Britannique', team: 'Sky',                  stages: '2' },
  { year: '2014', winner: 'Vincenzo Nibali',     nationality: 'Italien',     team: 'Astana',               stages: '4' },
  { year: '2015', winner: 'Chris Froome',        nationality: 'Britannique', team: 'Sky',                  stages: '1' },
  { year: '2016', winner: 'Chris Froome',        nationality: 'Britannique', team: 'Sky',                  stages: '3' },
  { year: '2017', winner: 'Chris Froome',        nationality: 'Britannique', team: 'Sky',                  stages: '2' },
  { year: '2018', winner: 'Geraint Thomas',      nationality: 'Britannique', team: 'Sky',                  stages: '2' },
  { year: '2019', winner: 'Egan Bernal',         nationality: 'Colombien',   team: 'Ineos',                stages: '1' },
  { year: '2020', winner: 'Tadej Pogačar',       nationality: 'Slovène',     team: 'UAE Team Emirates',    stages: '3' },
  { year: '2021', winner: 'Tadej Pogačar',       nationality: 'Slovène',     team: 'UAE Team Emirates',    stages: '3' },
  { year: '2022', winner: 'Jonas Vingegaard',    nationality: 'Danois',      team: 'Jumbo-Visma',          stages: '2' },
  { year: '2023', winner: 'Jonas Vingegaard',    nationality: 'Danois',      team: 'Jumbo-Visma',          stages: '2' },
  { year: '2024', winner: 'Tadej Pogačar',       nationality: 'Slovène',     team: 'UAE Team Emirates',    stages: '6' },
]

async function seed() {
  const quiz = {
    title: 'Vainqueurs du Tour de France (1996–2024)',
    description: 'Les lauréats officiels du Tour de France depuis 1996',
    sport: 'cyclisme',
    columns: [
      { key: 'year',        label: 'Année',        is_answer: false, hint_order: 0 },
      { key: 'winner',      label: 'Vainqueur',    is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 2 },
      { key: 'team',        label: 'Équipe',       is_answer: false, hint_order: 3 },
      { key: 'stages',      label: 'Étapes gagnées', is_answer: false, hint_order: 4 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}

seed()
