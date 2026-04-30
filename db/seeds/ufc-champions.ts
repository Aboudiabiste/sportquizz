/**
 * Seed : Champions UFC emblématiques all-time
 * Run : npx tsx db/seeds/ufc-champions.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { name: 'Jon Jones',              category: 'Lourds-Légers (205 lbs)',   country: 'Américain',    defenses: '13', era: '2011–2023', note: 'GOAT débattu, invaincu en LHW, a monté en Lourds' },
  { name: 'Anderson Silva',         category: 'Poids Moyens (185 lbs)',    country: 'Brésilien',    defenses: '10', era: '2006–2013', note: 'Record de défenses MW, carrière légendaire' },
  { name: 'Demetrious Johnson',     category: 'Moucherons (125 lbs)',      country: 'Américain',    defenses: '11', era: '2012–2018', note: 'Record de défenses consécutives UFC' },
  { name: 'Georges St-Pierre',      category: 'Mi-Moyens (170 lbs)',       country: 'Canadien',     defenses: '9',  era: '2006–2013', note: 'GOAT WW, retraite invaincue puis retour' },
  { name: 'Khabib Nurmagomedov',    category: 'Poids Légers (155 lbs)',    country: 'Russe',        defenses: '3',  era: '2018–2020', note: '29-0, invaincu, retraité en larmes après son père' },
  { name: 'Jose Aldo',              category: 'Plumes (145 lbs)',          country: 'Brésilien',    defenses: '7',  era: '2011–2015', note: 'Invaincu 10 ans avant KO McGregor en 13 secondes' },
  { name: 'Amanda Nunes',           category: 'Coqs féminins (135 lbs)',   country: 'Brésilienne',  defenses: '9',  era: '2016–2022', note: 'Double championne BW + FW, a battu Rousey et Cyborg' },
  { name: 'Ronda Rousey',           category: 'Coqs féminins (135 lbs)',   country: 'Américaine',   defenses: '6',  era: '2012–2015', note: 'Pionnière, a révolutionné le MMA féminin' },
  { name: 'Valentina Shevchenko',   category: 'Mouches féminines (125 lbs)', country: 'Kirghize',   defenses: '7',  era: '2018–2023', note: '7 défenses consécutives, technique absolue' },
  { name: 'Conor McGregor',         category: 'Plumes + Légers',           country: 'Irlandais',    defenses: '1',  era: '2015–2016', note: 'Double champion FW + LW en simultané, star planétaire' },
  { name: 'Islam Makhachev',        category: 'Poids Légers (155 lbs)',    country: 'Russe',        defenses: '4',  era: '2022–présent', note: 'Héritier de Khabib, champion dominant' },
  { name: 'Alex Pereira',           category: 'Poids Moyens + LHL',       country: 'Brésilien',    defenses: '5',  era: '2022–présent', note: 'Double champion MW + LHW, KO artiste, ancien champion K-1' },
  { name: 'Israel Adesanya',        category: 'Poids Moyens (185 lbs)',    country: 'Néo-Zélandais',defenses: '5',  era: '2019–2023', note: 'Styliste élégant, champion deux fois, rival de Pereira' },
  { name: 'Max Holloway',           category: 'Plumes (145 lbs)',          country: 'Américain',    defenses: '3',  era: '2016–2019', note: 'Combattant de l\'année, invaincu 13 combats' },
  { name: 'Matt Hughes',            category: 'Mi-Moyens (170 lbs)',       country: 'Américain',    defenses: '6',  era: '2001–2006', note: 'Pionnier WW, dominé par le wrestling' },
  { name: 'Chuck Liddell',          category: 'Lourds-Légers (205 lbs)',   country: 'Américain',    defenses: '4',  era: '2004–2007', note: 'Icône du LHW des années 2000, KO power' },
  { name: 'Randy Couture',          category: 'Lourds + Lourds-Légers',   country: 'Américain',    defenses: '4',  era: '1997–2008', note: '5 titres dans 2 catégories, champion à 40 ans' },
  { name: 'Stipe Miocic',           category: 'Poids Lourds (265 lbs)',    country: 'Américain',    defenses: '3',  era: '2016–2021', note: 'Champion HW le plus longtemps, a battu DC deux fois' },
  { name: 'Daniel Cormier',         category: 'Lourds + Lourds-Légers',   country: 'Américain',    defenses: '4',  era: '2015–2019', note: 'Double champion LHW + HW, seule défaite vs Jones' },
  { name: 'Francis Ngannou',        category: 'Poids Lourds (265 lbs)',    country: 'Camerounais',  defenses: '2',  era: '2021–2023', note: 'Frappe la plus puissante de l\'histoire, légende africaine' },
  { name: 'TJ Dillashaw',           category: 'Poids Coqs (135 lbs)',      country: 'Américain',    defenses: '4',  era: '2014–2019', note: 'Double règne, technique de GSP des coqs' },
  { name: 'Dominick Cruz',          category: 'Poids Coqs (135 lbs)',      country: 'Américain',    defenses: '4',  era: '2010–2016', note: 'Mouvement unique, invaincu 11 combats' },
  { name: 'BJ Penn',                category: 'Légers + Mi-Moyens',       country: 'Américain',    defenses: '3',  era: '2004–2010', note: 'Prodigy — champion dans 2 catégories différentes' },
  { name: 'Ciryl Gane',             category: 'Poids Lourds (265 lbs)',    country: 'Français',     defenses: '1',  era: '2021–présent', note: 'Fierté française, finaliste UFC — technique hors norme' },
  { name: 'Junior dos Santos',      category: 'Poids Lourds (265 lbs)',    country: 'Brésilien',    defenses: '2',  era: '2011–2013', note: 'Boxeur hors-pair, a KO Cain Velasquez en 64 secondes' },
  { name: 'Royce Gracie',           category: 'Poids Toutes Catégories',  country: 'Brésilien',    defenses: '—',  era: '1993–1994', note: 'Pionnier absolu, a gagné UFC 1-2-4 — Jiu-Jitsu au monde' },
  { name: 'Henry Cejudo',           category: 'Mouches + Coqs',           country: 'Américain',    defenses: '3',  era: '2018–2020', note: 'Triple C : champion olympique + champion UFC x2 catégories' },
]

const sorted = [...rows].sort((a, b) => {
  const da = a.defenses === '—' ? 0 : Number(a.defenses)
  const db = b.defenses === '—' ? 0 : Number(b.defenses)
  return db - da
})

async function seed() {
  const quiz = {
    title: 'Champions UFC emblématiques all-time',
    description: 'Les plus grands champions de l\'histoire de l\'Ultimate Fighting Championship',
    sport: 'mma',
    columns: [
      { key: 'name',      label: 'Combattant',          is_answer: true,  hint_order: 0 },
      { key: 'category',  label: 'Catégorie',           is_answer: false, hint_order: 1 },
      { key: 'country',   label: 'Nationalité',         is_answer: false, hint_order: 2 },
      { key: 'defenses',  label: 'Défenses de titre',   is_answer: false, hint_order: 3 },
      { key: 'era',       label: 'Période',             is_answer: false, hint_order: 4 },
      { key: 'note',      label: 'Pourquoi légendaire', is_answer: false, hint_order: 5 },
    ],
    rows: sorted,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${sorted.length} combattants) — ID: ${data.id}`)
}

seed()
