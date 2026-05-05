/**
 * Seed : Top transferts les plus chers de l'histoire du football (1996–2024)
 * Réponse = joueur ; indices = montant, clubs, année
 * Run : npx tsx db/seeds/transferts-records.ts
 * Sources : Transfermarkt / BBC Sport
 * Note : montants = frais fixes officiellement communiqués (hors bonus)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { player: 'Neymar Jr',              nationality: 'Brésilien',    from_club: 'FC Barcelone',      to_club: 'PSG',                  year: '2017', fee: '222 M€',  note: 'Transfert le plus cher de l\'histoire — clause libératoire activée' },
  { player: 'Kylian Mbappé',          nationality: 'Français',     from_club: 'AS Monaco',         to_club: 'PSG',                  year: '2018', fee: '180 M€',  note: 'Prêt 2017 puis achat définitif 2018 — 2e transfert le plus cher ever' },
  { player: 'Philippe Coutinho',      nationality: 'Brésilien',    from_club: 'Liverpool',         to_club: 'FC Barcelone',         year: '2018', fee: '120 M€',  note: 'Record Barça à l\'époque — déception totale en Catalogne' },
  { player: 'João Félix',             nationality: 'Portugais',    from_club: 'SL Benfica',        to_club: 'Atlético Madrid',      year: '2019', fee: '126 M€',  note: 'Record du Portugal et d\'Atlético — attentes jamais confirmées' },
  { player: 'Antoine Griezmann',      nationality: 'Français',     from_club: 'Atlético Madrid',   to_club: 'FC Barcelone',         year: '2019', fee: '120 M€',  note: 'Après le documentaire "La Décision" — retour à l\'Atlético en 2021' },
  { player: 'Enzo Fernández',         nationality: 'Argentin',     from_club: 'SL Benfica',        to_club: 'Chelsea',              year: '2023', fee: '121 M€',  note: 'Record de Chelsea et de la Premier League — champion du Monde 2022' },
  { player: 'Moïses Caicedo',         nationality: 'Équatorien',   from_club: 'Brighton',          to_club: 'Chelsea',              year: '2023', fee: '116 M€',  note: 'Milieu défensif — Chelsea double mise sur le duo Caicedo + Fernández' },
  { player: 'Declan Rice',            nationality: 'Anglais',      from_club: 'West Ham',          to_club: 'Arsenal',              year: '2023', fee: '105 M€',  note: 'Record d\'Arsenal et joueur anglais le plus cher — capitaine des Gunners' },
  { player: 'Romelu Lukaku',          nationality: 'Belge',        from_club: 'Inter Milan',       to_club: 'Chelsea',              year: '2021', fee: '113 M€',  note: 'Retour raté à Chelsea — renvoyé en prêt à l\'Inter dès l\'année suivante' },
  { player: 'Jude Bellingham',        nationality: 'Anglais',      from_club: 'Borussia Dortmund', to_club: 'Real Madrid',          year: '2023', fee: '103 M€',  note: 'Meilleur joueur de Liga dès sa 1ère saison — champion d\'Europe 2024' },
  { player: 'Ousmane Dembélé',        nationality: 'Français',     from_club: 'Borussia Dortmund', to_club: 'FC Barcelone',         year: '2017', fee: '105 M€',  note: 'Formé à Rennes — très sujet aux blessures à Barcelone' },
  { player: 'Paul Pogba',             nationality: 'Français',     from_club: 'Juventus',          to_club: 'Manchester United',    year: '2016', fee: '105 M€',  note: 'Record mondial à l\'époque — retour décevant, libre à la Juventus en 2022' },
  { player: 'Jack Grealish',          nationality: 'Anglais',      from_club: 'Aston Villa',       to_club: 'Manchester City',      year: '2021', fee: '100 M€',  note: 'Premier transfert à 100M€ d\'un club anglais — bilan mitigé sous Guardiola' },
  { player: 'Gareth Bale',            nationality: 'Gallois',      from_club: 'Tottenham',         to_club: 'Real Madrid',          year: '2013', fee: '100 M€',  note: 'Record mondial en 2013 — bicyclette en finale LDC 2018, légende galoise' },
  { player: 'Cristiano Ronaldo',      nationality: 'Portugais',    from_club: 'Manchester United', to_club: 'Real Madrid',          year: '2009', fee: '94 M€',   note: 'Record mondial à l\'époque — 12 ans et 450 buts au Real ensuite' },
  { player: 'Gonzalo Higuaín',        nationality: 'Argentin',     from_club: 'SSC Napoli',        to_club: 'Juventus',             year: '2016', fee: '90 M€',   note: 'Record Serie A — vendu par Naples après 36 buts en 1 saison (record L1)' },
  { player: 'Harry Kane',             nationality: 'Anglais',      from_club: 'Tottenham',         to_club: 'Bayern Munich',        year: '2023', fee: '100 M€',  note: 'Recordman de Tottenham — meilleur buteur Bundesliga dès sa 1ère saison' },
  { player: 'Virgil van Dijk',        nationality: 'Néerlandais',  from_club: 'Southampton',       to_club: 'Liverpool',            year: '2018', fee: '85 M€',   note: 'Record pour un défenseur à l\'époque — Liverpool champion d\'Europe 2019' },
  { player: 'Zinédine Zidane',        nationality: 'Français',     from_club: 'Juventus',          to_club: 'Real Madrid',          year: '2001', fee: '73.5 M€', note: 'Record mondial en 2001 — volée en finale LDC 2002, icône absolue' },
  { player: 'Eden Hazard',            nationality: 'Belge',        from_club: 'Chelsea',           to_club: 'Real Madrid',          year: '2019', fee: '100 M€',  note: 'Arrivée en fanfare — carrière brisée par les blessures au Real' },
]

async function seed() {
  const quiz = {
    title: 'Top transferts de l\'histoire du football (1996–2024)',
    description: 'Les transferts les plus chers jamais réalisés — réponse : le joueur concerné',
    sport: 'football',
    columns: [
      { key: 'player',      label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'fee',         label: 'Montant',      is_answer: false, hint_order: 1 },
      { key: 'from_club',   label: 'Vendeur',      is_answer: false, hint_order: 2 },
      { key: 'to_club',     label: 'Acheteur',     is_answer: false, hint_order: 3 },
      { key: 'year',        label: 'Année',        is_answer: false, hint_order: 4 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 5 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 6 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} transferts) — ID: ${data.id}`)
}

seed()
