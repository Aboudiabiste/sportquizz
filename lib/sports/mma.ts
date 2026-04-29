import { fetchWithCache } from './cache'

const BASE = 'https://v1.mma.api-sports.io'
const KEY = process.env.API_FOOTBALL_KEY! // même clé API-Sports

async function apiFetch(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'x-apisports-key': KEY },
  })
  if (!res.ok) throw new Error(`API-Sports MMA ${res.status}: ${path}`)
  return res.json()
}

function cached<T>(key: string, path: string): Promise<T> {
  return fetchWithCache('api-sports-mma', key, () => apiFetch(path))
}

// ── Types ─────────────────────────────────────────────────────────
export interface MMAFighter {
  id: number
  name: string
  nationality: string
  weightClass: string
  wins: number
  losses: number
  draws: number
  titleDefenses?: number
}

export interface MMAEvent {
  id: number
  name: string
  date: string
  location: string
}

export interface MMAFight {
  event: string
  date: string
  fighter1: string
  fighter2: string
  winner: string
  method: string   // KO, TKO, Submission, Decision
  round: number
  weightClass: string
  title: boolean
}

// ── Champions par catégorie ───────────────────────────────────────
export async function getUFCChampions(): Promise<MMAFighter[]> {
  const data = await cached<Record<string, unknown>>(
    'ufc-champions-current',
    '/fighters?league=1&type=champion'
  )
  const fighters = (data.response as Record<string, unknown>[]) ?? []
  return fighters.map(f => ({
    id: f.id as number,
    name: f.name as string,
    nationality: f.nationality as string,
    weightClass: f.weight_class as string,
    wins: (f.career as Record<string, unknown>)?.wins as number ?? 0,
    losses: (f.career as Record<string, unknown>)?.losses as number ?? 0,
    draws: (f.career as Record<string, unknown>)?.draws as number ?? 0,
  }))
}

// ── Résultats d'un événement ──────────────────────────────────────
export async function getEventFights(eventId: number): Promise<MMAFight[]> {
  const data = await cached<Record<string, unknown>>(
    `ufc-event-${eventId}`,
    `/fights?event=${eventId}`
  )
  const fights = (data.response as Record<string, unknown>[]) ?? []
  return fights.map(f => {
    const fighters = f.fighters as Record<string, unknown>[]
    const winner = fighters.find(fi => (fi as Record<string, unknown>).winner === true)
    return {
      event: f.event as string,
      date: f.date as string,
      fighter1: fighters[0]?.name as string,
      fighter2: fighters[1]?.name as string,
      winner: winner?.name as string ?? '—',
      method: f.method as string,
      round: f.round as number,
      weightClass: f.weight_class as string,
      title: f.title_fight as boolean ?? false,
    }
  })
}

// ── Combattants avec le plus de défenses de ceinture ─────────────
export async function getFightersByTitleDefenses(minDefenses = 3): Promise<MMAFighter[]> {
  const data = await cached<Record<string, unknown>>(
    `ufc-fighters-title-defenses-${minDefenses}`,
    `/fighters?league=1&title_defenses=${minDefenses}`
  )
  const fighters = (data.response as Record<string, unknown>[]) ?? []
  return fighters
    .map(f => ({
      id: f.id as number,
      name: f.name as string,
      nationality: f.nationality as string,
      weightClass: f.weight_class as string,
      wins: (f.career as Record<string, unknown>)?.wins as number ?? 0,
      losses: (f.career as Record<string, unknown>)?.losses as number ?? 0,
      draws: (f.career as Record<string, unknown>)?.draws as number ?? 0,
      titleDefenses: f.title_defenses as number ?? 0,
    }))
    .filter(f => (f.titleDefenses ?? 0) >= minDefenses)
    .sort((a, b) => (b.titleDefenses ?? 0) - (a.titleDefenses ?? 0))
}
