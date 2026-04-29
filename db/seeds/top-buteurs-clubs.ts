/**
 * Seed : Top buteurs all-time des grands clubs européens
 * Run : npx tsx db/seeds/top-buteurs-clubs.ts
 * Génère un quiz par club (7 clubs)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CLUBS: { name: string; sport: string; players: { name: string; nationality: string; goals: string; period: string }[] }[] = [
  {
    name: 'Real Madrid',
    sport: 'football',
    players: [
      { name: 'Cristiano Ronaldo', nationality: 'Portugais',   goals: '450', period: '2009–2018' },
      { name: 'Raúl',             nationality: 'Espagnol',    goals: '323', period: '1994–2010' },
      { name: 'Karim Benzema',    nationality: 'Français',    goals: '354', period: '2009–2023' },
      { name: 'Alfredo Di Stéfano', nationality: 'Argentin', goals: '308', period: '1953–1964' },
      { name: 'Hugo Sánchez',     nationality: 'Mexicain',    goals: '208', period: '1985–1992' },
      { name: 'Fernando Morientes', nationality: 'Espagnol',  goals: '152', period: '1997–2005' },
      { name: 'Roberto Carlos',   nationality: 'Brésilien',   goals: '71',  period: '1996–2007' },
      { name: 'Iker Casillas',    nationality: 'Espagnol',    goals: '0',   period: '1999–2015' },
    ],
  },
  {
    name: 'FC Barcelone',
    sport: 'football',
    players: [
      { name: 'Lionel Messi',     nationality: 'Argentin',    goals: '672', period: '2004–2021' },
      { name: 'César Rodriguez',  nationality: 'Espagnol',    goals: '232', period: '1942–1955' },
      { name: 'Laszlo Kubala',    nationality: 'Hongrois',    goals: '194', period: '1951–1961' },
      { name: 'Johan Cruyff',     nationality: 'Néerlandais', goals: '185', period: '1973–1978' },
      { name: 'Samuel Eto\'o',    nationality: 'Camerounais', goals: '130', period: '2004–2009' },
      { name: 'Ronaldo',          nationality: 'Brésilien',   goals: '47',  period: '1996–1997' },
      { name: 'Ronaldinho',       nationality: 'Brésilien',   goals: '94',  period: '2003–2008' },
      { name: 'David Villa',      nationality: 'Espagnol',    goals: '23',  period: '2010–2013' },
    ],
  },
  {
    name: 'PSG',
    sport: 'football',
    players: [
      { name: 'Edinson Cavani',   nationality: 'Uruguayen',   goals: '200', period: '2013–2020' },
      { name: 'Kylian Mbappé',    nationality: 'Français',    goals: '256', period: '2017–2024' },
      { name: 'Zlatan Ibrahimović', nationality: 'Suédois',   goals: '156', period: '2012–2016' },
      { name: 'Pauleta',          nationality: 'Portugais',   goals: '109', period: '2003–2008' },
      { name: 'Neymar',           nationality: 'Brésilien',   goals: '118', period: '2017–2023' },
      { name: 'Carlos Bianchi',   nationality: 'Argentin',    goals: '101', period: '1977–1980' },
      { name: 'Rai',              nationality: 'Brésilien',   goals: '69',  period: '1993–1998' },
      { name: 'Lionel Messi',     nationality: 'Argentin',    goals: '32',  period: '2021–2023' },
    ],
  },
  {
    name: 'Olympique de Marseille',
    sport: 'football',
    players: [
      { name: 'Gunnar Andersson', nationality: 'Suédois',     goals: '186', period: '1949–1961' },
      { name: 'Josip Skoblar',    nationality: 'Yougoslave',  goals: '152', period: '1966–1974' },
      { name: 'Didier Drogba',    nationality: 'Ivoirien',    goals: '85',  period: '2003–2004 / passé par OM' },
      { name: 'Samir Nasri',      nationality: 'Français',    goals: '22',  period: '2004–2008' },
      { name: 'Mamadou Niang',    nationality: 'Sénégalais',  goals: '75',  period: '2006–2010' },
      { name: 'Lorik Cana',       nationality: 'Albanais',    goals: '10',  period: '2008–2010' },
      { name: 'Florian Thauvin',  nationality: 'Français',    goals: '100', period: '2013–2021' },
      { name: 'Dario Benedetto',  nationality: 'Argentin',    goals: '23',  period: '2019–2021' },
    ],
  },
  {
    name: 'Bayern Munich',
    sport: 'football',
    players: [
      { name: 'Gerd Müller',      nationality: 'Allemand',    goals: '566', period: '1964–1979' },
      { name: 'Robert Lewandowski', nationality: 'Polonais',  goals: '344', period: '2014–2022' },
      { name: 'Karl-Heinz Rummenigge', nationality: 'Allemand', goals: '217', period: '1974–1984' },
      { name: 'Thomas Müller',    nationality: 'Allemand',    goals: '250', period: '2008–présent' },
      { name: 'Jupp Heynckes',    nationality: 'Allemand',    goals: '195', period: '1970–1979' },
      { name: 'Franck Ribéry',    nationality: 'Français',    goals: '124', period: '2007–2019' },
      { name: 'Arjen Robben',     nationality: 'Néerlandais', goals: '144', period: '2009–2019' },
      { name: 'Oliver Kahn',      nationality: 'Allemand',    goals: '0',   period: '1994–2008' },
    ],
  },
  {
    name: 'Liverpool FC',
    sport: 'football',
    players: [
      { name: 'Ian Rush',         nationality: 'Gallois',     goals: '346', period: '1980–1996' },
      { name: 'Roger Hunt',       nationality: 'Anglais',     goals: '285', period: '1959–1969' },
      { name: 'Gordon Hodgson',   nationality: 'Sud-Africain', goals: '241', period: '1925–1936' },
      { name: 'Robbie Fowler',    nationality: 'Anglais',     goals: '183', period: '1993–2007' },
      { name: 'Steven Gerrard',   nationality: 'Anglais',     goals: '186', period: '1998–2015' },
      { name: 'Mohamed Salah',    nationality: 'Égyptien',    goals: '230', period: '2017–présent' },
      { name: 'Michael Owen',     nationality: 'Anglais',     goals: '158', period: '1997–2004' },
      { name: 'Dirk Kuyt',        nationality: 'Néerlandais', goals: '71',  period: '2006–2012' },
    ],
  },
  {
    name: 'Juventus FC',
    sport: 'football',
    players: [
      { name: 'Alessandro Del Piero', nationality: 'Italien', goals: '290', period: '1993–2012' },
      { name: 'Giampiero Boniperti', nationality: 'Italien',  goals: '182', period: '1946–1961' },
      { name: 'Cristiano Ronaldo', nationality: 'Portugais',  goals: '101', period: '2018–2021' },
      { name: 'Filippo Inzaghi',  nationality: 'Italien',     goals: '89',  period: '1997–2001' },
      { name: 'David Trezeguet',  nationality: 'Français',    goals: '171', period: '2000–2010' },
      { name: 'Michel Platini',   nationality: 'Français',    goals: '104', period: '1982–1987' },
      { name: 'Pavel Nedvěd',     nationality: 'Tchèque',     goals: '58',  period: '2001–2009' },
      { name: 'Zlatan Ibrahimović', nationality: 'Suédois',   goals: '26',  period: '2004–2006 / 2010–2012' },
    ],
  },
]

async function seed() {
  for (const club of CLUBS) {
    const quiz = {
      title: `Top buteurs all-time — ${club.name}`,
      description: `Les meilleurs buteurs de l'histoire du club`,
      sport: club.sport,
      columns: [
        { key: 'name',        label: 'Joueur',       is_answer: true,  hint_order: 0 },
        { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
        { key: 'goals',       label: 'Buts',         is_answer: false, hint_order: 2 },
        { key: 'period',      label: 'Période',      is_answer: false, hint_order: 3 },
      ],
      rows: club.players.sort((a, b) => Number(b.goals) - Number(a.goals)),
    }

    const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
    if (error) { console.error(`❌ ${club.name}:`, error.message) }
    else console.log(`✅ "${data.title}" (${club.players.length} joueurs) — ID: ${data.id}`)
  }
}

seed()
