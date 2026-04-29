/**
 * Seed : Finales de la Coupe de France (1996–2024)
 * Run : npx tsx db/seeds/coupe-de-france.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1996', winner: 'Metz',           runner_up: 'Lens',            score: '2-0',      scorer: 'Pouget, Pirès' },
  { year: '1997', winner: 'OGC Nice',       runner_up: 'Gueugnon',        score: '1-1 (4-3 tab)', scorer: 'Gueugnon og' },
  { year: '1998', winner: 'PSG',            runner_up: 'Lens',            score: '2-1',      scorer: 'Rai, Leonardo' },
  { year: '1999', winner: 'Lens',           runner_up: 'Metz',            score: '1-0',      scorer: 'Sikora' },
  { year: '2000', winner: 'Nantes',         runner_up: 'Calais (amateurs)', score: '2-1',   scorer: 'Moldovan, Da Rocha' },
  { year: '2001', winner: 'Lyon',           runner_up: 'Strasbourg',      score: '1-0',      scorer: 'Müller' },
  { year: '2002', winner: 'Lorient',        runner_up: 'Bastia',          score: '1-0',      scorer: 'Utaka' },
  { year: '2003', winner: 'AJ Auxerre',     runner_up: 'PSG',             score: '2-1',      scorer: 'Kapo, Fadiga' },
  { year: '2004', winner: 'PSG',            runner_up: 'Châteauroux',     score: '1-0',      scorer: 'Pauleta' },
  { year: '2005', winner: 'AJ Auxerre',     runner_up: 'Sedan',           score: '2-1',      scorer: 'Mwaruwari, Kalou' },
  { year: '2006', winner: 'PSG',            runner_up: 'Marseille',       score: '2-1',      scorer: 'Pauleta (2)' },
  { year: '2007', winner: 'Sochaux',        runner_up: 'Toulouse',        score: '2-2 (5-4 tab)', scorer: 'Frau, Erding' },
  { year: '2008', winner: 'Lyon',           runner_up: 'PSG',             score: '1-0',      scorer: 'Benzema' },
  { year: '2009', winner: 'Guingamp',       runner_up: 'Rennes',          score: '2-1',      scorer: 'Ruffier og, Privat' },
  { year: '2010', winner: 'PSG',            runner_up: 'Monaco',          score: '1-0',      scorer: 'Hoarau' },
  { year: '2011', winner: 'Marseille',      runner_up: 'Montpellier',     score: '0-0 (4-2 tab)', scorer: '—' },
  { year: '2012', winner: 'Lyon',           runner_up: 'Quevilly (amateurs)', score: '1-0', scorer: 'Lisandro' },
  { year: '2013', winner: 'Bordeaux',       runner_up: 'Évian',           score: '3-2',      scorer: 'Diabaté, Plasil, Jussiê' },
  { year: '2014', winner: 'EA Guingamp',    runner_up: 'Rennes',          score: '2-0',      scorer: 'Beauvue, Mandanne' },
  { year: '2015', winner: 'PSG',            runner_up: 'AJ Auxerre',      score: '1-0',      scorer: 'Cavani' },
  { year: '2016', winner: 'PSG',            runner_up: 'Marseille',       score: '4-2',      scorer: 'Ibrahimović (2), Di María, Cavani' },
  { year: '2017', winner: 'PSG',            runner_up: 'Angers',          score: '1-0',      scorer: 'Cavani' },
  { year: '2018', winner: 'PSG',            runner_up: 'Les Herbiers (amateurs)', score: '2-0', scorer: 'Mbappé, Cavani' },
  { year: '2019', winner: 'Rennes',         runner_up: 'PSG',             score: '2-2 (6-5 tab)', scorer: 'Del Castillo, Bourigeaud' },
  { year: '2020', winner: 'PSG',            runner_up: 'Saint-Étienne',   score: '1-0',      scorer: 'Mbappé' },
  { year: '2021', winner: 'Monaco',         runner_up: 'PSG',             score: '2-0 (2-0 tab, 0-0 AP)', scorer: 'Volland, Ben Yedder' },
  { year: '2022', winner: 'Nantes',         runner_up: 'Nice',            score: '1-0',      scorer: 'Blas' },
  { year: '2023', winner: 'Toulouse',       runner_up: 'Nantes',          score: '5-1',      scorer: 'Dallinga (2), Onaiwu, Chaïbi, Genreau' },
  { year: '2024', winner: 'PSG',            runner_up: 'Lyon',            score: '2-1',      scorer: 'Mbappé, Hakimi' },
]

async function seed() {
  const quiz = {
    title: 'Finales de la Coupe de France (1996–2024)',
    description: 'Clubs vainqueurs, scores et buteurs de chaque finale',
    sport: 'football',
    columns: [
      { key: 'year',      label: 'Année',     is_answer: false, hint_order: 0 },
      { key: 'winner',    label: 'Vainqueur', is_answer: true,  hint_order: 1 },
      { key: 'runner_up', label: 'Finaliste', is_answer: false, hint_order: 2 },
      { key: 'score',     label: 'Score',     is_answer: false, hint_order: 3 },
      { key: 'scorer',    label: 'Buteur(s)', is_answer: false, hint_order: 4 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} finales) — ID: ${data.id}`)
}

seed()
