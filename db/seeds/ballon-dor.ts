/**
 * Seed : Palmarès Ballon d'Or (1996–2024)
 * Run : npx tsx db/seeds/ballon-dor.ts
 * Note : 2020 annulé (COVID)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1996', name: 'Ronaldo (R9)',       nationality: 'Brésilien',   club: 'FC Barcelone',        note: '1er Ballon d\'Or à 19 ans' },
  { year: '1997', name: 'Ronaldo (R9)',       nationality: 'Brésilien',   club: 'FC Barcelone / Inter',note: 'Blessures mais dominance absolue' },
  { year: '1998', name: 'Zinédine Zidane',   nationality: 'Français',    club: 'Juventus',            note: 'Champion du Monde avec les Bleus' },
  { year: '1999', name: 'Rivaldo',            nationality: 'Brésilien',   club: 'FC Barcelone',        note: 'MVP Liga + Copa del Rey' },
  { year: '2000', name: 'Luís Figo',          nationality: 'Portugais',   club: 'Real Madrid',         note: 'Transfert record Barça → Real' },
  { year: '2001', name: 'Michael Owen',       nationality: 'Anglais',     club: 'Liverpool',           note: 'Triplé coupe + Soulier d\'Or' },
  { year: '2002', name: 'Ronaldo (R9)',       nationality: 'Brésilien',   club: 'Real Madrid',         note: '3e Ballon d\'Or, 8 buts CM 2002' },
  { year: '2003', name: 'Pavel Nedvěd',       nationality: 'Tchèque',     club: 'Juventus',            note: 'Saison exceptionnelle, absent finale LDC' },
  { year: '2004', name: 'Andriy Shevchenko', nationality: 'Ukrainien',   club: 'AC Milan',            note: 'Meilleur buteur d\'Europe' },
  { year: '2005', name: 'Ronaldinho',         nationality: 'Brésilien',   club: 'FC Barcelone',        note: 'Meilleur joueur du monde, FIFA award aussi' },
  { year: '2006', name: 'Fabio Cannavaro',   nationality: 'Italien',     club: 'Real Madrid',         note: 'Champion du Monde, défenseur récompensé' },
  { year: '2007', name: 'Kaká',               nationality: 'Brésilien',   club: 'AC Milan',            note: 'Champion LDC, FIFA award aussi' },
  { year: '2008', name: 'Cristiano Ronaldo', nationality: 'Portugais',   club: 'Manchester United',   note: 'Champion PL + LDC, 42 buts' },
  { year: '2009', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: '1er Ballon d\'Or de Messi, Triplé Barça' },
  { year: '2010', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: 'Treble + 60 buts en année civile' },
  { year: '2011', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: '73 buts, saison historique' },
  { year: '2012', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: '91 buts en année civile, record absolu' },
  { year: '2013', name: 'Cristiano Ronaldo', nationality: 'Portugais',   club: 'Real Madrid',         note: '69 buts, champion Liga' },
  { year: '2014', name: 'Cristiano Ronaldo', nationality: 'Portugais',   club: 'Real Madrid',         note: 'Champion LDC (La Décima)' },
  { year: '2015', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: '5e Ballon d\'Or, Triplé Barça' },
  { year: '2016', name: 'Cristiano Ronaldo', nationality: 'Portugais',   club: 'Real Madrid',         note: 'Champion LDC + Euro avec le Portugal' },
  { year: '2017', name: 'Cristiano Ronaldo', nationality: 'Portugais',   club: 'Real Madrid',         note: '5e Ballon d\'Or, champion LDC x2' },
  { year: '2018', name: 'Luka Modrić',        nationality: 'Croate',      club: 'Real Madrid',         note: 'Champion LDC, finaliste CM — fin du duopole' },
  { year: '2019', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'FC Barcelone',        note: '6e Ballon d\'Or, meilleur buteur Liga' },
  { year: '2021', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'PSG',                 note: '7e Ballon d\'Or, champion Copa América 2021' },
  { year: '2022', name: 'Karim Benzema',      nationality: 'Français',    club: 'Real Madrid',         note: 'Champion LDC, Liga, 44 buts — réhabilitation' },
  { year: '2023', name: 'Lionel Messi',       nationality: 'Argentin',    club: 'Inter Miami',         note: '8e Ballon d\'Or, champion du Monde 2022' },
  { year: '2024', name: 'Rodri',              nationality: 'Espagnol',    club: 'Manchester City',     note: 'Champion d\'Europe, LdL, PL — polyvalence totale' },
]

async function seed() {
  const quiz = {
    title: 'Palmarès Ballon d\'Or (1996–2024)',
    description: 'Les lauréats du Ballon d\'Or depuis 1996 (2020 annulé)',
    sport: 'football',
    columns: [
      { key: 'year',        label: 'Année',       is_answer: false, hint_order: 0 },
      { key: 'name',        label: 'Lauréat',     is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 2 },
      { key: 'club',        label: 'Club',        is_answer: false, hint_order: 3 },
      { key: 'note',        label: 'Pourquoi',    is_answer: false, hint_order: 4 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}

seed()
