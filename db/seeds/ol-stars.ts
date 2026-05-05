/**
 * Seed : Joueurs ayant marqué l'histoire de l'OL et quitté pour un grand club (1999–2024)
 * Format : joueur (réponse), nationalité, poste, destination, année de départ, note
 * Run : npx tsx db/seeds/ol-stars.ts
 * Sources : Wikipedia / Transfermarkt
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { player: 'Sonny Anderson',         nationality: 'Brésilien',    position: 'Attaquant',        club_after: 'AS Monaco',         year: '2004', note: 'Meilleur buteur L1 avec OL — 2 titres de champion' },
  { player: 'Mahamadou Diarra',       nationality: 'Malien',       position: 'Milieu défensif',  club_after: 'Real Madrid',       year: '2005', note: 'Parti pour ~24M€ — rouage clé de l\'ère des 7 titres' },
  { player: 'Michael Essien',         nationality: 'Ghanéen',      position: 'Milieu',           club_after: 'Chelsea',           year: '2005', note: 'Transfert record France → étranger à l\'époque : ~38M€' },
  { player: 'Eric Abidal',            nationality: 'Français',     position: 'Défenseur',        club_after: 'FC Barcelone',      year: '2007', note: 'Ira jusqu\'en finale LDC avec le Barça — tumeur au foie surmontée' },
  { player: 'Florent Malouda',        nationality: 'Français',     position: 'Ailier',           club_after: 'Chelsea',           year: '2007', note: 'International français — a remporté la Premier League avec Chelsea' },
  { player: 'Karim Benzema',          nationality: 'Français',     position: 'Attaquant',        club_after: 'Real Madrid',       year: '2009', note: 'Formé à l\'OL — partira pour ~35M€, deviendra légendaire au Real' },
  { player: 'Lisandro López',         nationality: 'Argentin',     position: 'Attaquant',        club_after: 'Porto / Getafe',    year: '2012', note: 'Arrivé de Porto, prolifique avec OL, retour en Argentine après' },
  { player: 'Alexandre Lacazette',    nationality: 'Français',     position: 'Attaquant',        club_after: 'Arsenal',           year: '2017', note: 'Formé à l\'OL — 97 buts en L1, recordman du club. Revenu en 2022' },
  { player: 'Corentin Tolisso',       nationality: 'Français',     position: 'Milieu',           club_after: 'Bayern Munich',     year: '2017', note: 'Champion du Monde 2018 — transféré pour 41,5M€, record OL → étranger' },
  { player: 'Nabil Fekir',            nationality: 'Français',     position: 'Milieu offensif',  club_after: 'Real Betis',        year: '2019', note: 'Accord Liverpool torpillé en 2018 — finalement à Betis pour ~19M€' },
  { player: 'Memphis Depay',          nationality: 'Néerlandais',  position: 'Attaquant',        club_after: 'FC Barcelone',      year: '2021', note: 'Arrivé libre de Man. United, parti libre pour le Barça — 76 buts OL' },
  { player: 'Houssem Aouar',          nationality: 'Français',     position: 'Milieu offensif',  club_after: 'AS Roma',           year: '2022', note: 'Convoité par Arsenal des années — finalement signé par Mourinho à Rome' },
  { player: 'Maxwel Cornet',          nationality: 'Ivoirien',     position: 'Ailier / Défenseur', club_after: 'Burnley',         year: '2021', note: 'Polyvalence — 3 buts vs Man. City en UCL 2019-20 dans un seul match' },
  { player: 'Moussa Dembélé',         nationality: 'Français',     position: 'Attaquant',        club_after: 'Atlético Madrid',   year: '2020', note: 'Doublé vs Man. City en QF UCL 2020 lors du "Final 8" de Lisbonne' },
]

async function seed() {
  const quiz = {
    title: 'Grandes stars de l\'OL (1999–2024)',
    description: 'Les joueurs qui ont marqué l\'Olympique Lyonnais avant de briller ailleurs',
    sport: 'football',
    columns: [
      { key: 'player',      label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'position',    label: 'Poste',        is_answer: false, hint_order: 2 },
      { key: 'club_after',  label: 'Club suivant', is_answer: false, hint_order: 3 },
      { key: 'year',        label: 'Départ',       is_answer: false, hint_order: 4 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
