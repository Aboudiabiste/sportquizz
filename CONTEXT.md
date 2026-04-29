# CONTEXT — Quiz Sport App
<!-- Fichier optimisé pour reprise rapide par Claude. Lire en premier. Prose minimale. -->

## Stack
Next.js 16 · TypeScript · Tailwind 4 · Supabase (PostgreSQL + Realtime) · Vercel

## Concept
Quiz sportif style Sporcle · tableau à compléter · max 5 joueurs · mobile-first · usage privé · sans auth

## Format de jeu
- Tableau N lignes × M colonnes — colonnes `is_answer:true` sont à deviner
- Timer 5min · fin = tableau complet par un joueur OU timer à 0
- Difficulté → colonnes visibles : easy=tout sauf is_answer / medium=moitié hints / hard=1 hint seul
- Scoring : `individual` | `competitive` (case volée) | `speed` (bonus vitesse)
- Normalisation : sans accent, sans tiret, prénom optionnel, casse ignorée

## Routes
| URL | Rôle |
|-----|------|
| `/` | Accueil |
| `/lobby/new` | Créer partie (choix diff + mode) |
| `/lobby/[code]` | Salle d'attente + lancer |
| `/join` | Rejoindre par code |
| `/play/[code]` | Jeu principal |
| `/screen/[code]` | Écran partagé TV ← **à créer** |
| `/admin` | Création/gestion quiz ← **à créer** |

## API Routes
| Route | Méthode | Action |
|-------|---------|--------|
| `/api/games` | POST | Créer partie |
| `/api/games/[code]` | GET/PATCH | Lire/modifier partie |
| `/api/games/[code]/players` | GET/POST | Joueurs |
| `/api/games/[code]/answers` | POST | Soumettre réponse |

## Schéma BDD (résumé)
```
quizzes  : id, title, sport, columns(jsonb), rows(jsonb)
games    : id, quiz_id, code, status, difficulty, scoring_mode, started_at, winner_id
players  : id, game_id, name, score
answers  : id, game_id, row_index, column_key, player_id
```
RLS activé sur toutes les tables. Lecture publique, insert validé côté DB.

## Fichiers clés
| Fichier | Contenu |
|---------|---------|
| `lib/supabase.ts` | Client, types, `matchesAnswer()`, `getVisibleColumns()` |
| `lib/demo-quiz.ts` | Quiz démo hardcodé (buteurs LDC) |
| `app/components/QuizTable.tsx` | Composant tableau interactif |
| `app/components/Timer.tsx` | Timer dégressif avec barre |
| `db/schema.sql` | Schema + RLS + fonctions Supabase |

## APIs sportives
| Sport | API | Coût |
|-------|-----|------|
| Football | api-sports.io/football | Gratuit 100/j |
| F1 | api.jolpi.ca/ergast | Gratuit illimité |
| Tennis/Cyclisme | api-sports.io | Gratuit 100/j |
| Génération texte | Gemini Flash (clé perso Ewan) | Gratuit 1M tok/j |

## Variables d'environnement
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
API_FOOTBALL_KEY
JOLPICA_BASE_URL=https://api.jolpi.ca/ergast
GEMINI_API_KEY
```

## État
- [x] Schema BDD + RLS + Supabase configuré
- [x] Types, normalisation, difficulté auto
- [x] Composants `QuizTable`, `Timer`
- [x] Pages : `/`, `/lobby/new`, `/lobby/[code]`, `/join`, `/play/[code]`, `/screen/[code]`
- [x] API routes sécurisées (whitelist, validation, 5 joueurs max)
- [x] Page admin `/admin` — création/gestion quiz manuelle
- [x] API `/api/quizzes` GET/POST + `/api/quizzes/[id]` GET/DELETE
- [x] Quiz lié à la partie (quiz_id) — fallback démo si null
- [ ] Tests multijoueur réels
- [ ] API-Football → génération auto
- [ ] Génération par texte (Gemini)
- [ ] F1 (Jolpica) · Tennis · Cyclisme

## Prochaine priorité
API-Football : récupérer stats joueurs LDC → générer quiz automatiquement

## Décisions clés
| Date | Décision |
|------|----------|
| 2026-04-29 | Pas de buzzer — réponses simultanées |
| 2026-04-29 | Format tableau (pas QCM) — QCM prévu phase ultérieure |
| 2026-04-29 | Règle auto difficulté (pas config manuelle) |
| 2026-04-29 | Génération texte = pattern matching + Gemini Flash gratuit |
| 2026-04-29 | Gemini = clé perso Ewan |
| 2026-04-29 | Coût cible = 0€ (Supabase free + Vercel free + APIs gratuites) |
