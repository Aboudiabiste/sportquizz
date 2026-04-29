/**
 * Seed : Joueurs ayant gagné la LDC avec 2+ clubs différents
 * Run : npx tsx db/seeds/ldh-multi-clubs.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { name: 'Cristiano Ronaldo',  nationality: 'Portugais',   clubs: 'Man. United (2008), Real Madrid (2014, 2016, 2017, 2018)', titles: '4' },
  { name: 'Samuel Eto\'o',      nationality: 'Camerounais', clubs: 'Barcelone (2006, 2009), Inter Milan (2010)',                titles: '3' },
  { name: 'Clarence Seedorf',   nationality: 'Néerlandais', clubs: 'Ajax (1995), Real Madrid (1998), AC Milan (2003, 2007)',    titles: '4' },
  { name: 'Didier Deschamps',   nationality: 'Français',    clubs: 'Marseille (1993), Juventus (1996), Chelsea (2012 – staff)', titles: '2' },
  { name: 'Marcel Desailly',    nationality: 'Français',    clubs: 'Marseille (1993), AC Milan (1994)',                        titles: '2' },
  { name: 'Paulo Sousa',        nationality: 'Portugais',   clubs: 'Juventus (1996), Borussia Dortmund (1997)',                titles: '2' },
  { name: 'Stéphane Chapuisat', nationality: 'Suisse',      clubs: 'Borussia Dortmund (1997)',                                 titles: '1' },
  { name: 'Gerard Piqué',       nationality: 'Espagnol',    clubs: 'Manchester United (2008), Barcelone (2009, 2011, 2015)',   titles: '4' },
  { name: 'Xabi Alonso',        nationality: 'Espagnol',    clubs: 'Liverpool (2005), Real Madrid (2014)',                    titles: '2' },
  { name: 'Carlos Alberto',     nationality: 'Brésilien',   clubs: 'FC Porto (2004), Barcelone (2006)',                       titles: '2' },
  { name: 'Zlatan Ibrahimović', nationality: 'Suédois',     clubs: 'Ajax (2002-sf), Barcelone (2009)',                        titles: '1' },
  { name: 'Emerson',            nationality: 'Brésilien',   clubs: 'Juventus (2003-f), Real Madrid (2014)',                   titles: '1' },
  { name: 'Pepe',               nationality: 'Portugais',   clubs: 'Real Madrid (2014, 2016, 2017, 2018)',                    titles: '4' },
]

// Garde uniquement ceux avec 2+ clubs distincts
const multiClub = rows.filter(r => r.clubs.split('),').length >= 2)

async function seed() {
  const quiz = {
    title: 'Joueurs vainqueurs de la LDC avec 2+ clubs',
    description: 'Les joueurs rares ayant soulevé la coupe aux grandes oreilles avec plusieurs clubs',
    sport: 'football',
    columns: [
      { key: 'name',        label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'titles',      label: 'Nb de titres', is_answer: false, hint_order: 2 },
      { key: 'clubs',       label: 'Club(s) et année(s)', is_answer: false, hint_order: 3 },
    ],
    rows: multiClub,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${multiClub.length} joueurs) — ID: ${data.id}`)
}

seed()
