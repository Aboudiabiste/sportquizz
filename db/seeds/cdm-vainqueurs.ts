/**
 * Seed : Vainqueurs de la Coupe du Monde FIFA (1930–2022)
 * Run : npx tsx db/seeds/cdm-vainqueurs.ts
 * Note : 1950 sans finale officielle — match décisif Uruguay 2-1 Brésil (Maracanazo)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1930', winner: 'Uruguay',               finalist: 'Argentine',              host: 'Uruguay',          score: '4-2',               note: '1ère Coupe du Monde de l\'histoire' },
  { year: '1934', winner: 'Italie',                finalist: 'Tchécoslovaquie',        host: 'Italie',           score: '2-1 (AP)',           note: 'Mussolini au pouvoir — pression politique' },
  { year: '1938', winner: 'Italie',                finalist: 'Hongrie',                host: 'France',           score: '4-2',               note: '2e titre consécutif pour l\'Italie' },
  { year: '1950', winner: 'Uruguay',               finalist: 'Brésil',                 host: 'Brésil',           score: '2-1',               note: 'Maracanazo — pas de finale, match décisif au Maracanã' },
  { year: '1954', winner: 'Allemagne de l\'Ouest', finalist: 'Hongrie',                host: 'Suisse',           score: '3-2',               note: 'Miracle de Berne — Hongrie imbattable en 4 ans, battue en finale' },
  { year: '1958', winner: 'Brésil',                finalist: 'Suède',                  host: 'Suède',            score: '5-2',               note: 'Pelé à 17 ans — 2 buts en finale' },
  { year: '1962', winner: 'Brésil',                finalist: 'Tchécoslovaquie',        host: 'Chili',            score: '3-1',               note: '2e titre consécutif pour le Brésil' },
  { year: '1966', winner: 'Angleterre',            finalist: 'Allemagne de l\'Ouest',  host: 'Angleterre',       score: '4-2 (AP)',           note: 'But fantôme de Hurst — unique titre anglais' },
  { year: '1970', winner: 'Brésil',                finalist: 'Italie',                 host: 'Mexique',          score: '4-1',               note: '3e titre Brésil — conserve la Coupe Jules Rimet définitivement' },
  { year: '1974', winner: 'Allemagne de l\'Ouest', finalist: 'Pays-Bas',               host: 'Allemagne',        score: '2-1',               note: 'Football total néerlandais battu en finale' },
  { year: '1978', winner: 'Argentine',             finalist: 'Pays-Bas',               host: 'Argentine',        score: '3-1 (AP)',           note: '1er titre argentin sous la dictature militaire' },
  { year: '1982', winner: 'Italie',                finalist: 'Allemagne de l\'Ouest',  host: 'Espagne',          score: '3-1',               note: 'Paolo Rossi — 6 buts après avoir failli être exclu pour paris' },
  { year: '1986', winner: 'Argentine',             finalist: 'Allemagne de l\'Ouest',  host: 'Mexique',          score: '3-2',               note: 'Maradona — "la main de Dieu" + but du siècle' },
  { year: '1990', winner: 'Allemagne de l\'Ouest', finalist: 'Argentine',              host: 'Italie',           score: '1-0',               note: 'Pénalty controversé de Brehme — dernier titre Allemagne de l\'Ouest' },
  { year: '1994', winner: 'Brésil',                finalist: 'Italie',                 host: 'États-Unis',       score: '0-0 (AP) (3-2 tab)', note: 'Baggio rate le pénalty décisif — 4e titre brésilien' },
  { year: '1998', winner: 'France',                finalist: 'Brésil',                 host: 'France',           score: '3-0',               note: 'Zidane doublé de la tête — 1er et unique titre français à domicile' },
  { year: '2002', winner: 'Brésil',                finalist: 'Allemagne',              host: 'Corée/Japon',      score: '2-0',               note: 'Ronaldo R9 — 8 buts, rédemption après 1998' },
  { year: '2006', winner: 'Italie',                finalist: 'France',                 host: 'Allemagne',        score: '1-1 (AP) (5-3 tab)', note: 'Zidane expulsé — coup de tête sur Materazzi' },
  { year: '2010', winner: 'Espagne',               finalist: 'Pays-Bas',               host: 'Afrique du Sud',   score: '1-0 (AP)',           note: 'Iniesta — 1er titre espagnol, tiki-taka au sommet' },
  { year: '2014', winner: 'Allemagne',             finalist: 'Argentine',              host: 'Brésil',           score: '1-0 (AP)',           note: 'Götze — Allemagne bat 7-1 le Brésil en demi (Mineirazo)' },
  { year: '2018', winner: 'France',                finalist: 'Croatie',                host: 'Russie',           score: '4-2',               note: '2e titre français — Mbappé, 2e ado à marquer en finale après Pelé' },
  { year: '2022', winner: 'Argentine',             finalist: 'France',                 host: 'Qatar',            score: '3-3 (AP) (4-2 tab)', note: 'Messi consacré — finale la plus spectaculaire de l\'histoire' },
]

async function seed() {
  const quiz = {
    title: 'Vainqueurs de la Coupe du Monde FIFA (1930–2022)',
    description: 'Tous les pays champions du Monde depuis la 1ère édition en 1930',
    sport: 'football',
    columns: [
      { key: 'year',     label: 'Année',     is_answer: false, hint_order: 0 },
      { key: 'winner',   label: 'Champion',  is_answer: true,  hint_order: 1 },
      { key: 'finalist', label: 'Finaliste', is_answer: false, hint_order: 2 },
      { key: 'host',     label: 'Pays hôte', is_answer: false, hint_order: 3 },
      { key: 'score',    label: 'Score',     is_answer: false, hint_order: 4 },
      { key: 'note',     label: 'Anecdote',  is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} éditions) — ID: ${data.id}`)
}

seed()
