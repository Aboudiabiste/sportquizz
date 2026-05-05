/**
 * Seed : Stars du FC Nantes (1996–2024)
 * Joueurs qui ont marqué l'histoire du FCN depuis 1996
 * Run : npx tsx db/seeds/nantes-stars.ts
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
  { player: 'Mickaël Landreau',    nationality: 'Français',   position: 'Gardien',     years: '1997–2006', club_after: 'PSG',                note: 'Gardien formé au club — 9 ans à Nantes, champion de France 2001' },
  { player: 'Philippe Mexes',      nationality: 'Français',   position: 'Défenseur',   years: '2001–2004', club_after: 'AS Roma',            note: 'Défenseur solide formé à Auxerre — 3 ans à Nantes avant l\'Italie' },
  { player: 'Sylvain Armand',      nationality: 'Français',   position: 'Défenseur',   years: '1999–2009', club_after: 'PSG',                note: 'Un des piliers de la défense nantaise — 10 saisons au club' },
  { player: 'Imran Louza',         nationality: 'Marocain',   position: 'Milieu',      years: '2018–2021', club_after: 'Watford',            note: 'International marocain — transfert à Watford pour ~8M€ en 2021' },
  { player: 'Diego Carlos',        nationality: 'Brésilien',  position: 'Défenseur',   years: '2017–2019', club_after: 'Séville FC',         note: 'Révélé à Nantes — vendu ~15M€ à Séville, puis Aston Villa pour ~27M€' },
  { player: 'Valentin Rongier',    nationality: 'Français',   position: 'Milieu',      years: '2016–2019', club_after: 'Olympique de Marseille', note: 'Capitaine nantais — transféré à l\'OM pour ~13M€ en 2019' },
  { player: 'Emiliano Sala',       nationality: 'Argentin',   position: 'Attaquant',   years: '2015–2019', club_after: 'Cardiff City',       note: '42 buts en L1 — disparu dans un accident d\'avion en janvier 2019' },
  { player: 'Randal Kolo Muani',   nationality: 'Français',   position: 'Attaquant',   years: '2020–2022', club_after: 'Eintracht Frankfurt', note: 'Libre en 2022 — 1 saison folle à Frankfurt puis ~95M€ au PSG' },
  { player: 'Moses Simon',         nationality: 'Nigérian',   position: 'Ailier',      years: '2019–2024', club_after: 'Al-Qadsiah',         note: 'International nigérian — 5 saisons fidèles, meilleur passeur L1 2021-22' },
]

async function seed() {
  const quiz = {
    title: 'Stars du FC Nantes (1996–2024)',
    description: 'Les joueurs qui ont marqué l\'histoire du FCN depuis 1996',
    sport: 'football',
    columns: [
      { key: 'player',      label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'position',    label: 'Poste',        is_answer: false, hint_order: 2 },
      { key: 'years',       label: 'Années FCN',   is_answer: false, hint_order: 3 },
      { key: 'club_after',  label: 'Club suivant', is_answer: false, hint_order: 4 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
