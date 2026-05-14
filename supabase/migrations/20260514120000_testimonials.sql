-- Testimonials for homepage carousel. Tag rows with sport names matching lib/site-data SPORTS.
-- Empty sports array = general / sport-agnostic (shown after matched sport, before other sports).

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text not null,
  image_url text,
  sports text[] not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_sports_gin on public.testimonials using gin (sports);

alter table public.testimonials enable row level security;

drop policy if exists "Allow public read testimonials" on public.testimonials;
create policy "Allow public read testimonials" on public.testimonials for select to anon, authenticated using (true);
