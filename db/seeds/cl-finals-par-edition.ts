/**
 * Seed : Buteur décisif en finale de la Ligue des Champions (1993–2024)
 * Format : une finale par ligne, le buteur décisif / memorable comme réponse
 * Run : npx tsx db/seeds/cl-finals-par-edition.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const rows = [
  { year: '1993', winner: 'Marseille',          score: '1-0',            scorer: 'Basile Boli',         note: 'Seul titre européen de l\'OM' },
  { year: '1994', winner: 'AC Milan',            score: '4-0 vs Barça',   scorer: 'Daniele Massaro',     note: '2 buts, manita historique' },
  { year: '1995', winner: 'Ajax',                score: '1-0',            scorer: 'Patrick Kluivert',    note: 'Entré en jeu, dernier titre Ajax' },
  { year: '1996', winner: 'Juventus',            score: '1-1 (4-2 tab)',  scorer: 'Fabrizio Ravanelli',  note: 'Égaliseur avant les tirs au but' },
  { year: '1997', winner: 'Borussia Dortmund',   score: '3-1',            scorer: 'Lars Ricken',         note: 'Geste technique 16 secondes après son entrée' },
  { year: '1998', winner: 'Real Madrid',         score: '1-0',            scorer: 'Predrag Mijatović',   note: 'Seul but de la finale' },
  { year: '1999', winner: 'Manchester United',   score: '2-1',            scorer: 'Ole Gunnar Solskjær', note: 'But à la 93e — remontada de Fergie' },
  { year: '2000', winner: 'Real Madrid',         score: '3-0',            scorer: 'Steve McManaman',     note: 'Volée sublime — but de la saison en Europe' },
  { year: '2001', winner: 'Bayern Munich',       score: '1-1 (5-4 tab)',  scorer: 'Mehmet Scholl',       note: 'But en prolongations pour le Bayern' },
  { year: '2002', winner: 'Real Madrid',         score: '2-1',            scorer: 'Zinédine Zidane',     note: 'Volée du gauche — but du siècle' },
  { year: '2003', winner: 'AC Milan',            score: '0-0 (3-2 tab)',  scorer: '—',                   note: 'Finale sans but — derby de Milan' },
  { year: '2004', winner: 'Porto',               score: '3-0',            scorer: 'Carlos Alberto',      note: 'Mourinho et Porto dominent Monaco' },
  { year: '2005', winner: 'Liverpool',           score: '3-3 (3-2 tab)',  scorer: 'Steven Gerrard',      note: 'Miracle d\'Istanbul — menés 0-3, retour en 6 min' },
  { year: '2006', winner: 'FC Barcelone',        score: '2-1',            scorer: 'Juliano Belletti',    note: 'But vainqueur dans les dernières minutes' },
  { year: '2007', winner: 'AC Milan',            score: '2-1',            scorer: 'Filippo Inzaghi',     note: 'Revanche sur Liverpool — Inzaghi doublé' },
  { year: '2008', winner: 'Manchester United',   score: '1-1 (6-5 tab)',  scorer: 'Cristiano Ronaldo',   note: 'But de la tête, mais manque son pénalty en finale' },
  { year: '2009', winner: 'FC Barcelone',        score: '2-0',            scorer: 'Lionel Messi',        note: 'But de la tête — pas habituel pour Messi' },
  { year: '2010', winner: 'Inter Milan',         score: '2-0',            scorer: 'Diego Milito',        note: '2 buts — Mourinho pleure sur le gazon' },
  { year: '2011', winner: 'FC Barcelone',        score: '3-1',            scorer: 'Lionel Messi',        note: 'Geste magnifique sur le 2e but' },
  { year: '2012', winner: 'Chelsea',             score: '1-1 (4-3 tab)',  scorer: 'Didier Drogba',       note: 'Égalisation à la 88e, pénalty clé en finale' },
  { year: '2013', winner: 'Bayern Munich',       score: '2-1',            scorer: 'Arjen Robben',        note: 'But vainqueur à la 89e — Robben se rachète' },
  { year: '2014', winner: 'Real Madrid',         score: '4-1 ap',         scorer: 'Sergio Ramos',        note: 'Égalisation à la 93e — puis 3 buts en prolongation' },
  { year: '2015', winner: 'FC Barcelone',        score: '3-1',            scorer: 'Ivan Rakitić',        note: 'But rapide en 4e min — Juve ne revient jamais' },
  { year: '2016', winner: 'Real Madrid',         score: '1-1 (5-3 tab)',  scorer: 'Yannick Carrasco',    note: 'Égalisation de Carrasco, Real gagne aux tab' },
  { year: '2017', winner: 'Real Madrid',         score: '4-1',            scorer: 'Cristiano Ronaldo',   note: 'Doublé CR7 — triplé historique Real Madrid' },
  { year: '2018', winner: 'Real Madrid',         score: '3-1',            scorer: 'Gareth Bale',         note: 'Bicyclette de légende à la 64e minute' },
  { year: '2019', winner: 'Liverpool',           score: '2-0',            scorer: 'Mohamed Salah',       note: 'Pénalty transformé dès la 2e minute' },
  { year: '2020', winner: 'Bayern Munich',       score: '1-0',            scorer: 'Kingsley Coman',      note: 'Contre son club formateur — PSG battu' },
  { year: '2021', winner: 'Chelsea',             score: '1-0',            scorer: 'Kai Havertz',         note: 'Sang-froid face à Ederson pour le seul but' },
  { year: '2022', winner: 'Real Madrid',         score: '1-0',            scorer: 'Vinicius Junior',     note: 'Liverpool dominé par le Real toute la soirée' },
  { year: '2023', winner: 'Manchester City',     score: '1-0',            scorer: 'Rodri',               note: 'Treble de City — but de Rodri en 68e' },
  { year: '2024', winner: 'Real Madrid',         score: '2-0',            scorer: 'Dani Carvajal',       note: '1er but à la 74e — 15e titre du Real en LDC' },
]

async function seed() {
  const quiz = {
    title: 'Buteurs en finale LDC · Par édition',
    description: '1993–2024 · Le buteur clé de chaque finale de Ligue des Champions',
    sport: 'football',
    columns: [
      { key: 'year',   label: 'Année',    is_answer: false, hint_order: 0 },
      { key: 'scorer', label: 'Buteur',   is_answer: true,  hint_order: 1 },
      { key: 'winner', label: 'Vainqueur',is_answer: false, hint_order: 2 },
      { key: 'score',  label: 'Score',    is_answer: false, hint_order: 3 },
      { key: 'note',   label: 'Anecdote', is_answer: false, hint_order: 4 },
    ],
    rows,
  }
  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} finales) — ID: ${data.id}`)
}
seed()
