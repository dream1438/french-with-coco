-- Languages with Coco: course + accounts database (Supabase / Postgres).
-- Run once in the Supabase SQL editor. Safe to re-run (IF NOT EXISTS / OR REPLACE).

-- ---------- course structure (public, read-only for visitors) ----------
create table if not exists public.languages (
  id        text primary key,            -- 'fr', 'es', ...
  name      text not null,               -- 'French'
  name_ar   text,
  sort      int  not null default 0,
  published boolean not null default true
);

create table if not exists public.levels (
  id          text primary key,          -- 'fr-A1'
  language_id text not null references public.languages(id) on delete cascade,
  code        text not null,             -- 'A1'
  title       text,
  title_ar    text,
  sort        int  not null default 0,
  unique (language_id, code)
);

create table if not exists public.units (
  id       text primary key,             -- 'fr-A1-1.1'
  level_id text not null references public.levels(id) on delete cascade,
  code     text not null,                -- '1.1'
  title    text not null,                -- 'First contact'
  title_ar text,
  sort     int  not null default 0,
  unique (level_id, code)
);

create table if not exists public.lessons (
  id          text primary key,          -- 'fr-A1-01'
  language_id text not null references public.languages(id) on delete cascade,
  unit_id     text not null references public.units(id) on delete cascade,
  code        text not null,             -- 'A1-01' (used in site URLs)
  n           int  not null,             -- order inside the level
  slug        text,
  title       text not null,             -- target-language title ('Bonjour !')
  title_en    text,
  title_ar    text,
  length      text,
  video_en    text,                      -- YouTube id (English narration)
  video_ar    text,                      -- YouTube id (Arabic narration), empty until published
  worksheet   text,                      -- Google Drive file id
  content     jsonb not null default '{}'::jsonb,  -- vocab, quiz, dialogue, explain, recap, hooks
  published   boolean not null default true,
  updated_at  timestamptz not null default now(),
  unique (language_id, code)
);
create index if not exists lessons_unit_idx on public.lessons(unit_id, n);

-- ---------- learners ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  ui_lang      text not null default 'en',        -- 'en' | 'ar'
  xp           int  not null default 0,
  days         jsonb not null default '[]'::jsonb, -- active days, for the streak
  badges       jsonb not null default '[]'::jsonb,
  extra        jsonb not null default '{}'::jsonb, -- flashcards, speaking stats, sound setting
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  text not null references public.lessons(id) on delete cascade,
  watched    boolean not null default false,
  words      boolean not null default false,
  sheet      boolean not null default false,
  quiz_best  int,
  quiz_last  int,
  games      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- New sign-up -> empty profile row
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- row level security ----------
alter table public.languages       enable row level security;
alter table public.levels          enable row level security;
alter table public.units           enable row level security;
alter table public.lessons         enable row level security;
alter table public.profiles        enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "read languages" on public.languages;
create policy "read languages" on public.languages for select using (published);
drop policy if exists "read levels" on public.levels;
create policy "read levels" on public.levels for select using (true);
drop policy if exists "read units" on public.units;
create policy "read units" on public.units for select using (true);
drop policy if exists "read lessons" on public.lessons;
create policy "read lessons" on public.lessons for select using (published);

drop policy if exists "own profile read" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
drop policy if exists "own profile update" on public.profiles;
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "own profile insert" on public.profiles;
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "own progress" on public.lesson_progress;
create policy "own progress" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
