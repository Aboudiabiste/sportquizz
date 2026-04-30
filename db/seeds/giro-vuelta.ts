/**
 * Seed : Vainqueurs Giro d'Italia + Vuelta a España (1996–2024)
 * Run : npx tsx db/seeds/giro-vuelta.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const giroRows = [
  { year: '1996', winner: 'Pavel Tonkov',         nationality: 'Russe',          team: 'Mapei' },
  { year: '1997', winner: 'Ivan Gotti',            nationality: 'Italien',        team: 'Saeco' },
  { year: '1998', winner: 'Marco Pantani',         nationality: 'Italien',        team: 'Mercatone Uno' },
  { year: '1999', winner: 'Ivan Gotti',            nationality: 'Italien',        team: 'Saeco' },
  { year: '2000', winner: 'Stefano Garzelli',      nationality: 'Italien',        team: 'Mercatone Uno' },
  { year: '2001', winner: 'Gilberto Simoni',       nationality: 'Italien',        team: 'Lampre' },
  { year: '2002', winner: 'Paolo Savoldelli',      nationality: 'Italien',        team: 'Index-Alexia' },
  { year: '2003', winner: 'Gilberto Simoni',       nationality: 'Italien',        team: 'Saeco' },
  { year: '2004', winner: 'Damiano Cunego',        nationality: 'Italien',        team: 'Saeco' },
  { year: '2005', winner: 'Paolo Savoldelli',      nationality: 'Italien',        team: 'Discovery Channel' },
  { year: '2006', winner: 'Ivan Basso',            nationality: 'Italien',        team: 'CSC' },
  { year: '2007', winner: 'Danilo Di Luca',        nationality: 'Italien',        team: 'LPR' },
  { year: '2008', winner: 'Alberto Contador',      nationality: 'Espagnol',       team: 'Astana' },
  { year: '2009', winner: 'Denis Menchov',         nationality: 'Russe',          team: 'Rabobank' },
  { year: '2010', winner: 'Ivan Basso',            nationality: 'Italien',        team: 'Liquigas' },
  { year: '2011', winner: 'Michele Scarponi',      nationality: 'Italien',        team: 'Lampre' },
  { year: '2012', winner: 'Ryder Hesjedal',        nationality: 'Canadien',       team: 'Garmin-Barracuda' },
  { year: '2013', winner: 'Vincenzo Nibali',       nationality: 'Italien',        team: 'Astana' },
  { year: '2014', winner: 'Nairo Quintana',        nationality: 'Colombien',      team: 'Movistar' },
  { year: '2015', winner: 'Alberto Contador',      nationality: 'Espagnol',       team: 'Tinkoff-Saxo' },
  { year: '2016', winner: 'Vincenzo Nibali',       nationality: 'Italien',        team: 'Astana' },
  { year: '2017', winner: 'Tom Dumoulin',          nationality: 'Néerlandais',    team: 'Sunweb' },
  { year: '2018', winner: 'Chris Froome',          nationality: 'Britannique',    team: 'Sky' },
  { year: '2019', winner: 'Richard Carapaz',       nationality: 'Équatorien',     team: 'Movistar' },
  { year: '2020', winner: 'Tao Geoghegan Hart',    nationality: 'Britannique',    team: 'Ineos Grenadiers' },
  { year: '2021', winner: 'Egan Bernal',           nationality: 'Colombien',      team: 'Ineos Grenadiers' },
  { year: '2022', winner: 'Jai Hindley',           nationality: 'Australien',     team: 'Bora-Hansgrohe' },
  { year: '2023', winner: 'Primož Roglič',         nationality: 'Slovène',        team: 'Jumbo-Visma' },
  { year: '2024', winner: 'Tadej Pogačar',         nationality: 'Slovène',        team: 'UAE Team Emirates' },
]

const vueltaRows = [
  { year: '1996', winner: 'Alex Zülle',            nationality: 'Suisse',         team: 'ONCE' },
  { year: '1997', winner: 'Alex Zülle',            nationality: 'Suisse',         team: 'ONCE' },
  { year: '1998', winner: 'Abraham Olano',         nationality: 'Espagnol',       team: 'Banesto' },
  { year: '1999', winner: 'Jan Ullrich',           nationality: 'Allemand',       team: 'Telekom' },
  { year: '2000', winner: 'Roberto Heras',         nationality: 'Espagnol',       team: 'Kelme' },
  { year: '2001', winner: 'Ángel Casero',          nationality: 'Espagnol',       team: 'Festina' },
  { year: '2002', winner: 'Aitor González',        nationality: 'Espagnol',       team: 'Kelme' },
  { year: '2003', winner: 'Roberto Heras',         nationality: 'Espagnol',       team: 'US Postal' },
  { year: '2004', winner: 'Roberto Heras',         nationality: 'Espagnol',       team: 'Liberty Seguros' },
  { year: '2005', winner: 'Denis Menchov',         nationality: 'Russe',          team: 'Rabobank' },
  { year: '2006', winner: 'Alexandre Vinokourov',  nationality: 'Kazakh',         team: 'Astana' },
  { year: '2007', winner: 'Denis Menchov',         nationality: 'Russe',          team: 'Rabobank' },
  { year: '2008', winner: 'Alberto Contador',      nationality: 'Espagnol',       team: 'Astana' },
  { year: '2009', winner: 'Alejandro Valverde',    nationality: 'Espagnol',       team: 'Caisse d\'Epargne' },
  { year: '2010', winner: 'Vincenzo Nibali',       nationality: 'Italien',        team: 'Liquigas' },
  { year: '2011', winner: 'Chris Froome',          nationality: 'Britannique',    team: 'Sky' },
  { year: '2012', winner: 'Alberto Contador',      nationality: 'Espagnol',       team: 'Saxo Bank' },
  { year: '2013', winner: 'Chris Horner',          nationality: 'Américain',      team: 'RadioShack' },
  { year: '2014', winner: 'Alberto Contador',      nationality: 'Espagnol',       team: 'Tinkoff-Saxo' },
  { year: '2015', winner: 'Fabio Aru',             nationality: 'Italien',        team: 'Astana' },
  { year: '2016', winner: 'Nairo Quintana',        nationality: 'Colombien',      team: 'Movistar' },
  { year: '2017', winner: 'Chris Froome',          nationality: 'Britannique',    team: 'Sky' },
  { year: '2018', winner: 'Simon Yates',           nationality: 'Britannique',    team: 'Mitchelton-Scott' },
  { year: '2019', winner: 'Primož Roglič',         nationality: 'Slovène',        team: 'Jumbo-Visma' },
  { year: '2020', winner: 'Primož Roglič',         nationality: 'Slovène',        team: 'Jumbo-Visma' },
  { year: '2021', winner: 'Primož Roglič',         nationality: 'Slovène',        team: 'Jumbo-Visma' },
  { year: '2022', winner: 'Remco Evenepoel',       nationality: 'Belge',          team: 'Quick-Step Alpha Vinyl' },
  { year: '2023', winner: 'Sepp Kuss',             nationality: 'Américain',      team: 'Jumbo-Visma' },
  { year: '2024', winner: 'Primož Roglič',         nationality: 'Slovène',        team: 'Red Bull-Bora-Hansgrohe' },
]

const columns = [
  { key: 'year',        label: 'Année',        is_answer: false, hint_order: 0 },
  { key: 'winner',      label: 'Vainqueur',    is_answer: true,  hint_order: 1 },
  { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 2 },
  { key: 'team',        label: 'Équipe',       is_answer: false, hint_order: 3 },
]

async function seed() {
  for (const [title, description, rows] of [
    ['Vainqueurs du Giro d\'Italia (1996–2024)', 'Tour d\'Italie — lauréats depuis 1996', giroRows],
    ['Vainqueurs de la Vuelta a España (1996–2024)', 'Tour d\'Espagne — lauréats depuis 1996', vueltaRows],
  ] as [string, string, typeof giroRows][]) {
    const quiz = { title, description, sport: 'cyclisme', columns, rows }
    const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
    if (error) { console.error(`❌ ${title}:`, error.message) }
    else console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
  }
}

seed()
