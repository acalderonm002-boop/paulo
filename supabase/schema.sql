-- =============================================================================
-- Paulo Leal Saviñón — full Supabase schema
-- Idempotent: safe to run multiple times against an existing database.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- site_config (single row, id = 1)
-- -----------------------------------------------------------------------------
create table if not exists site_config (
  id int primary key default 1,
  hero_tagline text not null default 'ASESOR INMOBILIARIO CERTIFICADO · MONTERREY, N.L.',
  hero_title text not null default '¿Buscas comprar, rentar, vender o invertir en bienes raíces?',
  hero_subtitle text,
  hero_image_url text,
  hero_stat_1_number text not null default '3+',
  hero_stat_1_label text not null default 'Años de Experiencia',
  hero_stat_2_number text not null default '50+',
  hero_stat_2_label text not null default 'Propiedades',
  hero_stat_3_number text not null default 'AMPI',
  hero_stat_3_label text not null default 'Certificado',
  about_tagline text not null default 'SOBRE MÍ',
  about_title text not null default 'Estrategia comercial con trato humano',
  about_text_1 text,
  about_text_2 text,
  about_image_url text,
  about_certification_text text not null default 'Certificado por AMPI y con amplia red de contactos legales, notariales y financieros.',
  about_badge_number text not null default '3+',
  about_badge_label text not null default 'años de experiencia',
  video_section_tagline text not null default 'CONÓCEME',
  video_section_title text not null default 'Me dedico a encontrar la mejor propiedad para tu empresa o para tu familia.',
  video_section_subtitle text not null default 'Estoy a tus órdenes para dar el siguiente paso.',
  video_section_url text,
  content_section_tagline text not null default 'CONTENIDO',
  content_section_title text not null default 'Los mejores consejos del mundo inmobiliario',
  content_section_url text,
  cta_title text not null default '¿Listo para dar el siguiente paso?',
  cta_subtitle text not null default 'Agenda una cita sin compromiso y platiquemos sobre tu próximo proyecto inmobiliario.',
  instagram_url text not null default 'https://www.instagram.com/paulolealsav/',
  facebook_url text not null default 'https://www.facebook.com/people/Paulo-Leal-Bienes-Ra%C3%ADces/61572709677439/',
  tiktok_url text not null default 'https://www.tiktok.com/@paulolealsav',
  linkedin_url text not null default 'https://www.linkedin.com/in/paulo-leal-savi%C3%B1on',
  whatsapp_number text not null default '528128625350',
  email text not null default 'paulo.leal@w-p.mx',
  phone text not null default '81 2862 5350',
  address text not null default 'San Pedro Garza García, Nuevo León',
  updated_at timestamptz not null default now(),
  constraint site_config_single_row check (id = 1)
);

insert into site_config (
  id,
  hero_subtitle,
  hero_image_url,
  about_text_1,
  about_text_2,
  about_image_url,
  video_section_url,
  content_section_url
) values (
  1,
  'Te acompaño en cada paso del proceso inmobiliario — compra, venta, renta o inversión — con estrategia, transparencia y un trato personalizado.',
  '/images/paulo-portrait.jpg',
  'Con más de 3 años en el sector y el respaldo de la inmobiliaria Walls & People, combino estrategia comercial con un trato humano y transparente. Me especializo en conectar personas con propiedades que no solo cumplen expectativas, sino que sean el proyecto ideal para ellos.',
  'Soy egresado de la UDEM de la Ingeniería en Gestión Empresarial e Ingeniería Industrial y de Sistemas. Mis estudios me han ayudado a buscar maneras de resolverle problemas a mis clientes y tener mayor organización al trabajar.',
  '/images/paulo-screenshot.png',
  '/images/videos/paulo-intro.mp4',
  '/images/videos/paulo-tip-1.mp4'
) on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- services
-- -----------------------------------------------------------------------------
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  icon_name text not null,
  title text not null,
  description text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into services (icon_name, title, description, sort_order) values
  ('Home', 'Compra y Venta', 'Residenciales, industriales y comerciales. Te asesoro para encontrar o vender la propiedad ideal al mejor precio.', 0),
  ('Building2', 'Arrendamiento', 'Cualquier tipo de inmueble para personas físicas o morales, con contratos seguros y condiciones favorables.', 1),
  ('Users', 'Colaboraciones', 'Alianzas con valuadores, notarios, abogados y brokers de créditos hipotecarios para cubrir cada necesidad.', 2),
  ('TrendingUp', 'Inversión Inmobiliaria', 'Maximiza el rendimiento de tu capital invirtiendo en las propiedades correctas con análisis fundamentado.', 3),
  ('FileSearch', 'Opiniones de Valor', 'Mediante distintos enfoques aporto una opinión profesional de valor sobre tu propiedad.', 4),
  ('MessageCircle', 'Comunicación Directa', 'Tiempos de respuesta rápidos. Estoy a un mensaje de distancia y te acompaño en todo el proceso.', 5)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- properties
-- -----------------------------------------------------------------------------
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  property_type text not null,
  operation text not null,
  price numeric not null,
  currency text not null default 'MXN',
  location text not null,
  neighborhood text,
  city text default 'San Pedro Garza García',
  state text default 'N.L.',
  bedrooms int,
  bathrooms numeric,
  parking_spots int,
  construction_m2 numeric,
  total_m2 numeric,
  floor text,
  year_built int,
  description text,
  features text[] not null default '{}',
  amenities text[] not null default '{}',
  status text not null default 'Disponible',
  video_url text,
  latitude numeric,
  longitude numeric,
  featured boolean not null default false,
  visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into properties (
  slug, title, property_type, operation, price, location, neighborhood, city, state,
  bedrooms, bathrooms, parking_spots, construction_m2, total_m2, floor, year_built,
  description, features, amenities, status, video_url, latitude, longitude,
  featured, visible, sort_order
) values
  (
    'departamento-torre-dana',
    'Departamento en Torre Dana',
    'Departamento', 'Venta', 8500000,
    'Torre Dana, Del Valle',
    'Del Valle', 'San Pedro Garza García', 'Nuevo León',
    2, 2, 1, 120, null, 'Piso 15', 2019,
    'Departamento de lujo ubicado en Torre Dana, uno de los desarrollos más exclusivos de Del Valle en San Pedro Garza García. El departamento cuenta con acabados de primera calidad, amplios ventanales de piso a techo con vistas panorámicas a la Sierra Madre y al skyline de San Pedro, pisos de madera natural, cocina integral equipada con electrodomésticos de línea premium y clósets vestidores. Espacios abiertos que integran la sala, comedor y terraza privada, perfectos para disfrutar los atardeceres regios con la familia o recibir invitados.',
    array['Acabados de lujo','Ventanales de piso a techo','Pisos de madera natural','Cocina integral equipada','Clósets vestidores','Terraza privada','Aire acondicionado central','Cuarto de servicio'],
    array['Gimnasio','Alberca','Seguridad 24/7','Roof Garden','Business Center','Salón de Eventos','Áreas Verdes','Valet Parking'],
    'Disponible',
    'https://www.youtube.com/embed/VIDEO_ID',
    25.6563, -100.3737,
    true, true, 0
  ),
  (
    'departamento-saqqara',
    'Departamento en Saqqara',
    'Departamento', 'Renta', 35000,
    'Saqqara, Zona San Ángel',
    'Colinas de San Jerónimo', 'San Pedro Garza García', 'Nuevo León',
    3, 2.5, 2, 180, null, 'Piso 8', 2020,
    'Espectacular departamento en renta ubicado en Saqqara, en la exclusiva zona de San Ángel en San Pedro Garza García. Cuenta con tres amplias recámaras, dos baños y medio, doble estacionamiento techado y una distribución inteligente que maximiza la iluminación natural. La sala familiar se conecta con una terraza con vista abierta. Incluye cocina equipada, clósets de madera fina y acabados modernos en mármol. Ideal para familias o ejecutivos que buscan la tranquilidad de San Ángel a pocos minutos del corredor financiero.',
    array['Terraza con vista','Sala familiar','Cocina equipada','Mármol en baños','Clósets de madera fina','Doble estacionamiento techado','Bodega incluida','Pet friendly'],
    array['Gimnasio','Alberca','Seguridad 24/7','Pet Friendly','Área de Juegos','Salón de Usos Múltiples','Áreas Verdes'],
    'Disponible',
    'https://www.youtube.com/embed/VIDEO_ID',
    25.6308, -100.3968,
    true, true, 1
  ),
  (
    'terreno-industrial-salinas-victoria',
    'Terreno Industrial en Salinas Victoria',
    'Terreno', 'Venta', 12000000,
    'Parque Industrial, Salinas Victoria',
    'Parque Industrial Salinas', 'Salinas Victoria', 'Nuevo León',
    0, 0, 0, null, 5000, null, null,
    'Excelente oportunidad de inversión: terreno industrial de 5,000 m² en Salinas Victoria, dentro del corredor logístico que conecta Monterrey con los principales accesos carreteros al norte del país. El predio cuenta con frente a calle pavimentada, servicios básicos disponibles (agua, luz y drenaje), uso de suelo industrial vigente y acceso directo para trailers. Ideal para naves industriales, bodegas, centros de distribución o proyectos de manufactura ligera en una de las zonas con mayor crecimiento del estado.',
    array['5,000 m² de terreno','Uso de suelo industrial','Frente a calle pavimentada','Servicios disponibles','Acceso para trailers','Zona de alto crecimiento','Cercano a autopista','Escrituras al corriente'],
    array[]::text[],
    'Disponible',
    null,
    25.9612, -100.2945,
    true, true, 2
  ),
  (
    'departamento-valle-oriente',
    'Departamento en Valle Oriente',
    'Departamento', 'Venta', 6200000,
    'Valle Oriente, San Pedro',
    'Valle Oriente', 'San Pedro Garza García', 'Nuevo León',
    2, 2, 2, 140, null, 'Piso 11', 2018,
    'Moderno departamento en el corazón de Valle Oriente, a un costado del corredor financiero más importante de Monterrey. Dos recámaras amplias con clósets, dos baños completos, cocina integral con barra desayunadora, sala-comedor con vista a la ciudad y balcón privado. Edificio con seguridad las 24 horas y amenidades completas. A distancia caminable de restaurantes, oficinas corporativas y centros comerciales como Galerías Valle Oriente.',
    array['Cocina integral con barra','Balcón privado','Vista a la ciudad','Doble estacionamiento','Clósets amplios','Piso laminado','Aire acondicionado'],
    array['Gimnasio','Alberca','Seguridad 24/7','Roof Garden','Business Center','Áreas Verdes'],
    'Disponible',
    'https://www.youtube.com/embed/VIDEO_ID',
    25.6411, -100.3614,
    true, true, 3
  ),
  (
    'casa-carretera-nacional',
    'Casa en Carretera Nacional',
    'Casa', 'Venta', 15800000,
    'Carretera Nacional, Monterrey',
    'Carretera Nacional', 'Monterrey', 'Nuevo León',
    4, 3.5, 3, 380, 500, null, 2021,
    'Casa residencial de lujo sobre Carretera Nacional con acabados de primer nivel. Cuatro recámaras incluyendo una master suite con vestidor y baño privado, tres baños y medio completos, sala de TV, estudio, cocina integral de diseño con isla central, comedor formal, sala principal con doble altura y jardín privado con área de asador. Tres cajones de estacionamiento techados. Residencial cerrado con caseta de vigilancia y acceso controlado, ideal para familias que buscan comodidad, seguridad y acceso rápido al sur de Monterrey.',
    array['Master suite con vestidor','Doble altura en sala','Cocina con isla central','Estudio independiente','Sala de TV','Jardín privado con asador','Tres cajones techados','Cuarto de lavado','Cuarto de servicio con baño'],
    array['Seguridad 24/7','Caseta de Vigilancia','Áreas Verdes','Pet Friendly'],
    'Disponible',
    'https://www.youtube.com/embed/VIDEO_ID',
    25.5879, -100.2459,
    true, true, 4
  )
on conflict (slug) do nothing;

-- -----------------------------------------------------------------------------
-- property_images
-- -----------------------------------------------------------------------------
create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists property_images_property_id_idx on property_images(property_id);

-- -----------------------------------------------------------------------------
-- testimonials
-- -----------------------------------------------------------------------------
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  text text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into testimonials (client_name, text, sort_order) values
  ('Juan Pablo Leal', 'Paulo me ha ayudado tanto en temas comerciales y residenciales, con el local de mi negocio hace unos años y me acaba de rentar un depa. ¡Muy versátil!', 0),
  ('Juan Carlos Garza', 'Paulo me ayudó a encontrar la casa en la que llevo varios años viviendo y desde entonces siempre ha estado al pendiente de cualquier duda o necesidad.', 1),
  ('Claudia Villegas', 'Aparte de ayudarme con la renta de mi departamento Paulo me recomendó un buen servicio de mudanza, como foránea fue una gran ayuda.', 2)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- clients
-- -----------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

insert into clients (name, sort_order) values
  ('Grupo Gallegos', 0),
  ('V-KOOL', 1),
  ('Import Market Auto', 2),
  ('TAES', 3)
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- contact_submissions
-- -----------------------------------------------------------------------------
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text,
  property_id uuid references properties(id) on delete set null,
  source text not null default 'website',
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on contact_submissions(created_at desc);

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table site_config enable row level security;
alter table services enable row level security;
alter table properties enable row level security;
alter table property_images enable row level security;
alter table testimonials enable row level security;
alter table clients enable row level security;
alter table contact_submissions enable row level security;

-- Public read policies
drop policy if exists "site_config_public_read" on site_config;
create policy "site_config_public_read" on site_config
  for select using (true);

drop policy if exists "services_public_read" on services;
create policy "services_public_read" on services
  for select using (true);

drop policy if exists "properties_public_read" on properties;
create policy "properties_public_read" on properties
  for select using (visible = true);

drop policy if exists "property_images_public_read" on property_images;
create policy "property_images_public_read" on property_images
  for select using (true);

drop policy if exists "testimonials_public_read" on testimonials;
create policy "testimonials_public_read" on testimonials
  for select using (true);

drop policy if exists "clients_public_read" on clients;
create policy "clients_public_read" on clients
  for select using (true);

-- Public insert (contact form submissions) — no public SELECT/UPDATE/DELETE.
drop policy if exists "contact_submissions_public_insert" on contact_submissions;
create policy "contact_submissions_public_insert" on contact_submissions
  for insert with check (true);

-- =============================================================================
-- Storage: public "media" bucket
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');
