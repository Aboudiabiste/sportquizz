import { fetchWithCache } from './cache'

const BASE = process.env.JOLPICA_BASE_URL ?? 'https://api.jolpi.ca/ergast'

async function apiFetch(path: string) {
  const res = await fetch(`${BASE}${path}.json`)
  if (!res.ok) throw new Error(`Jolpica ${res.status}: ${path}`)
  return res.json()
}

function cached<T>(key: string, path: string): Promise<T> {
  return fetchWithCache('jolpica', key, () => apiFetch(path))
}

// ── World Champions ───────────────────────────────────────────────
export interface F1Champion {
  year: number
  driver: string
  nationality: string
  team: string
  wins: number
  points: number
}

export async function getWorldChampions(from = 2000, to = new Date().getFullYear() - 1): Promise<F1Champion[]> {
  const results: F1Champion[] = []
  for (let year = from; year <= to; year++) {
    try {
      const data = await cached<Record<string, unknown>>(
        `f1-champion-${year}`,
        `/f1/${year}/driverstandings/1`
      )
      const standing = (data as Record<string, unknown> & {
        MRData: { StandingsTable: { StandingsLists: { DriverStandings: Record<string, unknown>[] }[] } }
      })?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]
      if (!standing) continue
      const d = standing.Driver as Record<string, unknown>
      results.push({
        year,
        driver: `${d.givenName} ${d.familyName}`,
        nationality: d.nationality as string,
        team: (standing.Constructors as Record<string, unknown>[])?.[0]?.name as string ?? '—',
        wins: Number(standing.wins),
        points: Number(standing.points),
      })
    } catch { /* skip year on error */ }
  }
  return results
}

// ── Season race winners ───────────────────────────────────────────
export interface F1RaceResult {
  round: number
  race: string
  circuit: string
  winner: string
  nationality: string
  team: string
  laps: number
}

export async function getRaceResults(season: number): Promise<F1RaceResult[]> {
  const data = await cached<Record<string, unknown>>(
    `f1-race-results-${season}`,
    `/f1/${season}/results/1`
  )
  const races = (data as Record<string, unknown> & {
    MRData: { RaceTable: { Races: Record<string, unknown>[] } }
  })?.MRData?.RaceTable?.Races ?? []
  return races.map((r) => {
    const result = (r.Results as Record<string, unknown>[])[0]
    const driver = result.Driver as Record<string, unknown>
    const constructor = result.Constructor as Record<string, unknown>
    return {
      round: Number(r.round),
      race: r.raceName as string,
      circuit: (r.Circuit as Record<string, unknown>).circuitName as string,
      winner: `${driver.givenName} ${driver.familyName}`,
      nationality: driver.nationality as string,
      team: constructor.name as string,
      laps: Number(result.laps),
    }
  })
}

// ── Driver standings (end of season) ─────────────────────────────
export interface F1DriverStanding {
  rank: number
  driver: string
  nationality: string
  team: string
  wins: number
  points: number
}

export async function getDriverStandings(season: number): Promise<F1DriverStanding[]> {
  const data = await cached<Record<string, unknown>>(
    `f1-driver-standings-${season}`,
    `/f1/${season}/driverstandings`
  )
  const standings = (data as Record<string, unknown> & {
    MRData: { StandingsTable: { StandingsLists: { DriverStandings: Record<string, unknown>[] }[] } }
  })?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
  return standings.map((s) => {
    const d = s.Driver as Record<string, unknown>
    return {
      rank: Number(s.position),
      driver: `${d.givenName} ${d.familyName}`,
      nationality: d.nationality as string,
      team: (s.Constructors as Record<string, unknown>[])[0]?.name as string ?? '—',
      wins: Number(s.wins),
      points: Number(s.points),
    }
  })
}
