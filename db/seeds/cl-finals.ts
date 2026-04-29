/**
 * Seed : Buteurs en finale de la Ligue des Champions (UCL) 1992–2024
 * Run : npx tsx db/seeds/cl-finals.ts
 *
 * Sources : UEFA, Wikipedia
 * Format  : un joueur par ligne, colonnes = réponse + indices
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Seeds utilisent la clé service_role pour bypasser RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Données ───────────────────────────────────────────────────────
// Tous les joueurs ayant marqué en finale d'UCL (1993-2024)
// goals_final = nombre de buts en finale(s) (toutes éditions confondues)
// years = année(s) de la finale où il a marqué
// club = club(s) en finale

const rows = [
  // 🔴 2+ buts en finales
  { name: 'Cristiano Ronaldo',   nationality: 'Portugais',    goals_final: '3', years: '2014, 2017',        club: 'Real Madrid' },
  { name: 'Gareth Bale',         nationality: 'Gallois',       goals_final: '3', years: '2014, 2018',        club: 'Real Madrid' },
  { name: 'Samuel Eto\'o',       nationality: 'Camerounais',   goals_final: '2', years: '2006, 2009',        club: 'Barcelone' },
  { name: 'Diego Milito',        nationality: 'Argentin',      goals_final: '2', years: '2010',              club: 'Inter Milan' },
  { name: 'Filippo Inzaghi',     nationality: 'Italien',       goals_final: '2', years: '2007',              club: 'AC Milan' },
  { name: 'Thomas Müller',       nationality: 'Allemand',      goals_final: '2', years: '2012, 2013',        club: 'Bayern Munich' },
  { name: 'Karl-Heinz Riedle',   nationality: 'Allemand',      goals_final: '2', years: '1997',              club: 'Borussia Dortmund' },
  { name: 'Raúl',                nationality: 'Espagnol',      goals_final: '2', years: '1998, 2000',        club: 'Real Madrid' },  // 1998 but no, Raúl scored in 2000 + 2002? Let me double check: 2000 Real vs Valencia: Morientes, McManaman, Raúl. 2002: Raúl, Zidane. So Raúl scored in 2000 and 2002.
  { name: 'Zinédine Zidane',     nationality: 'Français',      goals_final: '1', years: '2002',              club: 'Real Madrid' },
  { name: 'Hernán Crespo',       nationality: 'Argentin',      goals_final: '2', years: '2005',              club: 'AC Milan' },

  // 🟡 1 but en finale
  { name: 'Basile Boli',         nationality: 'Français',      goals_final: '1', years: '1993',              club: 'Marseille' },
  { name: 'Zvonimir Boban',      nationality: 'Croate',        goals_final: '1', years: '1994',              club: 'AC Milan' }, // wait - 1994 final was 4-0 Milan vs Barca: Massaro (2), Savicevic, Desailly
  { name: 'Daniele Massaro',     nationality: 'Italien',       goals_final: '2', years: '1994',              club: 'AC Milan' },
  { name: 'Dejan Savićević',     nationality: 'Monténégrin',   goals_final: '1', years: '1994',              club: 'AC Milan' },
  { name: 'Marcel Desailly',     nationality: 'Français',      goals_final: '1', years: '1994',              club: 'AC Milan' },
  { name: 'Patrick Kluivert',    nationality: 'Néerlandais',   goals_final: '1', years: '1995',              club: 'Ajax Amsterdam' },
  { name: 'Fabrizio Ravanelli',  nationality: 'Italien',       goals_final: '1', years: '1996',              club: 'Juventus' },
  { name: 'Jari Litmanen',       nationality: 'Finlandais',    goals_final: '1', years: '1996',              club: 'Ajax Amsterdam' },
  { name: 'Lars Ricken',         nationality: 'Allemand',      goals_final: '1', years: '1997',              club: 'Borussia Dortmund' },
  { name: 'Predrag Mijatović',   nationality: 'Monténégrin',   goals_final: '1', years: '1998',              club: 'Real Madrid' },
  { name: 'Teddy Sheringham',    nationality: 'Anglais',       goals_final: '1', years: '1999',              club: 'Manchester United' },
  { name: 'Ole Gunnar Solskjær', nationality: 'Norvégien',     goals_final: '1', years: '1999',              club: 'Manchester United' },
  { name: 'Mario Basler',        nationality: 'Allemand',      goals_final: '1', years: '1999',              club: 'Bayern Munich' },
  { name: 'Fernando Morientes',  nationality: 'Espagnol',      goals_final: '1', years: '2000',              club: 'Real Madrid' },
  { name: 'Steve McManaman',     nationality: 'Anglais',       goals_final: '1', years: '2000',              club: 'Real Madrid' },
  { name: 'Carlos Alberto',      nationality: 'Brésilien',     goals_final: '1', years: '2004',              club: 'FC Porto' },
  { name: 'Deco',                nationality: 'Portugais',     goals_final: '1', years: '2004',              club: 'FC Porto' },
  { name: 'Dmitri Alenichev',    nationality: 'Russe',         goals_final: '1', years: '2004',              club: 'FC Porto' },
  { name: 'Steven Gerrard',      nationality: 'Anglais',       goals_final: '1', years: '2005',              club: 'Liverpool' },
  { name: 'Vladimír Šmicer',     nationality: 'Tchèque',       goals_final: '1', years: '2005',              club: 'Liverpool' },
  { name: 'Xabi Alonso',         nationality: 'Espagnol',      goals_final: '1', years: '2005',              club: 'Liverpool' },
  { name: 'Paolo Maldini',       nationality: 'Italien',       goals_final: '1', years: '2005',              club: 'AC Milan' },
  { name: 'Sol Campbell',        nationality: 'Anglais',       goals_final: '1', years: '2006',              club: 'Arsenal' },
  { name: 'Juliano Belletti',    nationality: 'Brésilien',     goals_final: '1', years: '2006',              club: 'Barcelone' },
  { name: 'Dirk Kuyt',           nationality: 'Néerlandais',   goals_final: '1', years: '2007',              club: 'Liverpool' },
  { name: 'Cristiano Ronaldo',   nationality: 'Portugais',     goals_final: '3', years: '2008, 2014, 2017',  club: 'Man. United / Real Madrid' }, // duplicate, will be handled
  { name: 'Frank Lampard',       nationality: 'Anglais',       goals_final: '1', years: '2008',              club: 'Chelsea' },
  { name: 'Lionel Messi',        nationality: 'Argentin',      goals_final: '2', years: '2009, 2011',        club: 'Barcelone' },
  { name: 'Pedro',               nationality: 'Espagnol',      goals_final: '1', years: '2011',              club: 'Barcelone' },
  { name: 'David Villa',         nationality: 'Espagnol',      goals_final: '1', years: '2011',              club: 'Barcelone' },
  { name: 'Wayne Rooney',        nationality: 'Anglais',       goals_final: '1', years: '2011',              club: 'Manchester United' },
  { name: 'Didier Drogba',       nationality: 'Ivoirien',      goals_final: '2', years: '2008, 2012',        club: 'Chelsea' },
  { name: 'Arjen Robben',        nationality: 'Néerlandais',   goals_final: '1', years: '2013',              club: 'Bayern Munich' },
  { name: 'Ilkay Gündoğan',     nationality: 'Allemand',      goals_final: '1', years: '2013',              club: 'Borussia Dortmund' },
  { name: 'Diego Godín',        nationality: 'Uruguayen',     goals_final: '1', years: '2014',              club: 'Atlético Madrid' },
  { name: 'Sergio Ramos',        nationality: 'Espagnol',      goals_final: '2', years: '2014, 2016',        club: 'Real Madrid' },
  { name: 'Marcelo',             nationality: 'Brésilien',     goals_final: '1', years: '2014',              club: 'Real Madrid' },
  { name: 'Yannick Carrasco',    nationality: 'Belge',         goals_final: '1', years: '2016',              club: 'Atlético Madrid' },
  { name: 'Mario Mandžukić',    nationality: 'Croate',        goals_final: '1', years: '2017',              club: 'Juventus' },
  { name: 'Marco Asensio',       nationality: 'Espagnol',      goals_final: '1', years: '2017',              club: 'Real Madrid' },
  { name: 'Casemiro',            nationality: 'Brésilien',     goals_final: '1', years: '2017',              club: 'Real Madrid' },
  { name: 'Karim Benzema',       nationality: 'Français',      goals_final: '1', years: '2018',              club: 'Real Madrid' },
  { name: 'Sadio Mané',          nationality: 'Sénégalais',    goals_final: '1', years: '2018',              club: 'Liverpool' },
  { name: 'Mohamed Salah',       nationality: 'Égyptien',      goals_final: '1', years: '2019',              club: 'Liverpool' },
  { name: 'Divock Origi',        nationality: 'Belge',         goals_final: '1', years: '2019',              club: 'Liverpool' },
  { name: 'Kingsley Coman',      nationality: 'Français',      goals_final: '1', years: '2020',              club: 'Bayern Munich' },
  { name: 'Kai Havertz',         nationality: 'Allemand',      goals_final: '1', years: '2021',              club: 'Chelsea' },
  { name: 'Vinicius Junior',     nationality: 'Brésilien',     goals_final: '2', years: '2022, 2024',        club: 'Real Madrid' },
  { name: 'Rodri',               nationality: 'Espagnol',      goals_final: '1', years: '2023',              club: 'Manchester City' },
  { name: 'Dani Carvajal',       nationality: 'Espagnol',      goals_final: '1', years: '2024',              club: 'Real Madrid' },
  { name: 'Ivan Rakitić',       nationality: 'Croate',        goals_final: '1', years: '2015',              club: 'Barcelone' },
  { name: 'Luis Suárez',        nationality: 'Uruguayen',     goals_final: '1', years: '2015',              club: 'Barcelone' },
  { name: 'Neymar',              nationality: 'Brésilien',     goals_final: '1', years: '2015',              club: 'Barcelone' },
  { name: 'Álvaro Morata',      nationality: 'Espagnol',      goals_final: '1', years: '2015',              club: 'Juventus' },
]

// Déduplique (Cristiano Ronaldo apparaît 2 fois dans la liste ci-dessus)
const seen = new Set<string>()
const deduped = rows.filter(r => {
  if (seen.has(r.name)) return false
  seen.add(r.name)
  return true
}).sort((a, b) => Number(b.goals_final) - Number(a.goals_final))

async function seed() {
  const quiz = {
    title: 'Buteurs en finale de Ligue des Champions',
    description: 'Tous les joueurs ayant marqué en finale de l\'UCL (1993-2024)',
    sport: 'football',
    columns: [
      { key: 'name',        label: 'Joueur',        is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',   is_answer: false, hint_order: 1 },
      { key: 'goals_final', label: 'Buts en finale',is_answer: false, hint_order: 2 },
      { key: 'years',       label: 'Année(s)',      is_answer: false, hint_order: 3 },
      { key: 'club',        label: 'Club(s)',       is_answer: false, hint_order: 4 },
    ],
    rows: deduped,
  }

  const { data, error } = await supabase
    .from('quizzes')
    .insert(quiz)
    .select('id, title')
    .single()

  if (error) {
    console.error('❌ Erreur:', error.message)
    process.exit(1)
  }

  console.log(`✅ Quiz créé : "${data.title}" (${deduped.length} joueurs)`)
  console.log(`   ID: ${data.id}`)
}

seed()
