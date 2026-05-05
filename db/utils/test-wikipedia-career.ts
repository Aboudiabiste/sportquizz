// Test rapide du scraper Wikipedia — pas inséré en base
import { fetchPlayerCareer } from './wikipedia-career'

const TEST_PLAYERS = [
  'Zlatan Ibrahimović',
  'Nicolas Anelka',
  'Ronaldo (Brazilian footballer)',
  'Zinedine Zidane',
]

async function test() {
  for (const name of TEST_PLAYERS) {
    console.log(`\n--- ${name} ---`)
    const career = await fetchPlayerCareer(name)
    if (!career) { console.log('NOT FOUND'); continue }
    const senior = career.clubs.filter(c => !c.isLoan)
    senior.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.club} (${s.years}) — ${s.apps ?? '?'} matchs, ${s.goals ?? '?'} buts`)
    })
    await new Promise(r => setTimeout(r, 400))
  }
}

test()
