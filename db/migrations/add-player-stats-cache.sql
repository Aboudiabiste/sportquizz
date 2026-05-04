-- Migration : table de cache des stats joueurs (API-Football)
-- Exécuter dans l'éditeur SQL Supabase

create table if not exists player_stats (
  id          uuid primary key default gen_random_uuid(),
  team_id     integer  not null,
  team_name   text     not null,
  player_name text     not null,
  season      integer  not null,
  league_id   integer  not null,
  league_name text     not null,
  goals       integer  not null default 0,
  fetched_at  timestamptz default now(),
  unique(team_id, player_name, season, league_id)
);

create index if not exists idx_player_stats_team    on player_stats(team_id);
create index if not exists idx_player_stats_league  on player_stats(league_id);
create index if not exists idx_player_stats_season  on player_stats(season);

alter table player_stats enable row level security;
create policy "player_stats_read" on player_stats for select using (true);
