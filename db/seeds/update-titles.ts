/**
 * Liste + mise à jour des titres trop longs
 * Run : npx tsx db/seeds/update-titles.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updates: { old: string; title: string; description: string }[] = [
  {
    old: 'Vainqueurs de la Ligue des Champions (1996–2024)',
    title: 'Vainqueurs LDC',
    description: 'Finales de la Ligue des Champions 1996–2024',
  },
  {
    old: 'Vainqueurs Coupe UEFA / Europa League (1996–2024)',
    title: 'Vainqueurs Europa League',
    description: 'Coupe UEFA / Europa League 1996–2024',
  },
  {
    old: 'Palmarès Ballon d\'Or (1996–2024)',
    title: 'Palmarès Ballon d\'Or',
    description: 'Lauréats France Football 1996–2024',
  },
  {
    old: 'Top sélectionnés de l\'Équipe de France (1996–2025)',
    title: 'Top sélectionnés EDF',
    description: 'Joueurs les plus capés des Bleus depuis 1996',
  },
  {
    old: 'Vainqueurs du Tour de France (1996–2024)',
    title: 'Vainqueurs Tour de France',
    description: 'Lauréats officiels 1996–2024',
  },
  {
    old: 'Vainqueurs du Giro d\'Italia (1996–2024)',
    title: 'Vainqueurs Giro d\'Italia',
    description: 'Tour d\'Italie 1996–2024',
  },
  {
    old: 'Vainqueurs de la Vuelta a España (1996–2024)',
    title: 'Vainqueurs Vuelta a España',
    description: 'Tour d\'Espagne 1996–2024',
  },
  {
    old: 'Top buteurs Coupe du Monde FIFA all-time',
    title: 'Top buteurs Coupe du Monde',
    description: 'Meilleurs buteurs all-time de la FIFA World Cup',
  },
  {
    old: 'Top buteurs Ligue des Champions all-time',
    title: 'Top buteurs LDC',
    description: 'Meilleurs buteurs all-time de la Ligue des Champions',
  },
  {
    old: 'Champions UEFA par édition depuis 1996',
    title: 'Champions UEFA',
    description: 'Vainqueurs de la LDC par édition depuis 1996',
  },
  {
    old: 'Top buteurs all-time en Ligue des Champions',
    title: 'Top buteurs LDC',
    description: 'Meilleurs buteurs all-time de la Ligue des Champions',
  },
]

async function run() {
  // Afficher tous les titres actuels
  const { data: all } = await supabase.from('quizzes').select('id, title, description').order('created_at')
  console.log('\n📋 Quizzes actuels :')
  all?.forEach(q => console.log(`  [${q.id.slice(0, 8)}] "${q.title}"`))

  console.log('\n✏️  Mise à jour des titres :')
  for (const u of updates) {
    const { data, error } = await supabase
      .from('quizzes')
      .update({ title: u.title, description: u.description })
      .eq('title', u.old)
      .select('id, title')
    if (error) console.error(`  ❌ "${u.old}": ${error.message}`)
    else if (data?.length) console.log(`  ✅ "${u.old}" → "${u.title}"`)
    else console.log(`  ⚠️  Non trouvé : "${u.old}"`)
  }
}

run()
