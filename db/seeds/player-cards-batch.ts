/**
 * Batch import de fiches joueurs depuis Wikipedia
 * Usage : npx tsx db/seeds/player-cards-batch.ts
 *
 * Ajoute des joueurs à la table player_cards (utilisée par "Devine la Carrière").
 * Les joueurs déjà présents (même nom exact) sont ignorés.
 * Modifier le tableau PLAYERS ci-dessous pour ajouter des fiches.
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fetchPlayerCareer } from '../utils/wikipedia-career'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// ── LISTE DES JOUEURS ───────────────────────────────────────────────
// wikiTitle = titre exact de la page Wikipedia anglaise
const PLAYERS: { wikiTitle: string; nat: string; pos: string }[] = [
  { wikiTitle: 'Zlatan Ibrahimović',           nat: 'Suédois',     pos: 'Attaquant' },
  { wikiTitle: 'Nicolas Anelka',                nat: 'Français',    pos: 'Attaquant' },
  { wikiTitle: 'Ronaldo (Brazilian footballer)', nat: 'Brésilien',   pos: 'Attaquant' },
  { wikiTitle: 'David Beckham',                 nat: 'Anglais',     pos: 'Milieu' },
  { wikiTitle: 'Patrick Vieira',                nat: 'Français',    pos: 'Milieu' },
  { wikiTitle: 'Clarence Seedorf',              nat: 'Néerlandais', pos: 'Milieu' },
  { wikiTitle: 'Arjen Robben',                  nat: 'Néerlandais', pos: 'Ailier' },
  { wikiTitle: 'Xabi Alonso',                   nat: 'Espagnol',    pos: 'Milieu' },
  { wikiTitle: 'Thierry Henry',                 nat: 'Français',    pos: 'Attaquant' },
  { wikiTitle: 'Ronaldinho',                    nat: 'Brésilien',   pos: 'Attaquant' },
  { wikiTitle: 'Zinedine Zidane',               nat: 'Français',    pos: 'Milieu' },
  { wikiTitle: "Samuel Eto'o",                  nat: 'Camerounais', pos: 'Attaquant' },
  { wikiTitle: 'Didier Drogba',                 nat: 'Ivoirien',    pos: 'Attaquant' },
  { wikiTitle: 'Michael Ballack',               nat: 'Allemand',    pos: 'Milieu' },
  { wikiTitle: 'Rivaldo',                       nat: 'Brésilien',   pos: 'Attaquant' },
  { wikiTitle: 'Arturo Vidal',                  nat: 'Chilien',     pos: 'Milieu' },
  { wikiTitle: 'Lassana Diarra',                nat: 'Français',    pos: 'Milieu' },
  { wikiTitle: 'Emmanuel Petit',                nat: 'Français',    pos: 'Milieu' },
  // ── Ajoute tes joueurs ici ───────────────────────────────────────
]

const DELAY_MS = 1500      // délai entre requêtes Wikipedia
const CONCURRENCY = 3      // requêtes parallèles max

async function importPlayer(p: typeof PLAYERS[0]) {
  // Déjà en base ?
  const { data: existing } = await supabase
    .from('player_cards')
    .select('id, name')
    .ilike('name', p.wikiTitle)
    .maybeSingle()

  if (existing) {
    console.log(`  ⏭  ${p.wikiTitle} (déjà en base)`)
    return
  }

  const career = await fetchPlayerCareer(p.wikiTitle)
  if (!career) {
    console.warn(`  ⚠️  ${p.wikiTitle} — introuvable sur Wikipedia`)
    return
  }

  const mainTeam = career.nationalTeams.find(
    t =>
      !t.club.toLowerCase().includes('u21') &&
      !t.club.toLowerCase().includes('u23') &&
      !t.club.toLowerCase().includes('youth') &&
      !t.club.toLowerCase().includes('olympic'),
  ) ?? null

  const { error } = await supabase.from('player_cards').insert({
    name: p.wikiTitle,
    nationality: p.nat,
    position: p.pos,
    career: career.clubs,
    national_team: mainTeam
      ? { club: mainTeam.club, years: mainTeam.years, apps: mainTeam.apps, goals: mainTeam.goals }
      : null,
  })

  if (error) {
    console.error(`  ❌ ${p.wikiTitle} — ${error.message}`)
  } else {
    console.log(`  ✓  ${p.wikiTitle} (${career.clubs.length} clubs)`)
  }
}

async function runBatch() {
  console.log(`\n🃏 Import de ${PLAYERS.length} joueurs (${CONCURRENCY} en parallèle, ${DELAY_MS}ms de délai)\n`)

  for (let i = 0; i < PLAYERS.length; i += CONCURRENCY) {
    const batch = PLAYERS.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(p => importPlayer(p)))
    if (i + CONCURRENCY < PLAYERS.length) {
      await new Promise(r => setTimeout(r, DELAY_MS))
    }
  }

  const { count } = await supabase
    .from('player_cards')
    .select('*', { count: 'exact', head: true })

  console.log(`\n✅ Terminé — ${count ?? '?'} fiches en base`)
}

runBatch()
