import type { QuizColumn } from '@/lib/supabase'
import { getTopScorers, getStandings, LEAGUES, currentSeason } from '@/lib/sports/football'
import { getWorldChampions, getRaceResults, getDriverStandings } from '@/lib/sports/f1'

export interface GeneratedQuiz {
  title: string
  description: string
  sport: string
  columns: QuizColumn[]
  rows: Record<string, string>[]
}

export interface QuizTemplate {
  id: string
  label: string
  sport: string
  description: string
  params?: { key: string; label: string; type: 'number' | 'select'; options?: { value: string; label: string }[] }[]
}

// ── Template registry ─────────────────────────────────────────────

export const TEMPLATES: QuizTemplate[] = [
  {
    id: 'football_top_scorers',
    label: 'Meilleurs buteurs',
    sport: 'football',
    description: 'Top buteurs d\'une compétition pour une saison donnée',
    params: [
      { key: 'league', label: 'Compétition', type: 'select', options: Object.entries(LEAGUES).map(([k, v]) => ({ value: k, label: v.name })) },
      { key: 'season', label: 'Saison', type: 'number' },
      { key: 'limit', label: 'Nombre de joueurs', type: 'number' },
    ],
  },
  {
    id: 'football_standings',
    label: 'Classement du championnat',
    sport: 'football',
    description: 'Classement final d\'une compétition',
    params: [
      { key: 'league', label: 'Compétition', type: 'select', options: Object.entries(LEAGUES).map(([k, v]) => ({ value: k, label: v.name })) },
      { key: 'season', label: 'Saison', type: 'number' },
    ],
  },
  {
    id: 'f1_champions',
    label: 'Champions du monde F1',
    sport: 'f1',
    description: 'Champions du monde de Formule 1 sur une période',
    params: [
      { key: 'from', label: 'Depuis', type: 'number' },
      { key: 'to', label: 'Jusqu\'à', type: 'number' },
    ],
  },
  {
    id: 'f1_race_winners',
    label: 'Vainqueurs de GP',
    sport: 'f1',
    description: 'Vainqueurs de chaque Grand Prix d\'une saison',
    params: [
      { key: 'season', label: 'Saison', type: 'number' },
    ],
  },
  {
    id: 'f1_driver_standings',
    label: 'Classement pilotes F1',
    sport: 'f1',
    description: 'Classement final des pilotes d\'une saison',
    params: [
      { key: 'season', label: 'Saison', type: 'number' },
    ],
  },
]

// ── Generator ─────────────────────────────────────────────────────

export async function generateQuiz(templateId: string, params: Record<string, string>): Promise<GeneratedQuiz> {
  const season = Number(params.season ?? currentSeason())
  const limit = Number(params.limit ?? 15)
  const leagueKey = (params.league ?? 'ldc') as keyof typeof LEAGUES
  const league = LEAGUES[leagueKey]

  switch (templateId) {

    case 'football_top_scorers': {
      const scorers = await getTopScorers(league.id, season, limit)
      return {
        title: `Meilleurs buteurs ${league.name} ${season}/${season + 1}`,
        description: `Top ${scorers.length} buteurs`,
        sport: 'football',
        columns: [
          { key: 'name',        label: 'Joueur',      is_answer: true,  hint_order: 0 },
          { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 1 },
          { key: 'club',        label: 'Club',        is_answer: false, hint_order: 2 },
          { key: 'goals',       label: 'Buts',        is_answer: false, hint_order: 3 },
          { key: 'assists',     label: 'Passes D.',   is_answer: false, hint_order: 4 },
        ],
        rows: scorers.map(s => ({
          name: s.name,
          nationality: s.nationality,
          club: s.club,
          goals: String(s.goals),
          assists: String(s.assists),
        })),
      }
    }

    case 'football_standings': {
      const standings = await getStandings(league.id, season)
      return {
        title: `Classement ${league.name} ${season}/${season + 1}`,
        description: `Classement final`,
        sport: 'football',
        columns: [
          { key: 'club',    label: 'Club',    is_answer: true,  hint_order: 0 },
          { key: 'points',  label: 'Points',  is_answer: false, hint_order: 1 },
          { key: 'played',  label: 'J',       is_answer: false, hint_order: 2 },
          { key: 'won',     label: 'V',       is_answer: false, hint_order: 3 },
          { key: 'goals_for', label: 'BP',   is_answer: false, hint_order: 4 },
        ],
        rows: standings.map(s => ({
          club: s.club,
          points: String(s.points),
          played: String(s.played),
          won: String(s.won),
          goals_for: String(s.goals_for),
        })),
      }
    }

    case 'f1_champions': {
      const from = Number(params.from ?? 2000)
      const to = Number(params.to ?? new Date().getFullYear() - 1)
      const champions = await getWorldChampions(from, to)
      return {
        title: `Champions du monde F1 ${from}–${to}`,
        description: `${champions.length} champions`,
        sport: 'f1',
        columns: [
          { key: 'year',        label: 'Année',       is_answer: false, hint_order: 0 },
          { key: 'driver',      label: 'Pilote',      is_answer: true,  hint_order: 0 },
          { key: 'team',        label: 'Écurie',      is_answer: false, hint_order: 1 },
          { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 2 },
          { key: 'wins',        label: 'Victoires',   is_answer: false, hint_order: 3 },
        ],
        rows: champions.map(c => ({
          year: String(c.year),
          driver: c.driver,
          team: c.team,
          nationality: c.nationality,
          wins: String(c.wins),
        })),
      }
    }

    case 'f1_race_winners': {
      const races = await getRaceResults(season)
      return {
        title: `Vainqueurs des GP F1 ${season}`,
        description: `${races.length} Grands Prix`,
        sport: 'f1',
        columns: [
          { key: 'race',        label: 'Grand Prix',  is_answer: false, hint_order: 0 },
          { key: 'winner',      label: 'Vainqueur',   is_answer: true,  hint_order: 0 },
          { key: 'team',        label: 'Écurie',      is_answer: false, hint_order: 1 },
          { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 2 },
        ],
        rows: races.map(r => ({
          race: r.race.replace('Grand Prix', 'GP'),
          winner: r.winner,
          team: r.team,
          nationality: r.nationality,
        })),
      }
    }

    case 'f1_driver_standings': {
      const standings = await getDriverStandings(season)
      return {
        title: `Classement pilotes F1 ${season}`,
        description: `Classement final`,
        sport: 'f1',
        columns: [
          { key: 'driver',      label: 'Pilote',      is_answer: true,  hint_order: 0 },
          { key: 'team',        label: 'Écurie',      is_answer: false, hint_order: 1 },
          { key: 'nationality', label: 'Nationalité', is_answer: false, hint_order: 2 },
          { key: 'points',      label: 'Points',      is_answer: false, hint_order: 3 },
          { key: 'wins',        label: 'Victoires',   is_answer: false, hint_order: 4 },
        ],
        rows: standings.map(s => ({
          driver: s.driver,
          team: s.team,
          nationality: s.nationality,
          points: String(s.points),
          wins: String(s.wins),
        })),
      }
    }

    default:
      throw new Error(`Template inconnu : ${templateId}`)
  }
}
