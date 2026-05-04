/**
 * Utilitaire API-Football avec cache Supabase
 *
 * Logique : cache-first
 *   1. Pour chaque saison demandée, vérifier si player_stats contient déjà les données
 *   2. Fetch API uniquement pour les saisons manquantes
 *   3. Stocker les nouvelles données dans player_stats
 *   4. Agréger et retourner
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const API_KEY = process.env.API_FOOTBALL_KEY!
const BASE_URL = 'https://v3.football.api-sports.io'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface PlayerGoals {
  name: string
  goals: number
  seasons: number[]
  competitions: string[]
}

const FREE_PLAN_MAX_PAGES = 3

async function fetchPageFromAPI(teamId: number, season: number, page: number): Promise<any[]> {
  const url = `${BASE_URL}/players?team=${teamId}&season=${season}&page=${page}`
  const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } })
  const json = await res.json()
  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API error: ${JSON.stringify(json.errors)}`)
  }
  return json.response ?? []
}

async function fetchSeasonFromAPI(teamId: number, teamName: string, season: number): Promise<void> {
  const supabase = getSupabase()
  const url = `${BASE_URL}/players?team=${teamId}&season=${season}&page=1`
  const res = await fetch(url, { headers: { 'x-apisports-key': API_KEY } })
  const json = await res.json()
  const totalPages = Math.min(json.paging?.total ?? 1, FREE_PLAN_MAX_PAGES)

  if ((json.paging?.total ?? 1) > FREE_PLAN_MAX_PAGES) {
    console.warn(`  ⚠️  ${season}: ${json.paging?.total} pages dispo, limité à ${FREE_PLAN_MAX_PAGES} (plan gratuit)`)
  }

  let allPlayers = json.response ?? []
  for (let page = 2; page <= totalPages; page++) {
    const more = await fetchPageFromAPI(teamId, season, page)
    allPlayers = [...allPlayers, ...more]
    await new Promise(r => setTimeout(r, 200))
  }

  // Préparer les lignes à insérer (goals > 0 uniquement)
  const rows: any[] = []
  for (const entry of allPlayers) {
    for (const stat of entry.statistics) {
      const goals: number = stat.goals?.total ?? 0
      if (goals <= 0) continue
      rows.push({
        team_id:     teamId,
        team_name:   teamName,
        player_name: entry.player.name,
        season,
        league_id:   stat.league?.id ?? 0,
        league_name: stat.league?.name ?? '',
        goals,
      })
    }
  }

  if (rows.length > 0) {
    // upsert : si la ligne existe déjà, on met à jour les buts
    const { error } = await supabase
      .from('player_stats')
      .upsert(rows, { onConflict: 'team_id,player_name,season,league_id' })
    if (error) console.error(`  ❌ Cache write error (${season}):`, error.message)
    else console.log(`  ✅ ${season} → ${rows.length} stats en cache`)
  } else {
    console.log(`  — ${season}: aucun buteur trouvé`)
  }
}

/**
 * Récupère les buteurs d'un club dans des compétitions filtrées sur plusieurs saisons.
 * Utilise le cache Supabase player_stats — appelle l'API uniquement pour les saisons manquantes.
 *
 * @param teamId       ID équipe API-Football
 * @param teamName     Nom lisible (pour le cache)
 * @param seasons      ex: [2018, 2019, 2020, 2021, 2022, 2023]
 * @param leagueFilter Noms partiels à inclure ex: ['Europa', 'Champions', 'Conference']
 */
export async function getClubGoalscorers(
  teamId: number,
  teamName: string,
  seasons: number[],
  leagueFilter: string[]
): Promise<PlayerGoals[]> {
  const supabase = getSupabase()

  // 1. Vérifier quelles saisons sont déjà en cache
  const { data: cached } = await supabase
    .from('player_stats')
    .select('season')
    .eq('team_id', teamId)
  const cachedSeasons = new Set((cached ?? []).map((r: any) => r.season))

  const missingSeasonsSet = new Set(seasons.filter(s => !cachedSeasons.has(s)))
  const missingSeasons = [...missingSeasonsSet]

  if (missingSeasons.length === 0) {
    console.log(`  📦 Toutes les saisons en cache — pas d'appel API`)
  } else {
    console.log(`  🌐 Saisons à fetcher: ${missingSeasons.join(', ')}`)
    for (const season of missingSeasons) {
      await fetchSeasonFromAPI(teamId, teamName, season)
      await new Promise(r => setTimeout(r, 300))
    }
  }

  // 2. Lire le cache pour les saisons + compétitions demandées
  const { data: stats, error } = await supabase
    .from('player_stats')
    .select('player_name, season, league_name, goals')
    .eq('team_id', teamId)
    .in('season', seasons)

  if (error) throw new Error(`Cache read error: ${error.message}`)

  // 3. Filtrer par compétition et agréger
  const totals = new Map<string, PlayerGoals>()
  for (const row of (stats ?? [])) {
    const isMatch = leagueFilter.some(f => row.league_name.includes(f))
    if (!isMatch || row.goals <= 0) continue

    const existing = totals.get(row.player_name)
    if (existing) {
      existing.goals += row.goals
      if (!existing.seasons.includes(row.season)) existing.seasons.push(row.season)
      if (!existing.competitions.includes(row.league_name)) existing.competitions.push(row.league_name)
    } else {
      totals.set(row.player_name, {
        name: row.player_name,
        goals: row.goals,
        seasons: [row.season],
        competitions: [row.league_name],
      })
    }
  }

  return Array.from(totals.values()).sort((a, b) => b.goals - a.goals)
}
