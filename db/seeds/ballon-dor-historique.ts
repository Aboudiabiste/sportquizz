/**
 * Seed : Palmarès Ballon d'Or historique (1956–1995)
 * Complète le quiz 1996-2024 déjà en base
 * Run : npx tsx db/seeds/ballon-dor-historique.ts
 * Sources : France Football (données officielles)
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1956', name: 'Stanley Matthews',        nationality: 'Anglais',       club: 'Blackpool',              note: '1er Ballon d\'Or de l\'histoire, à 41 ans' },
  { year: '1957', name: 'Alfredo Di Stéfano',      nationality: 'Argentin/Esp.', club: 'Real Madrid',            note: '1er titre pour l\'icône du Real Madrid' },
  { year: '1958', name: 'Raymond Kopa',             nationality: 'Français',      club: 'Real Madrid',            note: '1er Français lauréat — France 3e au Mondial 1958' },
  { year: '1959', name: 'Alfredo Di Stéfano',      nationality: 'Argentin/Esp.', club: 'Real Madrid',            note: '2e Ballon d\'Or — champion d\'Europe C1' },
  { year: '1960', name: 'Luís Suárez',              nationality: 'Espagnol',      club: 'FC Barcelone',           note: 'Milieu espagnol — à ne pas confondre avec l\'Uruguayen' },
  { year: '1961', name: 'Omar Sívori',              nationality: 'Argentin/Ital.',club: 'Juventus',               note: 'Argentin naturalisé italien, génie technique de la Juve' },
  { year: '1962', name: 'Josef Masopust',           nationality: 'Tchécoslovaque',club: 'Dukla Prague',           note: 'Finaliste Mondial 1962 — 1er Tchèque lauréat' },
  { year: '1963', name: 'Lev Yachine',              nationality: 'Soviétique',    club: 'Dynamo Moscou',          note: 'Seul gardien de but jamais récompensé' },
  { year: '1964', name: 'Denis Law',                nationality: 'Écossais',      club: 'Manchester United',      note: 'Le "King" écossais de United — meilleur buteur de sa génération' },
  { year: '1965', name: 'Eusébio',                  nationality: 'Portugais',     club: 'Benfica',                note: '"La Panthère Noire" — 9 buts au Mondial 1966 l\'année suivante' },
  { year: '1966', name: 'Bobby Charlton',           nationality: 'Anglais',       club: 'Manchester United',      note: 'Champion du Monde 1966 avec l\'Angleterre' },
  { year: '1967', name: 'Florian Albert',           nationality: 'Hongrois',      club: 'Ferencváros',            note: 'Seul Hongrois lauréat — génie du football danubien' },
  { year: '1968', name: 'George Best',              nationality: 'Irlandais (N.)',club: 'Manchester United',      note: 'Champion d\'Europe, 5e Beatle — apogée avant la descente' },
  { year: '1969', name: 'Gianni Rivera',            nationality: 'Italien',       club: 'AC Milan',               note: 'Champion d\'Europe — "Il Golden Boy" du Milan' },
  { year: '1970', name: 'Gerd Müller',              nationality: 'Allemand',      club: 'Bayern Munich',          note: '"Der Bomber" — 10 buts au Mondial 1970, record' },
  { year: '1971', name: 'Johan Cruyff',             nationality: 'Néerlandais',   club: 'Ajax Amsterdam',         note: '1er de 3 Ballons d\'Or — symbole du football total' },
  { year: '1972', name: 'Franz Beckenbauer',        nationality: 'Allemand',      club: 'Bayern Munich',          note: '1er Ballon d\'Or du Kaiser — défenseur révolutionnaire' },
  { year: '1973', name: 'Johan Cruyff',             nationality: 'Néerlandais',   club: 'Ajax Amsterdam',         note: '2e Ballon d\'Or — titre avant son transfert au Barça' },
  { year: '1974', name: 'Johan Cruyff',             nationality: 'Néerlandais',   club: 'FC Barcelone',           note: '3e Ballon d\'Or consécutif — finaliste Mondial 1974' },
  { year: '1975', name: 'Oleg Blokhin',             nationality: 'Soviétique',    club: 'Dynamo Kiev',            note: 'Surprise — attaquant vif, champion d\'Europe des clubs (C2)' },
  { year: '1976', name: 'Franz Beckenbauer',        nationality: 'Allemand',      club: 'Bayern Munich',          note: '2e Ballon d\'Or — champion d\'Europe et du Monde 1974' },
  { year: '1977', name: 'Allan Simonsen',           nationality: 'Danois',        club: 'Borussia M\'gladbach',   note: 'Grande surprise — 1er Scandinave lauréat' },
  { year: '1978', name: 'Kevin Keegan',             nationality: 'Anglais',       club: 'Hambourg SV',            note: '1er titre pour Keegan, champion d\'Europe (C1) avec Liverpool' },
  { year: '1979', name: 'Kevin Keegan',             nationality: 'Anglais',       club: 'Hambourg SV',            note: '2e consécutif — meilleur buteur de Bundesliga' },
  { year: '1980', name: 'Karl-Heinz Rummenigge',   nationality: 'Allemand',      club: 'Bayern Munich',          note: '1er titre du "Kaiser Franz" du Bayern' },
  { year: '1981', name: 'Karl-Heinz Rummenigge',   nationality: 'Allemand',      club: 'Bayern Munich',          note: '2e consécutif — attaquant le plus redoutable d\'Europe' },
  { year: '1982', name: 'Paolo Rossi',              nationality: 'Italien',       club: 'Juventus',               note: '6 buts au Mondial, champion du Monde — après suspension' },
  { year: '1983', name: 'Michel Platini',           nationality: 'Français',      club: 'Juventus',               note: '1er des 3 consécutifs pour Platini — 104 buts en Serie A' },
  { year: '1984', name: 'Michel Platini',           nationality: 'Français',      club: 'Juventus',               note: '2e consécutif — champion d\'Europe avec la France' },
  { year: '1985', name: 'Michel Platini',           nationality: 'Français',      club: 'Juventus',               note: '3e consécutif — record qui tiendra jusqu\'à Messi' },
  { year: '1986', name: 'Igor Belanov',             nationality: 'Soviétique',    club: 'Dynamo Kiev',            note: 'Surprise — attaquant véloce, vainqueur C2 avec Kiev' },
  { year: '1987', name: 'Ruud Gullit',              nationality: 'Néerlandais',   club: 'AC Milan',               note: '1er titre du trio néerlandais du Milan — champion d\'Europe 1988' },
  { year: '1988', name: 'Marco van Basten',         nationality: 'Néerlandais',   club: 'AC Milan',               note: 'Champion d\'Europe, 1er des 3 Ballons d\'Or — but de légende en finale' },
  { year: '1989', name: 'Marco van Basten',         nationality: 'Néerlandais',   club: 'AC Milan',               note: '2e consécutif — champion d\'Europe des clubs (C1)' },
  { year: '1990', name: 'Lothar Matthäus',          nationality: 'Allemand',      club: 'Inter Milan',            note: 'Champion du Monde 1990 — meilleur joueur du tournoi' },
  { year: '1991', name: 'Jean-Pierre Papin',        nationality: 'Français',      club: 'Olympique de Marseille', note: '5e saison consécutive comme meilleur buteur de D1' },
  { year: '1992', name: 'Marco van Basten',         nationality: 'Néerlandais',   club: 'AC Milan',               note: '3e Ballon d\'Or — avant les blessures à la cheville' },
  { year: '1993', name: 'Roberto Baggio',           nationality: 'Italien',       club: 'Juventus',               note: '"Il Divin Codino" — un an avant la finale Mondial 1994' },
  { year: '1994', name: 'Hristo Stoichkov',         nationality: 'Bulgare',       club: 'FC Barcelone',           note: 'Bulgarie 4e au Mondial — Ballon d\'Or partagé avec Baggio' },
  { year: '1995', name: 'George Weah',              nationality: 'Libérien',      club: 'AC Milan',               note: '1er (et seul) Africain lauréat — président du Liberia depuis 2018' },
]

async function seed() {
  const quiz = {
    title: 'Palmarès Ballon d\'Or historique (1956–1995)',
    description: 'Les lauréats du Ballon d\'Or de la 1ère édition jusqu\'à 1995',
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
