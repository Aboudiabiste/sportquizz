/**
 * Seed : Champions du Monde de cyclisme sur route (1996–2024)
 * Run : npx tsx db/seeds/champions-monde-cyclisme.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const rows = [
  { year: '1996', winner: 'Johan Museeuw',          nationality: 'Belge',         team_pro: 'Mapei',                  lieu: 'Lugano (Suisse)' },
  { year: '1997', winner: 'Laurent Brochard',        nationality: 'Français',      team_pro: 'Festina',                lieu: 'San Sebastián (Espagne)' },
  { year: '1998', winner: 'Oskar Camenzind',         nationality: 'Suisse',        team_pro: 'Mapei',                  lieu: 'Valkenburg (Pays-Bas)' },
  { year: '1999', winner: 'Oscar Freire',            nationality: 'Espagnol',      team_pro: 'Vitalicio Seguros',      lieu: 'Vérone (Italie)' },
  { year: '2000', winner: 'Romans Vainšteins',       nationality: 'Letton',        team_pro: 'Mapei',                  lieu: 'Plouay (France)' },
  { year: '2001', winner: 'Oscar Freire',            nationality: 'Espagnol',      team_pro: 'Mapei',                  lieu: 'Lisbonne (Portugal)' },
  { year: '2002', winner: 'Mario Cipollini',         nationality: 'Italien',       team_pro: 'Acqua & Sapone',         lieu: 'Zolder (Belgique)' },
  { year: '2003', winner: 'Igor Astarloa',           nationality: 'Espagnol',      team_pro: 'Cofidis',                lieu: 'Hamilton (Canada)' },
  { year: '2004', winner: 'Oscar Freire',            nationality: 'Espagnol',      team_pro: 'Rabobank',               lieu: 'Vérone (Italie)' },
  { year: '2005', winner: 'Tom Boonen',              nationality: 'Belge',         team_pro: 'Quick Step',             lieu: 'Madrid (Espagne)' },
  { year: '2006', winner: 'Paolo Bettini',           nationality: 'Italien',       team_pro: 'Quick Step',             lieu: 'Salzbourg (Autriche)' },
  { year: '2007', winner: 'Paolo Bettini',           nationality: 'Italien',       team_pro: 'Quick Step',             lieu: 'Stuttgart (Allemagne)' },
  { year: '2008', winner: 'Alessandro Ballan',       nationality: 'Italien',       team_pro: 'Lampre',                 lieu: 'Varèse (Italie)' },
  { year: '2009', winner: 'Cadel Evans',             nationality: 'Australien',    team_pro: 'Silence-Lotto',          lieu: 'Mendrisio (Suisse)' },
  { year: '2010', winner: 'Thor Hushovd',            nationality: 'Norvégien',     team_pro: 'Cervelo',                lieu: 'Melbourne (Australie)' },
  { year: '2011', winner: 'Mark Cavendish',          nationality: 'Britannique',   team_pro: 'HTC-Highroad',           lieu: 'Copenhague (Danemark)' },
  { year: '2012', winner: 'Philippe Gilbert',        nationality: 'Belge',         team_pro: 'BMC Racing',             lieu: 'Valkenburg (Pays-Bas)' },
  { year: '2013', winner: 'Rui Costa',               nationality: 'Portugais',     team_pro: 'Movistar',               lieu: 'Florence (Italie)' },
  { year: '2014', winner: 'Michał Kwiatkowski',      nationality: 'Polonais',      team_pro: 'Omega Pharma-QS',        lieu: 'Ponferrada (Espagne)' },
  { year: '2015', winner: 'Peter Sagan',             nationality: 'Slovaque',      team_pro: 'Tinkoff-Saxo',           lieu: 'Richmond (États-Unis)' },
  { year: '2016', winner: 'Peter Sagan',             nationality: 'Slovaque',      team_pro: 'Tinkoff',                lieu: 'Doha (Qatar)' },
  { year: '2017', winner: 'Peter Sagan',             nationality: 'Slovaque',      team_pro: 'Bora-Hansgrohe',         lieu: 'Bergen (Norvège)' },
  { year: '2018', winner: 'Alejandro Valverde',      nationality: 'Espagnol',      team_pro: 'Movistar',               lieu: 'Innsbruck (Autriche)' },
  { year: '2019', winner: 'Mads Pedersen',           nationality: 'Danois',        team_pro: 'Trek-Segafredo',         lieu: 'Harrogate (Angleterre)' },
  { year: '2020', winner: 'Julian Alaphilippe',      nationality: 'Français',      team_pro: 'Deceuninck-Quick Step',  lieu: 'Imola (Italie)' },
  { year: '2021', winner: 'Julian Alaphilippe',      nationality: 'Français',      team_pro: 'Deceuninck-Quick Step',  lieu: 'Louvain (Belgique)' },
  { year: '2022', winner: 'Remco Evenepoel',         nationality: 'Belge',         team_pro: 'Quick-Step Alpha Vinyl',  lieu: 'Wollongong (Australie)' },
  { year: '2023', winner: 'Mathieu van der Poel',    nationality: 'Néerlandais',   team_pro: 'Alpecin-Deceuninck',     lieu: 'Glasgow (Écosse)' },
  { year: '2024', winner: 'Tadej Pogačar',           nationality: 'Slovène',       team_pro: 'UAE Team Emirates',      lieu: 'Zurich (Suisse)' },
]

async function seed() {
  const quiz = {
    title: 'Champions du Monde cyclisme',
    description: '1996–2024 · Maillots arc-en-ciel sur route',
    sport: 'cyclisme',
    columns: [
      { key: 'year',        label: 'Année',        is_answer: false, hint_order: 0 },
      { key: 'winner',      label: 'Champion',     is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 2 },
      { key: 'team_pro',    label: 'Équipe pro',   is_answer: false, hint_order: 3 },
      { key: 'lieu',        label: 'Lieu',         is_answer: false, hint_order: 4 },
    ],
    rows,
  }
  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}
seed()
