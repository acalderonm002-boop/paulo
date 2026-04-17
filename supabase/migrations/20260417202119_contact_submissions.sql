-- Leads captured by the Contacto tab (and the property detail sidebar).
-- One row per submission, optionally tied to a broker and listing.

begin;

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  broker_id   uuid references public.brokers(id) on delete set null,
  listing_id  uuid references public.listings(id) on delete set null,
  name        text not null,
  email       text,
  phone       text,
  message     text,
  source      text not null default 'website',
  created_at  timestamptz not null default now()
);

create index if not exists contact_submissions_broker_idx
  on public.contact_submissions (broker_id);
create index if not exists contact_submissions_listing_idx
  on public.contact_submissions (listing_id);

alter table public.contact_submissions enable row level security;

-- No SELECT policy: only the service_role key can read/write leads.
-- Writes flow through the server's /api/contact route which uses
-- getSupabaseAdmin() and bypasses RLS.

commit;
