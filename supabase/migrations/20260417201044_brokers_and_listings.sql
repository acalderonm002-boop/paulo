-- Universal broker profile schema.
-- Drops legacy single-tenant tables (site_config, services, testimonials,
-- clients, properties, property_images, contact_submissions) and introduces
-- a multi-tenant `brokers` table plus per-broker `listings`.
--
-- RLS: anon + authenticated can SELECT from both tables. All writes go
-- through the service_role key (no public write policies).

begin;

-- ---------------------------------------------------------------------------
-- Drop legacy editor + earlier pivot scaffolding if present.
-- ---------------------------------------------------------------------------
drop table if exists public.profile_events     cascade;
drop table if exists public.contact_submissions cascade;
drop table if exists public.property_images    cascade;
drop table if exists public.properties         cascade;
drop table if exists public.zones              cascade;
drop table if exists public.testimonials       cascade;
drop table if exists public.agents             cascade;
drop table if exists public.clients            cascade;
drop table if exists public.services           cascade;
drop table if exists public.site_config        cascade;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'listing_operacion') then
    create type public.listing_operacion as enum ('venta', 'renta');
  end if;
  if not exists (select 1 from pg_type where typname = 'listing_estado') then
    create type public.listing_estado as enum ('activo', 'vendido', 'pausado');
  end if;
end$$;

-- ---------------------------------------------------------------------------
-- Helper: touch updated_at on row update.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- brokers
-- ---------------------------------------------------------------------------
create table public.brokers (
  id                      uuid primary key default gen_random_uuid(),
  slug                    text not null unique,
  nombre                  text not null,
  headline                text,
  bio_corta               text,
  bio_larga               text,
  foto_url                text,
  banner_url              text,
  telefono                text,
  whatsapp                text,
  email                   text,
  instagram               text,
  facebook                text,
  linkedin                text,
  ciudad                  text,
  anios_experiencia       integer,
  certificaciones         jsonb not null default '[]'::jsonb,
  zonas_especializacion   text[] not null default array[]::text[],
  stats                   jsonb not null default jsonb_build_object(
                            'propiedades_vendidas', 0,
                            'transacciones', 0,
                            'clientes', 0
                          ),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index brokers_slug_idx on public.brokers (slug);

create trigger brokers_set_updated_at
before update on public.brokers
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create table public.listings (
  id                  uuid primary key default gen_random_uuid(),
  broker_id           uuid not null references public.brokers(id) on delete cascade,
  slug                text not null,
  titulo              text not null,
  descripcion         text,
  tipo_operacion      public.listing_operacion not null,
  precio              numeric(14, 2) not null,
  moneda              text not null default 'MXN',
  tipo_propiedad      text,
  recamaras           integer,
  banios              numeric(4, 1),
  m2_construccion     numeric(10, 2),
  m2_terreno          numeric(10, 2),
  estacionamientos    integer,
  colonia             text,
  ciudad              text,
  estado              text,
  lat                 numeric(10, 7),
  lng                 numeric(10, 7),
  fotos               text[] not null default array[]::text[],
  amenidades          text[] not null default array[]::text[],
  estado_publicacion  public.listing_estado not null default 'activo',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (broker_id, slug)
);

create index listings_broker_idx             on public.listings (broker_id);
create index listings_estado_publicacion_idx on public.listings (estado_publicacion);
create index listings_tipo_operacion_idx     on public.listings (tipo_operacion);

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.brokers  enable row level security;
alter table public.listings enable row level security;

-- Public (anon + authenticated) read access.
create policy "Brokers are readable by anyone"
  on public.brokers for select
  to anon, authenticated
  using (true);

create policy "Listings are readable by anyone"
  on public.listings for select
  to anon, authenticated
  using (true);

-- Writes intentionally have no policy — only the service_role key
-- (which bypasses RLS) can insert/update/delete.

commit;
