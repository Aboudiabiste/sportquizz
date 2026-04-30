import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Lazy init : créé à la première requête, pas au chargement du module
// → le build Vercel ne plante pas même si les env vars ne sont pas encore injectées
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Variables Supabase manquantes (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
  return createClient(url, key)
}
