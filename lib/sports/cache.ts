import fs from 'fs'
import path from 'path'

const CACHE_DIR = path.join(process.cwd(), 'db', 'cache')

function cachePath(provider: string, key: string): string {
  const safe = key.replace(/[^a-z0-9\-_]/gi, '_')
  return path.join(CACHE_DIR, provider, `${safe}.json`)
}

export function readCache<T>(provider: string, key: string): T | null {
  try {
    const file = cachePath(provider, key)
    if (!fs.existsSync(file)) return null
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return null
  }
}

export function writeCache(provider: string, key: string, data: unknown): void {
  try {
    const file = cachePath(provider, key)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
  } catch (e) {
    // Read-only filesystem (Vercel runtime) — silently skip
    console.warn('[cache] write skipped:', e instanceof Error ? e.message : e)
  }
}

/** Fetch with local file cache. key = human-readable slug e.g. "ucl-2014-scorers" */
export async function fetchWithCache<T>(
  provider: string,
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = readCache<T>(provider, key)
  if (cached !== null) {
    console.log(`[cache] hit: ${provider}/${key}`)
    return cached
  }
  console.log(`[cache] miss: ${provider}/${key} — calling API`)
  const data = await fetcher()
  writeCache(provider, key, data)
  return data
}
