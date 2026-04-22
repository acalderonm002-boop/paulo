-- Expand brokers schema with LinkedIn-style profile fields.
-- All new columns are nullable; each profile section renders only when it
-- has data. `certificaciones` stays jsonb but should now use the richer
-- shape { nombre_completo, siglas, año, otorgante }. Existing entries that
-- follow the older { nombre, descripcion, anio } shape remain valid — the
-- UI will prefer the richer fields when present and fall back gracefully.

begin;

alter table public.brokers
  add column if not exists filosofia       text,
  add column if not exists tipos_propiedad text[] not null default array[]::text[],
  add column if not exists servicios       text[] not null default array[]::text[],
  add column if not exists idiomas         jsonb  not null default '[]'::jsonb,
  add column if not exists educacion       jsonb  not null default '[]'::jsonb,
  add column if not exists cursos          jsonb  not null default '[]'::jsonb,
  add column if not exists trayectoria     jsonb  not null default '[]'::jsonb,
  add column if not exists publicaciones   jsonb  not null default '[]'::jsonb,
  add column if not exists awards          jsonb  not null default '[]'::jsonb,
  add column if not exists asociaciones    jsonb  not null default '[]'::jsonb,
  add column if not exists voluntariado    jsonb  not null default '[]'::jsonb,
  add column if not exists featured        jsonb  not null default '[]'::jsonb;

-- `banner_url` already exists from the initial migration — no-op here.

commit;
