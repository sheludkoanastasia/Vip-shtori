-- Заявки с сайта. Выполнить в Supabase → SQL Editor → Run.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_digits text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_phone_digits_idx on public.leads (phone_digits);
create index if not exists leads_name_idx on public.leads (name);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Доступ только через service_role ключ на сервере (не anon с клиента).
alter table public.leads enable row level security;

-- Явные права для серверного ключа (на некоторых проектах без этого insert падает).
grant usage on schema public to service_role;
grant all on table public.leads to service_role;
