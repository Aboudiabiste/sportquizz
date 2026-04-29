import { fetchWithCache } from './cache'

const BASE = 'https://v3.football.api-sports.io'
const KEY = process.env.API_FOOTBALL_KEY!

async function apiFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-apisports-key': KEY },
  })
  if (!res.ok) throw new Error(`API-Football ${res.status}: ${path}`)
  return res.json()
}

function cached<T>(key: string, path: string): Promise<T> {
  return fetchWithCache('api-football', key, () => apiFetch(path))
}

// ── Leagues ───────────────────────────────────────────────────────
export const LEAGUES = {
  ldc:       { id: 2,   name: 'Ligue des Champions' },
  ligue1:    { id: 61,  name: 'Ligue 1' },
  premier:   { id: 39,  name: 'Premier League' },
  liga:      { id: 140, name: 'La Liga' },
  bundesliga:{ id: 78,  name: 'Bundesliga' },
  seriea:    { id: 135, name: 'Serie A' },
} as const

// ── Top scorers ───────────────────────────────────────────────────
export interface TopScorer {
  rank: number
  name: string
  nationality: string
  goals: number
  assists: number
  club: string
  age: number
}

export async function getTopScorers(leagueId: number, season: number, limit = 20): Promise<TopScorer[]> {
  const data = await cached<Record<string, unknown>>(
    `topscorers-league${leagueId}-${season}`,
    `/players/topscorers?league=${leagueId}&season=${season}`
  )
  return (data.response as Record<string, unknown>[] ?? []).slice(0, limit).map((entry, i) => {
    const p = entry.player as Record<string, unknown>
    const stats = (entry.statistics as Record<string, unknown>[])[0]
    const goals = stats.goals as Record<string, unknown>
    const team = stats.team as Record<string, unknown>
    return {
      rank: i + 1,
      name: p.name as string,
      nationality: p.nationality as string,
      goals: (goals.total as number) ?? 0,
      assists: (goals.assists as number) ?? 0,
      club: team.name as string,
      age: p.age as number,
    }
  })
}

// ── League standings ──────────────────────────────────────────────
export interface Standing {
  rank: number
  club: string
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goals_for: number
  goals_against: number
}

export async function getStandings(leagueId: number, season: number): Promise<Standing[]> {
  const data = await cached<Record<string, unknown>>(
    `standings-league${leagueId}-${season}`,
    `/standings?league=${leagueId}&season=${season}`
  )
  const standings = (data.response as Record<string, unknown>[])?.[0]
    ?.league as Record<string, unknown>
  const rows = (standings?.standings as unknown[][])?.[0] ?? []
  return rows.map((s) => {
    const row = s as Record<string, unknown>
    const all = row.all as Record<string, unknown>
    const g = all.goals as Record<string, unknown>
    return {
      rank: row.rank as number,
      club: (row.team as Record<string, unknown>).name as string,
      points: row.points as number,
      played: all.played as number,
      won: all.win as number,
      drawn: all.draw as number,
      lost: all.lose as number,
      goals_for: g.for as number,
      goals_against: g.against as number,
    }
  })
}

// ── Players by nationality in a league (all seasons since a year) ─
export interface PlayerStat {
  name: string
  nationality: string
  club: string
  season: number
  goals: number
  appearances: number
}

export async function getPlayersByNationality(
  leagueId: number,
  nationality: string,
  fromSeason: number,
  toSeason = new Date().getFullYear() - 1
): Promise<PlayerStat[]> {
  const results: PlayerStat[] = []
  for (let season = fromSeason; season <= toSeason; season++) {
    const data = await cached<Record<string, unknown>>(
      `players-nationality${nationality.toLowerCase().replace(/\s+/g, '-')}-league${leagueId}-${season}`,
      `/players?league=${leagueId}&season=${season}&nationality=${encodeURIComponent(nationality)}&page=1`
    )
    const players = data.response as Record<string, unknown>[] ?? []
    for (const entry of players) {
      const p = entry.player as Record<string, unknown>
      const stats = (entry.statistics as Record<string, unknown>[])[0]
      const goals = (stats?.goals as Record<string, unknown>)?.total as number ?? 0
      const apps = (stats?.games as Record<string, unknown>)?.appearences as number ?? 0
      const team = (stats?.team as Record<string, unknown>)?.name as string ?? '—'
      results.push({
        name: p.name as string,
        nationality: p.nationality as string,
        club: team,
        season,
        goals,
        appearances: apps,
      })
    }
  }
  return results
}

// ── Season years helper ───────────────────────────────────────────
export function currentSeason(): number {
  const now = new Date()
  return now.getMonth() >= 6 ? now.getFullYear() : now.getFullYear() - 1
}
