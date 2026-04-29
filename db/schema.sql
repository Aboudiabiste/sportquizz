-- Quiz Sport App – Schema v2 + RLS
-- Exécuter dans l'éditeur SQL Supabase

-- ── Tables ────────────────────────────────────────────────────────

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sport text not null default 'football',
  columns jsonb not null,   -- QuizColumn[]
  rows jsonb not null,      -- Record<string,string>[]
  created_at timestamptz default now()
);

create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references quizzes(id) on delete set null,
  code text not null unique,
  status text not null default 'lobby' check (status in ('lobby','active','finished')),
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  scoring_mode text not null default 'individual' check (scoring_mode in ('individual','competitive','speed')),
  started_at timestamptz,
  finished_at timestamptz,
  winner_id uuid,
  created_at timestamptz default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 20),
  score integer not null default 0 check (score >= 0),
  joined_at timestamptz default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  row_index integer not null check (row_index >= 0),
  column_key text not null check (char_length(column_key) > 0),
  player_id uuid not null references players(id) on delete cascade,
  answered_at timestamptz default now(),
  unique(game_id, row_index, column_key, player_id)
);

-- ── Indexes ───────────────────────────────────────────────────────

create index if not exists idx_games_code     on games(code);
create index if not exists idx_players_game   on players(game_id);
create index if not exists idx_answers_game   on answers(game_id);
create index if not exists idx_answers_player on answers(player_id);

-- ── Realtime ──────────────────────────────────────────────────────
-- À activer dans Supabase Dashboard > Database > Replication
-- Tables : games, players, answers → REPLICA IDENTITY FULL

-- ── Functions ─────────────────────────────────────────────────────

create or replace function generate_game_code()
returns text language plpgsql as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
begin
  loop
    result := '';
    for i in 1..6 loop
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;
    exit when not exists (select 1 from games where code = result);
  end loop;
  return result;
end;
$$;

create or replace function increment_player_score(p_player_id uuid, p_points integer default 1)
returns void language sql as $$
  update players set score = score + p_points where id = p_player_id;
$$;

-- ── Row Level Security ────────────────────────────────────────────

alter table quizzes enable row level security;
alter table games   enable row level security;
alter table players enable row level security;
alter table answers enable row level security;

-- quizzes : lecture publique, écriture interdite côté client (admin via service_role)
create policy "quizzes_read" on quizzes for select using (true);

-- games : lecture publique par code, insert via API route (anon), update via API route
create policy "games_read"   on games for select using (true);
create policy "games_insert" on games for insert with check (true);
create policy "games_update" on games for update using (true);

-- players : lecture publique, insert si la partie existe et est ouverte
create policy "players_read"   on players for select using (true);
create policy "players_insert" on players for insert with check (
  exists (
    select 1 from games
    where games.id = game_id
    and games.status in ('lobby', 'active')
  )
);

-- answers : lecture publique, insert si le joueur appartient à la partie active
create policy "answers_read"   on answers for select using (true);
create policy "answers_insert" on answers for insert with check (
  exists (
    select 1 from games
    where games.id = game_id
    and games.status = 'active'
  )
  and exists (
    select 1 from players
    where players.id = player_id
    and players.game_id = answers.game_id
  )
);
