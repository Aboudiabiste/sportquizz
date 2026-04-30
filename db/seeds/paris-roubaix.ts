/**
 * Seed : Vainqueurs Paris-Roubaix (1996–2024)
 * Run : npx tsx db/seeds/paris-roubaix.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const rows = [
  { year: '1996', winner: 'Johan Museeuw',          nationality: 'Belge',        team: 'Mapei',                    note: '1er titre — "Le Lion des Flandres"' },
  { year: '1997', winner: 'Frédéric Guesdon',       nationality: 'Français',     team: 'Française des Jeux',       note: 'Seule victoire française depuis 1966' },
  { year: '1998', winner: 'Franco Ballerini',        nationality: 'Italien',      team: 'Mapei',                    note: '2e titre Ballerini, décède en 2010' },
  { year: '1999', winner: 'Andrea Tafi',             nationality: 'Italien',      team: 'Mapei',                    note: 'Domination Mapei — 3e victoire en 4 ans' },
  { year: '2000', winner: 'Johan Museeuw',           nationality: 'Belge',        team: 'Mapei',                    note: '2e titre après sa fracture du genou en 98' },
  { year: '2001', winner: 'Servais Knaven',          nationality: 'Néerlandais',  team: 'Domo Farm Frites',         note: 'Équipier de Museeuw, seule victoire de carrière' },
  { year: '2002', winner: 'Johan Museeuw',           nationality: 'Belge',        team: 'Domo Farm Frites',         note: '3e titre — last dance avant retraite' },
  { year: '2003', winner: 'Peter Van Petegem',       nationality: 'Belge',        team: 'Lotto',                    note: 'Tour des Flandres + Roubaix la même année' },
  { year: '2004', winner: 'Magnus Bäckstedt',        nationality: 'Suédois',      team: 'Alessio-Bianchi',          note: 'Géant suédois — seul vainqueur scandinave' },
  { year: '2005', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Quick Step',               note: '1er titre Boonen, Champion du Monde la même année' },
  { year: '2006', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'Fassa Bortolo',            note: '1er titre Cancellara — "Spartacus" est né' },
  { year: '2007', winner: 'Stuart O\'Grady',         nationality: 'Australien',   team: 'Team CSC',                 note: 'Victoire de prestige pour l\'Australien' },
  { year: '2008', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Quick Step',               note: '2e titre — contrôle positif cocaine, pas suspendu' },
  { year: '2009', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Quick Step',               note: '3e titre Boonen — trio dans l\'histoire' },
  { year: '2010', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'Saxo Bank',                note: '2e titre — accusé de moteur caché (démenti)' },
  { year: '2011', winner: 'Johan Vansummeren',       nationality: 'Belge',        team: 'Garmin-Cervelo',           note: 'Outsider absolu — seule victoire de carrière' },
  { year: '2012', winner: 'Tom Boonen',              nationality: 'Belge',        team: 'Omega Pharma-Quick Step',  note: '4e titre — égale record de Museeuw et De Vlaeminck' },
  { year: '2013', winner: 'Fabian Cancellara',       nationality: 'Suisse',       team: 'RadioShack-Leopard',       note: '3e titre — "l\'Enfer du Nord" lui appartient' },
  { year: '2014', winner: 'Niki Terpstra',           nationality: 'Néerlandais',  team: 'Omega Pharma-Quick Step',  note: 'Solo de 50km — Quick Step domine encore' },
  { year: '2015', winner: 'John Degenkolb',          nationality: 'Allemand',     team: 'Giant-Alpecin',            note: 'Double MSR + Roubaix en 2 semaines !' },
  { year: '2016', winner: 'Mathew Hayman',           nationality: 'Australien',   team: 'Orica-GreenEdge',          note: '37 ans — bat Boonen au sprint. Incroyable !' },
  { year: '2017', winner: 'Greg Van Avermaet',       nationality: 'Belge',        team: 'BMC Racing',               note: 'Champion olympique 2016 + Roubaix 2017' },
  { year: '2018', winner: 'Peter Sagan',             nationality: 'Slovaque',     team: 'Bora-Hansgrohe',           note: 'Sagan enfin vainqueur à Roubaix' },
  { year: '2019', winner: 'Philippe Gilbert',        nationality: 'Belge',        team: 'Deceuninck-Quick Step',    note: 'Le dernier monument qui lui manquait !' },
  { year: '2020', winner: 'Course annulée (COVID)',  nationality: '—',            team: '—',                        note: 'Annulation inédite due à la pandémie' },
  { year: '2021', winner: 'Sonny Colbrelli',         nationality: 'Italien',      team: 'Bahrain Victorious',       note: 'Arrêt cardiaque quelques mois plus tard, a survécu' },
  { year: '2022', winner: 'Dylan van Baarle',        nationality: 'Néerlandais',  team: 'Ineos Grenadiers',         note: 'Van der Poel et Van Aert battus au sprint' },
  { year: '2023', winner: 'Mathieu van der Poel',    nationality: 'Néerlandais',  team: 'Alpecin-Deceuninck',       note: 'MVDP domine le pavé — seul au monde' },
  { year: '2024', winner: 'Mathieu van der Poel',    nationality: 'Néerlandais',  team: 'Alpecin-Deceuninck',       note: '2e titre consécutif — irrésistible MVDP' },
]

async function seed() {
  const quiz = {
    title: 'Vainqueurs Paris-Roubaix',
    description: '1996–2024 · L\'Enfer du Nord',
    sport: 'cyclisme',
    columns: [
      { key: 'year',        label: 'Année',       is_answer: false, hint_order: 0 },
      { key: 'winner',      label: 'Vainqueur',   is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 2 },
      { key: 'team',        label: 'Équipe',      is_answer: false, hint_order: 3 },
      { key: 'note',        label: 'Anecdote',    is_answer: false, hint_order: 4 },
    ],
    rows,
  }
  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}
seed()
