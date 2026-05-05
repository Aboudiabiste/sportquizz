-- Migration : mode "Devine la Carrière"
-- À exécuter dans le Dashboard Supabase > SQL Editor

-- ── 1. Fiches joueurs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_cards (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  nationality  text,
  position     text,
  birth_year   integer,
  career       jsonb NOT NULL DEFAULT '[]',   -- ClubStint[]
  national_team jsonb,                         -- { club, years, apps, goals }
  created_at   timestamptz DEFAULT now()
);

-- Index de recherche plein texte insensible aux accents
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE INDEX IF NOT EXISTS idx_player_cards_name ON player_cards (lower(unaccent(name)));

-- ── 2. Sessions "Devine la Carrière" ───────────────────────────────
CREATE TABLE IF NOT EXISTS carriere_sessions (
  id                    uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code                  char(6) NOT NULL UNIQUE,
  mode                  text NOT NULL CHECK (mode IN ('host', 'chain')),
  status                text NOT NULL DEFAULT 'lobby' CHECK (status IN ('lobby', 'active', 'finished')),

  -- Joueur en cours
  current_player_id     uuid REFERENCES player_cards(id),

  -- Mode host : révélation progressive ou tout d'un coup
  reveal_mode           text NOT NULL DEFAULT 'progressive' CHECK (reveal_mode IN ('all', 'progressive')),
  revealed_count        integer NOT NULL DEFAULT 0,

  -- État du round courant
  round_found           boolean NOT NULL DEFAULT false,
  round_found_by        text,

  -- Mode chain : suivi des manches
  rounds_total          integer NOT NULL DEFAULT 5,
  rounds_done           integer NOT NULL DEFAULT 0,
  used_player_ids       uuid[] NOT NULL DEFAULT '{}',

  -- Affichage transition (toast "trouvé par X")
  last_found_player_name text,
  last_found_by_name     text,

  host_key              text,

  created_at            timestamptz DEFAULT now(),
  started_at            timestamptz,
  finished_at           timestamptz
);

-- ── 3. Joueurs dans une session ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS carriere_players (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  uuid NOT NULL REFERENCES carriere_sessions(id) ON DELETE CASCADE,
  name        text NOT NULL,
  score       integer NOT NULL DEFAULT 0,
  joined_at   timestamptz DEFAULT now()
);

-- ── 4. Realtime ─────────────────────────────────────────────────────
-- À exécuter séparément si la publication n'est pas "FOR ALL TABLES"
-- ALTER PUBLICATION supabase_realtime ADD TABLE carriere_sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE carriere_players;
