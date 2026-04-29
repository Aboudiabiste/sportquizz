# Consignes – WebApp Quiz Sport (style Sporcle)

_Dernière mise à jour : 2026-04-29_

---

## Objectif

WebApp de quiz sportif pour usage privé, inspirée de Sporcle :
- Tableau à compléter avec indices progressifs selon difficulté
- Multijoueur synchronisé en temps réel (max 5 joueurs)
- Questions générées depuis des APIs sportives
- Mode individuel ou par équipe, compétitif ou coopératif

---

## Format de jeu — Liste/Tableau à compléter

### Principe
- Un quiz = un tableau avec N lignes et M colonnes
- Les joueurs doivent trouver les valeurs cachées en tapant leurs réponses
- Un timer tourne. La partie s'arrête quand :
  - Un joueur complète tout le tableau (il gagne), OU
  - Le timer atteint 0 (gagne celui qui a le plus de cases)
- Pas de rôle host fixe — n'importe qui peut lancer la partie

### Difficulté (règle auto sur les colonnes)
| Niveau | Colonnes visibles |
|--------|------------------|
| Facile | Tout sauf la colonne "réponse" (ex: Joueur) |
| Moyen | Seulement la moitié des colonnes hints + 1 indice fixe |
| Difficile | Seulement 1 colonne indice visible, tout le reste caché |

La colonne "réponse" (clé) est **toujours** cachée.

### Normalisation des réponses
- Accents ignorés (Zidane = Zidanè)
- Tirets ignorés (Henry = Thierry-Henry)
- Prénom optionnel ("Ronaldo" matche "Cristiano Ronaldo" ET "Ronaldo Nazário")
- Casse ignorée

### Modes de scoring (choix au lancement)
1. **Compétitif** : premier à trouver une réponse = il "vole" la case (+1pt), les autres ne peuvent plus la prendre
2. **Individuel** : tout le monde score indépendamment, trouver une réponse = +1pt même si déjà trouvée
3. **Vitesse** : +1pt si correct, bonus décroissant selon le temps mis

---

## Format QCM (futur)
Prévu en Phase ultérieure. Même structure de partie, questions à choix multiples.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| Backend | API routes Next.js |
| Base de données | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime |
| Hosting | Vercel |
| APIs sportives | API-Football (foot), Jolpica (F1), API-Sports (tennis/cyclisme) |
| Génération quiz | Pattern matching d'abord, Gemini Flash (gratuit) si besoin |

---

## Modèle de données (tableau à compléter)

```
Quiz
  title: string
  sport: string
  columns: [
    { key: string, label: string, is_answer: boolean, hint_order: number }
  ]
  rows: [
    { [columnKey]: string }  -- une ligne = une réponse attendue
  ]

Game (session de jeu)
  quiz_id
  code (6 chars)
  status: lobby | active | finished
  difficulty: easy | medium | hard
  scoring_mode: competitive | individual | speed
  started_at

Player
  game_id, name, score

Answer (case remplie par un joueur)
  game_id, quiz_id, row_index, column_key, player_id, answered_at
```

---

## Modules

### 1. Page Joueur (`/play/[code]`)
- Rejoindre avec code + pseudo
- Voir le tableau avec cases vides
- Taper une réponse → validation immédiate avec normalisation
- Voir les cases se remplir en temps réel
- Timer + score

### 2. Écran partagé (`/screen/[code]`)
- Tableau en grand, cases se remplissant en live
- Classement joueurs
- Timer

### 3. Lobby (`/lobby/[code]`)
- Liste des joueurs connectés
- Choix difficulté + mode scoring
- Bouton "Lancer" (tout le monde peut)

### 4. Admin — Création de quiz (`/admin`)
- Créer un quiz manuellement (colonnes + lignes)
- Générer un quiz depuis une API sportive (requête texte libre)
- Bibliothèque de quiz réutilisables

---

## APIs sportives

| Sport | API | Gratuit |
|-------|-----|---------|
| Football | API-Football (api-sports.io) | 100 req/jour |
| F1 | Jolpica (jolpi.ca/ergast) | Illimité |
| Tennis | API-Sports Tennis | 100 req/jour |
| Cyclisme | API-Sports Cycling | 100 req/jour |

### Génération de quiz par texte
- Parsing de la requête (pattern matching en premier)
- Mapping vers l'API correspondante
- Construction du tableau automatique
- Fallback : Gemini Flash (gratuit, 1M tokens/jour) pour les requêtes complexes

---

## Roadmap

- [ ] **Phase 1** — MVP solo : tableau à compléter, timer, normalisation, 1 quiz hardcodé
- [ ] **Phase 2** — Multijoueur : rooms, sync Supabase Realtime, 3 modes scoring
- [ ] **Phase 3** — Admin : création manuelle de quiz, bibliothèque
- [ ] **Phase 4** — API Football : génération semi-auto
- [ ] **Phase 5** — Génération par texte : pattern matching + Gemini Flash
- [ ] **Phase 6** — Autres sports : F1 (Jolpica), Tennis, Cyclisme

---

## Règles de conception

- **Mobile-first** — les joueurs jouent sur téléphone
- **Grand écran** — l'écran partagé est projeté sur TV
- **Max 5 joueurs** par partie
- **Usage privé** — pas d'auth, juste un code de partie
- **Quiz réutilisables** — une session de jeu ≠ un quiz
- **UI sombre** style sportif

---

## Évolutions / décisions

| Date | Décision |
|------|----------|
| 2026-04-29 | Initialisation à partir du guide PDF |
| 2026-04-29 | Abandon du buzzer — réponses simultanées style Sporcle |
| 2026-04-29 | Format principal : tableau à compléter (pas QCM) |
| 2026-04-29 | Règle auto pour difficulté (pas de config manuelle par colonne) |
| 2026-04-29 | Génération texte : pattern matching + Gemini Flash (pas Claude API) |
| 2026-04-29 | Normalisation : accents, tirets, prénoms tous ignorés |
| 2026-04-29 | Fin de partie : premier tableau complet OU timer à 0 |
| 2026-04-29 | 3 modes scoring au choix au lancement |
