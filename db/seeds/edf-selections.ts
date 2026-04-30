/**
 * Seed : Top sélectionnés Équipe de France (1996–2025)
 * Run : npx tsx db/seeds/edf-selections.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const rows = [
  { name: 'Hugo Lloris',          caps: '145', period: '2008–2022', best: 'Champion du Monde 2018, Vice-champion 2022' },
  { name: 'Lilian Thuram',        caps: '142', period: '1994–2008', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Olivier Giroud',       caps: '137', period: '2011–2023', best: 'Champion du Monde 2018, record de buts EDF (57)' },
  { name: 'Antoine Griezmann',    caps: '137', period: '2014–présent', best: 'Champion du Monde 2018, Vice-champion 2022' },
  { name: 'Thierry Henry',        caps: '123', period: '1997–2010', best: 'Champion du Monde 1998, 51 buts' },
  { name: 'Marcel Desailly',      caps: '116', period: '1993–2004', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Zinédine Zidane',      caps: '108', period: '1994–2006', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Patrick Vieira',       caps: '107', period: '1997–2009', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Didier Deschamps',     caps: '103', period: '1989–2000', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Karim Benzema',        caps: '97',  period: '2007–2021', best: 'Ballon d\'Or 2022, 37 buts EDF' },
  { name: 'Laurent Blanc',        caps: '97',  period: '1989–2000', best: 'Champion du Monde 1998 (but historique vs Paraguay)' },
  { name: 'Bixente Lizarazu',     caps: '97',  period: '1992–2004', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Raphaël Varane',       caps: '93',  period: '2013–2023', best: 'Champion du Monde 2018' },
  { name: 'Sylvain Wiltord',      caps: '92',  period: '1999–2004', best: 'But de la victoire Euro 2000 en finale (2-1)' },
  { name: 'Paul Pogba',           caps: '91',  period: '2013–2022', best: 'Champion du Monde 2018' },
  { name: 'Fabien Barthez',       caps: '87',  period: '1994–2006', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Kylian Mbappé',        caps: '85',  period: '2017–présent', best: 'Champion du Monde 2018, Vice 2022 (Soulier d\'Or)' },
  { name: 'William Gallas',       caps: '84',  period: '2002–2010', best: 'Vice-champion du Monde 2006' },
  { name: 'Youri Djorkaeff',      caps: '82',  period: '1993–2002', best: 'Champion du Monde 1998 (but en finale)' },
  { name: 'Franck Ribéry',        caps: '81',  period: '2006–2015', best: 'Vice-champion du Monde 2006, Finalist Ballon d\'Or 2013' },
  { name: 'Robert Pirès',         caps: '79',  period: '1996–2004', best: 'Champion du Monde 1998, Champion d\'Europe 2000' },
  { name: 'Nicolas Anelka',       caps: '69',  period: '1998–2010', best: 'Vice-champion du Monde 2006' },
  { name: 'Éric Abidal',          caps: '67',  period: '2004–2013', best: 'Vice-champion du Monde 2006' },
  { name: 'Kingsley Coman',       caps: '64',  period: '2015–présent', best: 'Champion du Monde 2018' },
  { name: 'Bacary Sagna',         caps: '65',  period: '2007–2016', best: '4e place Euro 2016' },
  { name: 'Emmanuel Petit',       caps: '63',  period: '1996–2002', best: 'Champion du Monde 1998 (but en finale !)' },
  { name: 'Benjamin Pavard',      caps: '58',  period: '2017–présent', best: 'Champion du Monde 2018 (but du tournoi vs Argentine)' },
  { name: 'Ousmane Dembélé',      caps: '53',  period: '2016–présent', best: 'Champion du Monde 2018, Vice-champion d\'Europe 2024' },
  { name: 'Claude Makélélé',      caps: '71',  period: '1995–2006', best: 'Champion du Monde 1998, le "pivot" du football' },
  { name: 'David Trezeguet',      caps: '71',  period: '1998–2008', best: 'But en or Euro 2000, Champion du Monde 1998' },
  { name: 'Adrien Rabiot',        caps: '50',  period: '2019–présent', best: 'Vice-champion du Monde 2022' },
  { name: 'Jules Koundé',         caps: '46',  period: '2021–présent', best: 'Vice-champion d\'Europe 2024' },
  { name: 'Lucas Hernandez',      caps: '37',  period: '2018–2024', best: 'Champion du Monde 2018' },
  { name: 'Aurélien Tchouaméni',  caps: '36',  period: '2021–présent', best: 'Vice-champion du Monde 2022' },
  { name: 'Marcus Thuram',        caps: '30',  period: '2022–présent', best: 'Vice-champion d\'Europe 2024' },
  { name: 'Djibril Cissé',        caps: '41',  period: '2002–2010', best: 'Vice-champion du Monde 2006' },
  { name: 'Samir Nasri',          caps: '41',  period: '2007–2013', best: 'Quart-finaliste CM 2010 (non-sélectionné Euro 2012)' },
]

const sorted = [...rows].sort((a, b) => Number(b.caps) - Number(a.caps))

async function seed() {
  const quiz = {
    title: 'Top sélectionnés de l\'Équipe de France (1996–2025)',
    description: 'Les joueurs les plus capés des Bleus depuis l\'ère moderne',
    sport: 'football',
    columns: [
      { key: 'name',   label: 'Joueur',             is_answer: true,  hint_order: 0 },
      { key: 'caps',   label: 'Sélections',          is_answer: false, hint_order: 1 },
      { key: 'period', label: 'Période',             is_answer: false, hint_order: 2 },
      { key: 'best',   label: 'Fait marquant',       is_answer: false, hint_order: 3 },
    ],
    rows: sorted,
  }

  const { data, error } = await supabase.from('quizzes').insert(quiz).select('id, title').single()
  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`✅ "${data.title}" (${sorted.length} joueurs) — ID: ${data.id}`)
}

seed()
