import type { Quiz } from './supabase'

export const DEMO_QUIZ: Quiz = {
  id: 'demo',
  title: 'Meilleurs buteurs de la Ligue des Champions',
  description: 'Les joueurs ayant marqué le plus de buts en Ligue des Champions UEFA (all-time)',
  sport: 'football',
  created_at: new Date().toISOString(),
  columns: [
    { key: 'name',        label: 'Joueur',       is_answer: true,  hint_order: 0 },
    { key: 'nationality', label: 'Nationalité',  is_answer: false, hint_order: 1 },
    { key: 'goals',       label: 'Buts',         is_answer: false, hint_order: 2 },
    { key: 'club',        label: 'Club principal',is_answer: false, hint_order: 3 },
  ],
  rows: [
    { name: 'Cristiano Ronaldo', nationality: 'Portugais',  goals: '140', club: 'Real Madrid' },
    { name: 'Lionel Messi',      nationality: 'Argentin',   goals: '129', club: 'FC Barcelone' },
    { name: 'Robert Lewandowski',nationality: 'Polonais',   goals: '101', club: 'FC Barcelone' },
    { name: 'Karim Benzema',     nationality: 'Français',   goals: '90',  club: 'Real Madrid' },
    { name: 'Raúl',              nationality: 'Espagnol',   goals: '71',  club: 'Real Madrid' },
    { name: 'Ruud van Nistelrooy',nationality: 'Néerlandais',goals: '56', club: 'Manchester United' },
    { name: 'Thomas Müller',     nationality: 'Allemand',   goals: '54',  club: 'Bayern Munich' },
    { name: 'Thierry Henry',     nationality: 'Français',   goals: '50',  club: 'Arsenal' },
    { name: 'Alfredo Di Stéfano',nationality: 'Espagnol',   goals: '49',  club: 'Real Madrid' },
    { name: 'Andriy Shevchenko', nationality: 'Ukrainien',  goals: '48',  club: 'AC Milan' },
  ],
}
