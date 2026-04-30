/**
 * Seed : Vainqueurs du Tour des Flandres (1996–2024)
 * Run : npx tsx db/seeds/tour-des-flandres.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const rows = [
  { year: '1996', winner: 'Michele Bartoli',        nationality: 'Italien',      team: 'MG Maglificio',           note: 'Dernière montée du Mur de Grammont' },
  { year: '1997', winner: 'Rolf Sørensen',           nationality: 'Danois',       team: 'Rabobank',                note: 'Seul Danois vainqueur du Ronde' },
  { year: '1998', winner: 'Johan Museeuw',           nationality: 'Belge',        team: 'Mapei',                   note: '2e titre — "Le Lion des Flandres"' },
  { year: '1999', winner: 'Peter Van Petegem',       nationality: 'Belge',        team: 'Mapei',                   note: '1er titre, réédite en 2003' },
  { year: '2000', winner: 'Nico Mattan',             nationality: 'Belge',        team: 'Cofidis',                 note: 'Seule victoire classique de sa carrière' },
  { year: '2001', winner: 'Gianluca Bortolami',      nationality: 'Italien',      team: 'Mapei',                   note: 'Cartier + Bortolami — Mapei encore !' },
  { year: '2002', winner: 'Andrea Tafi',             nationality: 'Italien',      team: 'Mapei',                   note: 'Tafi vainqueur au sprint — quadruplé Mapei' },
  { year: '2003', winner: 'Peter Van Petegem',       nationality: 'Belge',        team: 'Lotto',                   note: '2e titre + Tour de Flandres = sa course' },
  { year: '2004', winner: 'Steffen Wesemann',        nationality: 'Allemand',     team: 'T-Mobile',                note: 'Victoire solitaire — seul Allemand vainqueur' },
  { year: '2005', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Quick Step',              note: '1er titre — aussi Champion du Monde la même année' },
  { year: '2006', winner: 'Filippo Pozzato',         nationality: 'Italien',      team: 'Quick Step',              note: 'Seule grande victoire de Pozzato' },
  { year: '2007', winner: 'Leif Hoste',              nationality: 'Belge',        team: 'Discovery Channel',       note: 'Sprinte Boonen dans le Bosberg' },
  { year: '2008', winner: 'Stijn Devolder',          nationality: 'Belge',        team: 'Quick Step',              note: 'Solo de 30 km — surprend tout le monde' },
  { year: '2009', winner: 'Stijn Devolder',          nationality: 'Belge',        team: 'Quick Step',              note: 'Doublé — encore un solo irrésistible' },
  { year: '2010', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'Saxo Bank',               note: '"Spartacus" — Boonen distancé, accusation moteur' },
  { year: '2011', winner: 'Nick Nuyens',             nationality: 'Belge',        team: 'Saxo Bank',               note: 'Outsider total — bat Cancellara, Boonen, Gilbert' },
  { year: '2012', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Omega Pharma-QS',         note: '2e titre — doublé Flandres + Roubaix' },
  { year: '2013', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'RadioShack-Leopard',      note: '2e titre — duel épique avec Sagan' },
  { year: '2014', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'Trek Factory',            note: '3e titre — le Ronde lui appartient' },
  { year: '2015', winner: 'Alexander Kristoff',      nationality: 'Norvégien',    team: 'Katusha',                 note: 'Sprint massif à Audenarde — 1er norvégien' },
  { year: '2016', winner: 'Peter Sagan',             nationality: 'Slovaque',     team: 'Tinkoff',                 note: 'Sagan enfin vainqueur du Ronde après 2 podiums' },
  { year: '2017', winner: 'Philippe Gilbert',        nationality: 'Belge',        team: 'Quick-Step Floors',       note: 'L\'évasion du Paterberg — magnifique Gilbert' },
  { year: '2018', winner: 'Niki Terpstra',           nationality: 'Néerlandais',  team: 'Quick-Step Floors',       note: 'Solo dans les 50 derniers km — QS domine' },
  { year: '2019', winner: 'Alberto Bettiol',         nationality: 'Italien',      team: 'EF Education First',      note: 'Surprise absolue — bat Alaphilippe au Paterberg' },
  { year: '2020', winner: 'Mathieu van der Poel',    nationality: 'Néerlandais',  team: 'Alpecin-Fenix',           note: 'MVDP fait rêver — attaque mythique au Paterberg' },
  { year: '2021', winner: 'Kasper Asgreen',          nationality: 'Danois',       team: 'Deceuninck-Quick Step',   note: 'Bat MVDP au sprint — duel de titans' },
  { year: '2022', winner: 'Mathieu van der Poel',    nationality: 'Néerlandais',  team: 'Alpecin-Fenix',           note: '2e titre — Pogačar battu au Paterberg' },
  { year: '2023', winner: 'Tadej Pogačar',           nationality: 'Slovène',      team: 'UAE Team Emirates',       note: 'Pogačar dévaste le Ronde — solo de 60 km !' },
  { year: '2024', winner: 'Tadej Pogačar',           nationality: 'Slovène',      team: 'UAE Team Emirates',       note: '2e titre — MVDP absent, Pogačar règne seul' },
]

async function seed() {
  const quiz = {
    title: 'Tour des Flandres',
    description: '1996–2024 · De Ronde van Vlaanderen',
    sport: 'cyclisme',
    columns: [
      { key: 'year',        label: 'Année',        is_answer: false, hint_order: 0 },
      { key: 'winner',      label: 'Vainqueur',    is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 2 },
      { key: 'team',        label: 'Équipe',       is_answer: false, hint_order: 3 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 4 },
    ],
    rows,
  }
  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}
seed()
