/**
 * Utilitaire : récupère la carrière d'un joueur depuis l'infobox Wikipedia (EN)
 * Format infobox : clubs1/years1/caps1/goals1, clubs2/years2/... (numérotés)
 */

export interface ClubStint {
  club: string
  years: string
  apps: number | null
  goals: number | null
  isLoan: boolean
}

export interface PlayerCareer {
  name: string
  clubs: ClubStint[]         // clubs seniors
  nationalTeams: ClubStint[] // sélections nationales
}

function cleanWiki(text: string): string {
  return text
    .replace(/\{\{[Nn]owrap\|([^}]+)\}\}/g, '$1')
    .replace(/\{\{flagicon\|[^}]+\}\}/g, '')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\(loan\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extrait la valeur d'un champ infobox en gérant les templates imbriqués
function extractField(wikitext: string, fieldName: string): string | null {
  const re = new RegExp(`\\|\\s*${fieldName}\\s*=`, 'i')
  const match = re.exec(wikitext)
  if (!match) return null

  let i = match.index + match[0].length
  let depth = 0
  const start = i

  while (i < wikitext.length) {
    const c = wikitext[i]
    const c2 = wikitext[i + 1]

    if ((c === '{' && c2 === '{') || (c === '[' && c2 === '[')) {
      depth++; i += 2
    } else if ((c === '}' && c2 === '}') || (c === ']' && c2 === ']')) {
      if (depth === 0) break
      depth--; i += 2
    } else if (c === '|' && depth === 0) {
      break
    } else {
      i++
    }
  }

  return wikitext.slice(start, i).trim()
}

export async function fetchPlayerCareer(wikiTitle: string): Promise<PlayerCareer | null> {
  const params = new URLSearchParams({
    action: 'query',
    titles: wikiTitle,
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    format: 'json',
    formatversion: '2',
  })

  let res: Response | null = null
  for (let attempt = 1; attempt <= 4; attempt++) {
    res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { 'User-Agent': 'QuizFootBot/1.0 (personal project)' },
    })
    if (res.status !== 429) break
    const wait = attempt * 4000
    console.warn(`  ⏳ 429 rate limit — retry ${attempt}/4 dans ${wait / 1000}s`)
    await new Promise(r => setTimeout(r, wait))
  }
  if (!res || !res.ok) { console.warn(`⚠️  HTTP ${res?.status} for ${wikiTitle}`); return null }
  let data: any
  try { data = await res.json() } catch { console.warn(`⚠️  Invalid JSON for ${wikiTitle}`); return null }
  const page = data.query.pages[0]
  if (page.missing) { console.warn(`⚠️  Page not found: ${wikiTitle}`); return null }

  const wikitext: string = page.revisions[0].slots.main.content
  const clubs: ClubStint[] = []

  for (let n = 1; n <= 20; n++) {
    const clubRaw = extractField(wikitext, `clubs${n}`)
    if (!clubRaw) break

    const yearsRaw = extractField(wikitext, `years${n}`) ?? ''
    const capsRaw  = extractField(wikitext, `caps${n}`)  ?? ''
    const goalsRaw = extractField(wikitext, `goals${n}`) ?? ''

    const clubName = cleanWiki(clubRaw)
    const isLoan   = clubRaw.includes('→') || clubRaw.toLowerCase().includes('loan')

    clubs.push({
      club:   clubName,
      years:  cleanWiki(yearsRaw),
      apps:   capsRaw  ? (parseInt(capsRaw.replace(/\D/g, '')) || null) : null,
      goals:  goalsRaw ? (parseInt(goalsRaw.replace(/\D/g, '')) || null) : null,
      isLoan,
    })
  }

  // Sélections nationales
  const nationalTeams: ClubStint[] = []
  for (let n = 1; n <= 10; n++) {
    const teamRaw = extractField(wikitext, `nationalteam${n}`)
    if (!teamRaw) break
    const yearsRaw = extractField(wikitext, `nationalyears${n}`) ?? ''
    const capsRaw  = extractField(wikitext, `nationalcaps${n}`)  ?? ''
    const goalsRaw = extractField(wikitext, `nationalgoals${n}`) ?? ''
    nationalTeams.push({
      club:   cleanWiki(teamRaw),
      years:  cleanWiki(yearsRaw),
      apps:   capsRaw  ? (parseInt(capsRaw.replace(/\D/g, ''))  || null) : null,
      goals:  goalsRaw ? (parseInt(goalsRaw.replace(/\D/g, '')) || null) : null,
      isLoan: false,
    })
  }

  return clubs.length > 0 ? { name: wikiTitle, clubs, nationalTeams } : null
}
