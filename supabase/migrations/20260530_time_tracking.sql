-- categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#ffffff',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table categories enable row level security;
create policy "categories: own crud" on categories
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- time_logs
create table if not exists time_logs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  category_id       uuid references categories(id) on delete set null,
  title             text not null,
  duration_minutes  integer not null check (duration_minutes >= 1),
  note              text,
  logged_at         timestamptz not null default now(),
  visibility        text not null default 'private' check (visibility in ('public','private')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table time_logs enable row level security;
create policy "time_logs: own crud" on time_logs
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create policy "time_logs: public read" on time_logs
  for select using (visibility = 'public');

-- weekly_goals
create table if not exists weekly_goals (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  target_minutes   integer not null check (target_minutes >= 1),
  week_start_date  date not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, week_start_date)
);
alter table weekly_goals enable row level security;
create policy "weekly_goals: own crud" on weekly_goals
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- index for fast dashboard queries
create index if not exists time_logs_user_logged_at on time_logs(user_id, logged_at desc);
create index if not exists time_logs_category on time_logs(category_id);
