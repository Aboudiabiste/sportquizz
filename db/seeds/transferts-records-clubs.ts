/**
 * Seed : Record de transfert entrant par grand club (1996–2024)
 * Le joueur le plus cher jamais acheté par chaque club
 * Run : npx tsx db/seeds/transferts-records-clubs.ts
 * Sources : Transfermarkt / BBC Sport
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { club: 'PSG',                 player: 'Neymar Jr',          nationality: 'Brésilien',   fee: '222 M€', year: '2017', note: 'Record absolu de l\'histoire du football' },
  { club: 'FC Barcelone',        player: 'Philippe Coutinho',  nationality: 'Brésilien',   fee: '120 M€', year: '2018', note: 'Barça a aussi payé 120M€ pour Griezmann (2019)' },
  { club: 'Atlético Madrid',     player: 'João Félix',         nationality: 'Portugais',   fee: '126 M€', year: '2019', note: 'Record de Liga et d\'Atlético' },
  { club: 'Chelsea',             player: 'Enzo Fernández',     nationality: 'Argentin',    fee: '121 M€', year: '2023', note: 'Record de Premier League au moment de la signature' },
  { club: 'Arsenal',             player: 'Declan Rice',        nationality: 'Anglais',     fee: '105 M€', year: '2023', note: 'Record d\'Arsenal — pilier du milieu dès sa 1ère saison' },
  { club: 'Manchester City',     player: 'Jack Grealish',      nationality: 'Anglais',     fee: '100 M€', year: '2021', note: '1er club anglais à dépenser 100M€ en une seule transaction' },
  { club: 'Manchester United',   player: 'Paul Pogba',         nationality: 'Français',    fee: '105 M€', year: '2016', note: 'Record mondial en 2016 — retour au club formateur (Juventus) 6 ans après' },
  { club: 'Real Madrid',         player: 'Jude Bellingham',    nationality: 'Anglais',     fee: '103 M€', year: '2023', note: 'Meilleur joueur de Liga dès sa 1ère saison, champion d\'Europe 2024' },
  { club: 'Liverpool',           player: 'Darwin Núñez',       nationality: 'Uruguayen',   fee: '75 M€',  year: '2022', note: 'Frais initiaux (jusqu\'à 100M€ avec bonuses) — record de Liverpool' },
  { club: 'Bayern Munich',       player: 'Harry Kane',         nationality: 'Anglais',     fee: '100 M€', year: '2023', note: 'Record du Bayern — meilleur buteur Bundesliga dès sa 1ère saison' },
  { club: 'Juventus',            player: 'Matthijs de Ligt',   nationality: 'Néerlandais', fee: '85 M€',  year: '2019', note: 'Record de la Juventus (avant le transfert de Ronaldo 100M€ en 2018)' },
  { club: 'Inter Milan',         player: 'Romelu Lukaku',      nationality: 'Belge',       fee: '74 M€',  year: '2019', note: 'Record de Serie A pour l\'Inter — champion d\'Italie avec Conte' },
  { club: 'Borussia Dortmund',   player: 'Thomas Meunier',     nationality: 'Belge',       fee: '4 M€',   year: '2020', note: 'BVB vend cher mais achète peu — modèle économique de revente' },
  { club: 'Séville FC',          player: 'Jules Koundé',       nationality: 'Français',    fee: '25 M€',  year: '2019', note: 'Acheté ~25M€ à Bordeaux, revendu ~55M€ à Barcelone — modèle Séville' },
  { club: 'Napoli',              player: 'Victor Osimhen',     nationality: 'Nigérian',    fee: '70 M€',  year: '2020', note: 'Record de Napoli — champion d\'Italie 2023, puis Al-Ahli en 2024' },
]

async function seed() {
  const quiz = {
    title: 'Record de transfert par grand club (1996–2024)',
    description: 'Le joueur le plus cher jamais acheté par chaque grand club européen',
    sport: 'football',
    columns: [
      { key: 'club',        label: 'Club acheteur', is_answer: false, hint_order: 0 },
      { key: 'player',      label: 'Joueur',        is_answer: true,  hint_order: 1 },
      { key: 'fee',         label: 'Montant',       is_answer: false, hint_order: 2 },
      { key: 'nationality', label: 'Nationalité',   is_answer: false, hint_order: 3 },
      { key: 'year',        label: 'Année',         is_answer: false, hint_order: 4 },
      { key: 'note',        label: 'Anecdote',      is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} clubs) — ID: ${data.id}`)
}

seed()
