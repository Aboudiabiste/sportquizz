/**
 * Seed : Grandes stars d'Arsenal (1996–2024)
 * Joueurs légendaires passés par Arsenal depuis l'ère Wenger
 * Run : npx tsx db/seeds/arsenal-stars.ts
 * Sources : Wikipedia / Transfermarkt
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { player: 'Dennis Bergkamp',          nationality: 'Néerlandais',  position: 'Attaquant',        years: '1995–2006', club_after: 'Retraite',               note: '"La Statue" — jamais de carton rouge, peur de l\'avion légendaire' },
  { player: 'Patrick Vieira',           nationality: 'Français',     position: 'Milieu défensif',  years: '1996–2005', club_after: 'Juventus',               note: 'Capitaine des Invincibles — parti pour ~14M€, champion du Monde 98' },
  { player: 'Emmanuel Petit',           nationality: 'Français',     position: 'Milieu',           years: '1997–2000', club_after: 'FC Barcelone',           note: 'But en finale CDM 1998 — champion de la Double avec Arsenal (1998)' },
  { player: 'Nicolas Anelka',           nationality: 'Français',     position: 'Attaquant',        years: '1997–1999', club_after: 'Real Madrid',            note: 'Parti pour £22.5M — record pour un joueur français à l\'époque' },
  { player: 'Sylvain Wiltord',          nationality: 'Français',     position: 'Ailier',           years: '2000–2004', club_after: 'Olympique Lyonnais',     note: 'But vainqueur au titre de L1 2002 à Old Trafford — Invincible' },
  { player: 'Robert Pires',             nationality: 'Français',     position: 'Ailier',           years: '2000–2006', club_after: 'Villarreal',             note: 'Meilleur joueur PL 2001-02 — Invincible, champion du Monde 98' },
  { player: 'Fredrik Ljungberg',        nationality: 'Suédois',      position: 'Milieu offensif',  years: '1998–2007', club_after: 'West Ham',               note: 'Meilleur buteur Arsenal 2001-02 — sa pub Calvin Klein iconique' },
  { player: 'Thierry Henry',            nationality: 'Français',     position: 'Attaquant',        years: '1999–2007', club_after: 'FC Barcelone',           note: 'Meilleur buteur de l\'histoire d\'Arsenal — 228 buts, Invincible' },
  { player: 'Cesc Fàbregas',            nationality: 'Espagnol',     position: 'Milieu',           years: '2003–2011', club_after: 'FC Barcelone',           note: 'Arrivé à 16 ans, capitaine à 21 — retour au Barça pour ~35M€' },
  { player: 'Samir Nasri',              nationality: 'Français',     position: 'Milieu offensif',  years: '2008–2011', club_after: 'Manchester City',        note: 'Très critiqué pour son départ — champion d\'Angleterre avec City' },
  { player: 'Robin van Persie',         nationality: 'Néerlandais',  position: 'Attaquant',        years: '2004–2012', club_after: 'Manchester United',      note: '37 buts en 2011-12 — trahi Arsenal pour United, champion d\'Angleterre' },
  { player: 'Aaron Ramsey',             nationality: 'Gallois',      position: 'Milieu',           years: '2008–2019', club_after: 'Juventus',               note: '11 ans à Arsenal — but vainqueur en finale FA Cup 2014 et 2017' },
  { player: 'Santi Cazorla',            nationality: 'Espagnol',     position: 'Milieu',           years: '2012–2018', club_after: 'Villarreal',             note: 'Revenu de blessure après 654 jours d\'absence — séquence incroyable' },
  { player: 'Olivier Giroud',           nationality: 'Français',     position: 'Attaquant',        years: '2012–2018', club_after: 'Chelsea',                note: '105 buts pour Arsenal — Puskas Award 2017 pour le but scorpion' },
  { player: 'Mesut Özil',               nationality: 'Allemand',     position: 'Milieu offensif',  years: '2013–2021', club_after: 'Fenerbahçe',            note: '254 apparitions — 54 passes décisives en PL, controversé jusqu\'au bout' },
  { player: 'Alexis Sánchez',           nationality: 'Chilien',      position: 'Ailier',           years: '2014–2018', club_after: 'Manchester United',      note: '80 buts pour Arsenal — swap avec Mkhitaryan, désastre à United' },
  { player: 'Pierre-Emerick Aubameyang', nationality: 'Gabonais',    position: 'Attaquant',        years: '2018–2022', club_after: 'FC Barcelone',           note: 'Meilleur buteur PL 2018-19 — capitaine déchu avant de partir libre' },
  { player: 'Bukayo Saka',              nationality: 'Anglais',      position: 'Ailier',           years: '2018–…',    club_after: '(toujours à Arsenal)',   note: 'Formé à Arsenal — 7e en Ligue des Champions pour la première fois' },
]

async function seed() {
  const quiz = {
    title: 'Grandes stars d\'Arsenal (1996–2024)',
    description: 'Les joueurs qui ont marqué l\'histoire des Gunners depuis l\'ère Wenger',
    sport: 'football',
    columns: [
      { key: 'player',      label: 'Joueur',       is_answer: true,  hint_order: 0 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
      { key: 'position',    label: 'Poste',        is_answer: false, hint_order: 2 },
      { key: 'years',       label: 'Années',       is_answer: false, hint_order: 3 },
      { key: 'club_after',  label: 'Club suivant', is_answer: false, hint_order: 4 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 5 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} joueurs) — ID: ${data.id}`)
}

seed()
