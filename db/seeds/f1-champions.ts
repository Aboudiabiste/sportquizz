/**
 * Seed : Champions du Monde de Formule 1 (1950–2024)
 * Run : npx tsx db/seeds/f1-champions.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { year: '1950', champion: 'Giuseppe Farina',      nationality: 'Italien',      team: 'Alfa Romeo',        note: '1er champion du Monde F1 de l\'histoire' },
  { year: '1951', champion: 'Juan Manuel Fangio',   nationality: 'Argentin',     team: 'Alfa Romeo',        note: '1er titre de Fangio, légende de la discipline' },
  { year: '1952', champion: 'Alberto Ascari',        nationality: 'Italien',      team: 'Ferrari',           note: 'Domine la saison avec 6 victoires sur 8' },
  { year: '1953', champion: 'Alberto Ascari',        nationality: 'Italien',      team: 'Ferrari',           note: '2e titre consécutif pour Ascari' },
  { year: '1954', champion: 'Juan Manuel Fangio',   nationality: 'Argentin',     team: 'Maserati/Mercedes', note: 'Mi-saison chez Mercedes — 5 victoires' },
  { year: '1955', champion: 'Juan Manuel Fangio',   nationality: 'Argentin',     team: 'Mercedes',          note: 'Saison endeuillée par Le Mans, Mercedes se retire' },
  { year: '1956', champion: 'Juan Manuel Fangio',   nationality: 'Argentin',     team: 'Ferrari',           note: '4e titre — dispute tendue avec Musso et Collins' },
  { year: '1957', champion: 'Juan Manuel Fangio',   nationality: 'Argentin',     team: 'Maserati',          note: '5e titre — record qui tiendra 45 ans' },
  { year: '1958', champion: 'Mike Hawthorn',         nationality: 'Britannique',  team: 'Ferrari',           note: '1er champion britannique, décède en janvier 1959' },
  { year: '1959', champion: 'Jack Brabham',          nationality: 'Australien',   team: 'Cooper',            note: '1er titre pour Cooper, moteur arrière révolutionnaire' },
  { year: '1960', champion: 'Jack Brabham',          nationality: 'Australien',   team: 'Cooper',            note: '2e titre consécutif pour Brabham' },
  { year: '1961', champion: 'Phil Hill',             nationality: 'Américain',    team: 'Ferrari',           note: '1er (et seul) champion américain de F1' },
  { year: '1962', champion: 'Graham Hill',           nationality: 'Britannique',  team: 'BRM',               note: '1er titre de Hill, BRM au sommet' },
  { year: '1963', champion: 'Jim Clark',             nationality: 'Britannique',  team: 'Lotus',             note: '7 victoires sur 10 courses — domination totale' },
  { year: '1964', champion: 'John Surtees',          nationality: 'Britannique',  team: 'Ferrari',           note: 'Seul homme champion en moto ET en F1' },
  { year: '1965', champion: 'Jim Clark',             nationality: 'Britannique',  team: 'Lotus',             note: '2e titre pour Clark, dont 6 victoires sur 10' },
  { year: '1966', champion: 'Jack Brabham',          nationality: 'Australien',   team: 'Brabham',           note: '1er (et seul) champion dans une voiture portant son nom' },
  { year: '1967', champion: 'Denny Hulme',           nationality: 'Néo-Zélandais', team: 'Brabham',          note: 'Coéquipier de Brabham, devance son patron au général' },
  { year: '1968', champion: 'Graham Hill',           nationality: 'Britannique',  team: 'Lotus',             note: '2e titre après la mort de Jim Clark cette saison' },
  { year: '1969', champion: 'Jackie Stewart',        nationality: 'Britannique',  team: 'Matra',             note: '6 victoires — 1er titre pour Stewart' },
  { year: '1970', champion: 'Jochen Rindt',          nationality: 'Autrichien',   team: 'Lotus',             note: 'Seul champion posthume — tué à Monza en qualification' },
  { year: '1971', champion: 'Jackie Stewart',        nationality: 'Britannique',  team: 'Tyrrell',           note: '2e titre — Tyrrell première saison complète' },
  { year: '1972', champion: 'Emerson Fittipaldi',   nationality: 'Brésilien',    team: 'Lotus',             note: 'Plus jeune champion de l\'histoire à l\'époque (25 ans)' },
  { year: '1973', champion: 'Jackie Stewart',        nationality: 'Britannique',  team: 'Tyrrell',           note: '3e titre puis retraite — 27 victoires en carrière' },
  { year: '1974', champion: 'Emerson Fittipaldi',   nationality: 'Brésilien',    team: 'McLaren',           note: '2e titre pour Fittipaldi, 1er pour McLaren' },
  { year: '1975', champion: 'Niki Lauda',            nationality: 'Autrichien',   team: 'Ferrari',           note: '1er titre — Ferrari domine la saison' },
  { year: '1976', champion: 'James Hunt',            nationality: 'Britannique',  team: 'McLaren',           note: 'Lauda miraculé à Nürburgring — Hunt sacré au Japon' },
  { year: '1977', champion: 'Niki Lauda',            nationality: 'Autrichien',   team: 'Ferrari',           note: '2e titre — se retire 2 courses avant la fin de saison' },
  { year: '1978', champion: 'Mario Andretti',        nationality: 'Américain',    team: 'Lotus',             note: 'Lotus effet de sol — Peterson décède en cours de saison' },
  { year: '1979', champion: 'Jody Scheckter',        nationality: 'Sud-Africain', team: 'Ferrari',           note: 'Dernier titre Ferrari avant 2000' },
  { year: '1980', champion: 'Alan Jones',            nationality: 'Australien',   team: 'Williams',          note: '1er titre Williams — Jones domine la 2e partie de saison' },
  { year: '1981', champion: 'Nelson Piquet',         nationality: 'Brésilien',    team: 'Brabham',           note: '1er titre Piquet — décidé au dernier GP' },
  { year: '1982', champion: 'Keke Rosberg',          nationality: 'Finlandais',   team: 'Williams',          note: 'Seulement 1 victoire mais régularité décisive' },
  { year: '1983', champion: 'Nelson Piquet',         nationality: 'Brésilien',    team: 'Brabham',           note: '2e titre — turbo Brabham-BMW au sommet' },
  { year: '1984', champion: 'Niki Lauda',            nationality: 'Autrichien',   team: 'McLaren',           note: '3e titre, devance Prost de 0,5 point' },
  { year: '1985', champion: 'Alain Prost',           nationality: 'Français',     team: 'McLaren',           note: '1er titre pour le Professeur' },
  { year: '1986', champion: 'Alain Prost',           nationality: 'Français',     team: 'McLaren',           note: '2e titre consécutif — Mansell éclate un pneu au dernier GP' },
  { year: '1987', champion: 'Nelson Piquet',         nationality: 'Brésilien',    team: 'Williams',          note: '3e titre — Mansell blessé abandonne ses espoirs' },
  { year: '1988', champion: 'Ayrton Senna',          nationality: 'Brésilien',    team: 'McLaren',           note: '8 victoires sur 16 — 1er titre Senna' },
  { year: '1989', champion: 'Alain Prost',           nationality: 'Français',     team: 'McLaren',           note: '3e titre — collision Senna/Prost à Suzuka' },
  { year: '1990', champion: 'Ayrton Senna',          nationality: 'Brésilien',    team: 'McLaren',           note: '2e titre — nouvelle collision Suzuka, Senna responsable' },
  { year: '1991', champion: 'Ayrton Senna',          nationality: 'Brésilien',    team: 'McLaren',           note: '3e et dernier titre pour Senna' },
  { year: '1992', champion: 'Nigel Mansell',         nationality: 'Britannique',  team: 'Williams',          note: '9 victoires — record à l\'époque, puis part en IndyCar' },
  { year: '1993', champion: 'Alain Prost',           nationality: 'Français',     team: 'Williams',          note: '4e titre puis retraite — meilleur Français de l\'histoire' },
  { year: '1994', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Benetton',          note: '1er titre — polémique Hill/Schumacher à Adélaïde' },
  { year: '1995', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Benetton',          note: '2e titre consécutif avant de rejoindre Ferrari' },
  { year: '1996', champion: 'Damon Hill',            nationality: 'Britannique',  team: 'Williams',          note: 'Fils de Graham Hill — unique duo père/fils champions' },
  { year: '1997', champion: 'Jacques Villeneuve',   nationality: 'Canadien',     team: 'Williams',          note: 'Schumacher disqualifié du championnat pour la collision' },
  { year: '1998', champion: 'Mika Häkkinen',         nationality: 'Finlandais',   team: 'McLaren',           note: '1er titre pour le "Flying Finn"' },
  { year: '1999', champion: 'Mika Häkkinen',         nationality: 'Finlandais',   team: 'McLaren',           note: 'Schumacher blessé — Häkkinen conserve son titre' },
  { year: '2000', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Ferrari',           note: '1er titre Ferrari depuis 1979' },
  { year: '2001', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Ferrari',           note: 'Domination totale — 9 victoires sur 17 courses' },
  { year: '2002', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Ferrari',           note: 'Sacré avant les 6 dernières courses — 11 victoires' },
  { year: '2003', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Ferrari',           note: 'Titre serré contre Räikkönen — décidé au dernier GP' },
  { year: '2004', champion: 'Michael Schumacher',   nationality: 'Allemand',     team: 'Ferrari',           note: '7e titre mondial — record absolu à l\'époque' },
  { year: '2005', champion: 'Fernando Alonso',       nationality: 'Espagnol',     team: 'Renault',           note: 'Plus jeune champion de l\'histoire à 24 ans (à l\'époque)' },
  { year: '2006', champion: 'Fernando Alonso',       nationality: 'Espagnol',     team: 'Renault',           note: '2e titre consécutif — Schumacher part en retraite' },
  { year: '2007', champion: 'Kimi Räikkönen',        nationality: 'Finlandais',   team: 'Ferrari',           note: 'Sacré au dernier GP devant Hamilton et Alonso' },
  { year: '2008', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'McLaren',           note: 'Dépasse Glock dans le dernier virage du dernier GP' },
  { year: '2009', champion: 'Jenson Button',         nationality: 'Britannique',  team: 'Brawn GP',          note: 'Brawn GP, ex-Honda, domine la 1ère moitié de saison' },
  { year: '2010', champion: 'Sebastian Vettel',      nationality: 'Allemand',     team: 'Red Bull',          note: '1er titre Red Bull — sacré au dernier GP à Abu Dhabi' },
  { year: '2011', champion: 'Sebastian Vettel',      nationality: 'Allemand',     team: 'Red Bull',          note: '11 victoires — domination Red Bull totale' },
  { year: '2012', champion: 'Sebastian Vettel',      nationality: 'Allemand',     team: 'Red Bull',          note: 'Saison ouverte — sacré au dernier GP au Brésil' },
  { year: '2013', champion: 'Sebastian Vettel',      nationality: 'Allemand',     team: 'Red Bull',          note: '4e titre consécutif — 13 victoires de suite en fin de saison' },
  { year: '2014', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '1er titre ère turbo-hybride — devance Rosberg' },
  { year: '2015', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '3e titre — 10 victoires cette saison' },
  { year: '2016', champion: 'Nico Rosberg',          nationality: 'Allemand',     team: 'Mercedes',          note: 'Bat Hamilton, se retire 5 jours après le titre' },
  { year: '2017', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '4e titre — duel tendu contre Vettel/Ferrari' },
  { year: '2018', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '5e titre — égale Fangio au nombre de sacres' },
  { year: '2019', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '6e titre — 2e rang all-time, derrière Schumacher' },
  { year: '2020', champion: 'Lewis Hamilton',        nationality: 'Britannique',  team: 'Mercedes',          note: '7e titre — égale le record de Schumacher' },
  { year: '2021', champion: 'Max Verstappen',        nationality: 'Néerlandais',  team: 'Red Bull',          note: 'Polémique Abu Dhabi — dépasse Hamilton au dernier tour' },
  { year: '2022', champion: 'Max Verstappen',        nationality: 'Néerlandais',  team: 'Red Bull',          note: '15 victoires — Red Bull domine la saison' },
  { year: '2023', champion: 'Max Verstappen',        nationality: 'Néerlandais',  team: 'Red Bull',          note: '19 victoires sur 22 courses — saison record absolu' },
  { year: '2024', champion: 'Max Verstappen',        nationality: 'Néerlandais',  team: 'Red Bull',          note: '4e titre consécutif malgré la montée en puissance de McLaren' },
]

async function seed() {
  const quiz = {
    title: 'Champions du Monde de Formule 1 (1950–2024)',
    description: 'Tous les champions du Monde de F1 depuis la première saison en 1950',
    sport: 'f1',
    columns: [
      { key: 'year',        label: 'Année',        is_answer: false, hint_order: 0 },
      { key: 'champion',    label: 'Champion',     is_answer: true,  hint_order: 1 },
      { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 2 },
      { key: 'team',        label: 'Écurie',       is_answer: false, hint_order: 3 },
      { key: 'note',        label: 'Anecdote',     is_answer: false, hint_order: 4 },
    ],
    rows,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${rows.length} saisons) — ID: ${data.id}`)
}

seed()
