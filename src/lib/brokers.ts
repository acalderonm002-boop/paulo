import { supabase } from "./supabase";
import type {
  PriceLabel,
  Property,
  PropertyAgent,
  PropertyType,
} from "@/data/properties";

// ---------------------------------------------------------------------------
// Types that mirror the brokers / listings tables (see
// supabase/migrations/20260417201044_brokers_and_listings.sql).
// ---------------------------------------------------------------------------

export type BrokerCertification = {
  // Older rows expose a single `nombre` field; newer rows use the richer
  // linkedin-style shape below. The UI falls back to whichever is present.
  nombre?: string;
  descripcion?: string;
  anio?: number;
  nombre_completo?: string;
  siglas?: string;
  año?: number;
  otorgante?: string;
};

export type BrokerStats = {
  propiedades_vendidas: number;
  transacciones: number;
  clientes: number;
};

export type BrokerIdioma = { idioma: string; nivel?: string };
export type BrokerEducacion = {
  institucion: string;
  grado?: string;
  area?: string;
  año_inicio?: number | null;
  año_fin?: number | null;
};
export type BrokerCurso = {
  nombre: string;
  institucion?: string;
  año?: number;
};
export type BrokerTrayectoria = {
  brokerage: string;
  rol?: string;
  desde?: number | null;
  hasta?: number | null;
  descripcion?: string;
};
export type BrokerPublicacion = {
  titulo: string;
  medio?: string;
  fecha?: string;
  url?: string;
};
export type BrokerAward = {
  titulo: string;
  otorgante?: string;
  año?: number;
};
export type BrokerAsociacion = {
  nombre: string;
  rol?: string;
  desde?: number | null;
  hasta?: number | null;
};
export type BrokerVoluntariado = {
  organizacion: string;
  rol?: string;
  desde?: number | null;
  hasta?: number | null;
  descripcion?: string;
};
export type BrokerFeatured = {
  tipo?: string;
  titulo: string;
  descripcion?: string;
  url?: string;
  thumbnail_url?: string;
};

export type Broker = {
  id: string;
  slug: string;
  nombre: string;
  headline: string | null;
  bio_corta: string | null;
  bio_larga: string | null;
  foto_url: string | null;
  banner_url: string | null;
  telefono: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  ciudad: string | null;
  anios_experiencia: number | null;
  certificaciones: BrokerCertification[];
  zonas_especializacion: string[];
  stats: BrokerStats;
  filosofia: string | null;
  tipos_propiedad: string[];
  servicios: string[];
  idiomas: BrokerIdioma[];
  educacion: BrokerEducacion[];
  cursos: BrokerCurso[];
  trayectoria: BrokerTrayectoria[];
  publicaciones: BrokerPublicacion[];
  awards: BrokerAward[];
  asociaciones: BrokerAsociacion[];
  voluntariado: BrokerVoluntariado[];
  featured: BrokerFeatured[];
  created_at?: string;
  updated_at?: string;
};

export type ListingOperacion = "venta" | "renta";
export type ListingEstado = "activo" | "vendido" | "pausado";

export type Listing = {
  id: string;
  broker_id: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  tipo_operacion: ListingOperacion;
  precio: number;
  moneda: string;
  tipo_propiedad: string | null;
  recamaras: number | null;
  banios: number | null;
  m2_construccion: number | null;
  m2_terreno: number | null;
  estacionamientos: number | null;
  colonia: string | null;
  ciudad: string | null;
  estado: string | null;
  lat: number | null;
  lng: number | null;
  fotos: string[];
  amenidades: string[];
  estado_publicacion: ListingEstado;
  created_at?: string;
  updated_at?: string;
};

// ---------------------------------------------------------------------------
// Defaults — Paulo's current hardcoded site, used whenever the DB is empty
// or unreachable so the site always renders.
// ---------------------------------------------------------------------------

export const DEFAULT_BROKER: Broker = {
  id: "default-paulo-leal",
  slug: "paulo-leal",
  nombre: "Paulo Leal Saviñón",
  headline:
    "¿Buscas comprar, rentar, vender o invertir en bienes raíces?",
  bio_corta:
    "Te acompaño en cada paso del proceso inmobiliario — compra, venta, renta o inversión — con estrategia, transparencia y un trato personalizado.",
  bio_larga:
    "Con más de 3 años en el sector y el respaldo de la inmobiliaria Walls & People, combino estrategia comercial con un trato humano y transparente. Me especializo en conectar personas con propiedades que no solo cumplen expectativas, sino que sean el proyecto ideal para ellos.\n\nSoy egresado de la UDEM de la Ingeniería en Gestión Empresarial e Ingeniería Industrial y de Sistemas. Mis estudios me han ayudado a buscar maneras de resolverle problemas a mis clientes y tener mayor organización al trabajar.",
  foto_url: "/images/paulo-portrait.jpg",
  banner_url:
    "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=2400&q=80",
  telefono: "81 2862 5350",
  whatsapp: "528128625350",
  email: "paulo.leal@w-p.mx",
  instagram: "https://www.instagram.com/paulolealsav/",
  facebook:
    "https://www.facebook.com/people/Paulo-Leal-Bienes-Ra%C3%ADces/61572709677439/",
  linkedin: "https://www.linkedin.com/in/paulo-leal-savi%C3%B1on",
  ciudad: "Monterrey, N.L.",
  anios_experiencia: 3,
  certificaciones: [
    {
      nombre_completo:
        "Asociación Mexicana de Profesionales Inmobiliarios",
      siglas: "AMPI",
      año: 2021,
      otorgante: "AMPI Nuevo León",
    },
  ],
  zonas_especializacion: [
    "San Pedro Garza García",
    "Valle Oriente",
    "Cumbres",
    "Del Valle",
    "Contry",
    "Monterrey Centro",
  ],
  stats: {
    propiedades_vendidas: 50,
    transacciones: 60,
    clientes: 45,
  },
  filosofia:
    "Te acompaño en cada paso del proceso inmobiliario con estrategia, transparencia y un trato personalizado.",
  tipos_propiedad: ["Residencial", "Lujo", "Inversión"],
  servicios: ["Compra", "Venta", "Renta", "Asesoría", "Valuación"],
  idiomas: [
    { idioma: "Español", nivel: "Nativo" },
    { idioma: "Inglés", nivel: "Profesional" },
  ],
  educacion: [
    {
      institucion: "ITESM",
      grado: "Licenciatura",
      area: "Administración",
      año_inicio: 2010,
      año_fin: 2014,
    },
  ],
  cursos: [
    {
      nombre: "Certificación en Bienes Raíces",
      institucion: "AMPI",
      año: 2021,
    },
  ],
  trayectoria: [
    {
      brokerage: "Walls & People",
      rol: "Asesor Inmobiliario",
      desde: 2022,
      hasta: null,
      descripcion:
        "Especialización en propiedades residenciales de lujo en San Pedro y Valle Oriente.",
    },
  ],
  publicaciones: [],
  awards: [],
  asociaciones: [
    {
      nombre: "AMPI Nuevo León",
      rol: "Miembro activo",
      desde: 2021,
      hasta: null,
    },
  ],
  voluntariado: [],
  featured: [],
};

export const DEFAULT_LISTINGS: Listing[] = [
  {
    id: "default-listing-1",
    broker_id: DEFAULT_BROKER.id,
    slug: "departamento-torre-dana",
    titulo: "Departamento en Torre Dana",
    descripcion:
      "Departamento de lujo en Torre Dana, uno de los desarrollos más exclusivos de Del Valle en San Pedro Garza García. Acabados de primera, ventanales de piso a techo con vistas panorámicas a la Sierra Madre, pisos de madera natural y cocina integral equipada.",
    tipo_operacion: "venta",
    precio: 8500000,
    moneda: "MXN",
    tipo_propiedad: "Departamento",
    recamaras: 2,
    banios: 2,
    m2_construccion: 120,
    m2_terreno: null,
    estacionamientos: 1,
    colonia: "Del Valle",
    ciudad: "San Pedro Garza García",
    estado: "Nuevo León",
    lat: 25.6563,
    lng: -100.3737,
    fotos: [],
    amenidades: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Roof Garden",
      "Business Center",
      "Áreas Verdes",
      "Valet Parking",
    ],
    estado_publicacion: "activo",
  },
  {
    id: "default-listing-2",
    broker_id: DEFAULT_BROKER.id,
    slug: "departamento-saqqara",
    titulo: "Departamento en Saqqara",
    descripcion:
      "Espectacular departamento en renta en la exclusiva zona de San Ángel en San Pedro Garza García. Tres recámaras amplias, doble estacionamiento techado y una terraza con vista abierta. Ideal para familias o ejecutivos.",
    tipo_operacion: "renta",
    precio: 35000,
    moneda: "MXN",
    tipo_propiedad: "Departamento",
    recamaras: 3,
    banios: 2.5,
    m2_construccion: 180,
    m2_terreno: null,
    estacionamientos: 2,
    colonia: "Colinas de San Jerónimo",
    ciudad: "San Pedro Garza García",
    estado: "Nuevo León",
    lat: 25.6308,
    lng: -100.3968,
    fotos: [],
    amenidades: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Pet Friendly",
      "Áreas Verdes",
    ],
    estado_publicacion: "activo",
  },
  {
    id: "default-listing-3",
    broker_id: DEFAULT_BROKER.id,
    slug: "departamento-valle-oriente",
    titulo: "Departamento en Valle Oriente",
    descripcion:
      "Moderno departamento en el corazón de Valle Oriente, a un costado del corredor financiero más importante de Monterrey. Dos recámaras amplias, cocina integral con barra desayunadora y balcón privado con vista a la ciudad.",
    tipo_operacion: "venta",
    precio: 6200000,
    moneda: "MXN",
    tipo_propiedad: "Departamento",
    recamaras: 2,
    banios: 2,
    m2_construccion: 140,
    m2_terreno: null,
    estacionamientos: 2,
    colonia: "Valle Oriente",
    ciudad: "San Pedro Garza García",
    estado: "Nuevo León",
    lat: 25.6411,
    lng: -100.3614,
    fotos: [],
    amenidades: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Roof Garden",
      "Áreas Verdes",
    ],
    estado_publicacion: "activo",
  },
  {
    id: "default-listing-4",
    broker_id: DEFAULT_BROKER.id,
    slug: "casa-cumbres",
    titulo: "Casa en Cumbres",
    descripcion:
      "Residencia familiar en Cumbres con jardín privado, cochera doble y espacios amplios. Ideal para familias que buscan tranquilidad y seguridad en una zona consolidada al poniente de Monterrey.",
    tipo_operacion: "venta",
    precio: 5800000,
    moneda: "MXN",
    tipo_propiedad: "Casa",
    recamaras: 3,
    banios: 2.5,
    m2_construccion: 260,
    m2_terreno: 300,
    estacionamientos: 2,
    colonia: "Cumbres Elite",
    ciudad: "Monterrey",
    estado: "Nuevo León",
    lat: 25.7419,
    lng: -100.4003,
    fotos: [],
    amenidades: ["Seguridad 24/7", "Áreas Verdes", "Pet Friendly"],
    estado_publicacion: "activo",
  },
  {
    id: "default-listing-5",
    broker_id: DEFAULT_BROKER.id,
    slug: "departamento-contry-renta",
    titulo: "Departamento amueblado en Contry",
    descripcion:
      "Departamento completamente amueblado en Contry, ideal para ejecutivos. Listo para habitarse con cocina equipada, lavandería y acceso a amenidades del edificio.",
    tipo_operacion: "renta",
    precio: 22000,
    moneda: "MXN",
    tipo_propiedad: "Departamento",
    recamaras: 2,
    banios: 2,
    m2_construccion: 95,
    m2_terreno: null,
    estacionamientos: 1,
    colonia: "Contry",
    ciudad: "Monterrey",
    estado: "Nuevo León",
    lat: 25.6443,
    lng: -100.2671,
    fotos: [],
    amenidades: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Áreas Verdes",
      "Salón de Usos Múltiples",
    ],
    estado_publicacion: "activo",
  },
  {
    id: "default-listing-6",
    broker_id: DEFAULT_BROKER.id,
    slug: "loft-zona-centro",
    titulo: "Loft en Zona Centro",
    descripcion:
      "Loft contemporáneo en el corazón del centro de Monterrey, caminable a bares, restaurantes y oficinas corporativas. Distribución abierta, doble altura y acabados industriales.",
    tipo_operacion: "renta",
    precio: 18500,
    moneda: "MXN",
    tipo_propiedad: "Departamento",
    recamaras: 1,
    banios: 1,
    m2_construccion: 70,
    m2_terreno: null,
    estacionamientos: 1,
    colonia: "Centro",
    ciudad: "Monterrey",
    estado: "Nuevo León",
    lat: 25.6714,
    lng: -100.3095,
    fotos: [],
    amenidades: ["Seguridad 24/7", "Roof Garden"],
    estado_publicacion: "activo",
  },
];

// ---------------------------------------------------------------------------
// Supabase helpers
// ---------------------------------------------------------------------------

type DbBrokerRow = {
  id: string;
  slug: string;
  nombre: string;
  headline: string | null;
  bio_corta: string | null;
  bio_larga: string | null;
  foto_url: string | null;
  banner_url: string | null;
  telefono: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  ciudad: string | null;
  anios_experiencia: number | null;
  certificaciones: unknown;
  zonas_especializacion: string[] | null;
  stats: unknown;
  filosofia: string | null;
  tipos_propiedad: string[] | null;
  servicios: string[] | null;
  idiomas: unknown;
  educacion: unknown;
  cursos: unknown;
  trayectoria: unknown;
  publicaciones: unknown;
  awards: unknown;
  asociaciones: unknown;
  voluntariado: unknown;
  featured: unknown;
  created_at?: string;
  updated_at?: string;
};

type DbListingRow = {
  id: string;
  broker_id: string;
  slug: string;
  titulo: string;
  descripcion: string | null;
  tipo_operacion: ListingOperacion;
  precio: number | string;
  moneda: string;
  tipo_propiedad: string | null;
  recamaras: number | null;
  banios: number | string | null;
  m2_construccion: number | string | null;
  m2_terreno: number | string | null;
  estacionamientos: number | null;
  colonia: string | null;
  ciudad: string | null;
  estado: string | null;
  lat: number | string | null;
  lng: number | string | null;
  fotos: string[] | null;
  amenidades: string[] | null;
  estado_publicacion: ListingEstado;
  created_at?: string;
  updated_at?: string;
};

function parseStats(raw: unknown): BrokerStats {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    return {
      propiedades_vendidas: Number(r.propiedades_vendidas ?? 0),
      transacciones: Number(r.transacciones ?? 0),
      clientes: Number(r.clientes ?? 0),
    };
  }
  return { propiedades_vendidas: 0, transacciones: 0, clientes: 0 };
}

function parseCertifications(raw: unknown): BrokerCertification[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map((c) => {
      const nombreCompleto =
        typeof c.nombre_completo === "string" ? c.nombre_completo : undefined;
      const nombre = typeof c.nombre === "string" ? c.nombre : undefined;
      return {
        nombre_completo: nombreCompleto,
        siglas: typeof c.siglas === "string" ? c.siglas : undefined,
        año:
          typeof c["año"] === "number"
            ? (c["año"] as number)
            : typeof c.anio === "number"
            ? (c.anio as number)
            : undefined,
        otorgante:
          typeof c.otorgante === "string" ? c.otorgante : undefined,
        nombre: nombre ?? nombreCompleto,
        descripcion:
          typeof c.descripcion === "string" ? c.descripcion : undefined,
        anio: typeof c.anio === "number" ? c.anio : undefined,
      };
    })
    .filter((c) => (c.nombre ?? c.nombre_completo ?? "").length > 0);
}

function parseArrayOf<T>(
  raw: unknown,
  map: (obj: Record<string, unknown>) => T | null
): T[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
    .map(map)
    .filter((x): x is T => x !== null);
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}
function numOrNull(v: unknown): number | null {
  if (v === null) return null;
  return typeof v === "number" ? v : null;
}

function parseIdiomas(raw: unknown): BrokerIdioma[] {
  return parseArrayOf(raw, (o) => {
    const idioma = str(o.idioma);
    if (!idioma) return null;
    return { idioma, nivel: str(o.nivel) };
  });
}

function parseEducacion(raw: unknown): BrokerEducacion[] {
  return parseArrayOf(raw, (o) => {
    const institucion = str(o.institucion);
    if (!institucion) return null;
    return {
      institucion,
      grado: str(o.grado),
      area: str(o.area),
      año_inicio: numOrNull(o["año_inicio"]),
      año_fin: numOrNull(o["año_fin"]),
    };
  });
}

function parseCursos(raw: unknown): BrokerCurso[] {
  return parseArrayOf(raw, (o) => {
    const nombre = str(o.nombre);
    if (!nombre) return null;
    return {
      nombre,
      institucion: str(o.institucion),
      año: num(o["año"]),
    };
  });
}

function parseTrayectoria(raw: unknown): BrokerTrayectoria[] {
  return parseArrayOf(raw, (o) => {
    const brokerage = str(o.brokerage);
    if (!brokerage) return null;
    return {
      brokerage,
      rol: str(o.rol),
      desde: numOrNull(o.desde),
      hasta: numOrNull(o.hasta),
      descripcion: str(o.descripcion),
    };
  });
}

function parsePublicaciones(raw: unknown): BrokerPublicacion[] {
  return parseArrayOf(raw, (o) => {
    const titulo = str(o.titulo);
    if (!titulo) return null;
    return {
      titulo,
      medio: str(o.medio),
      fecha: str(o.fecha),
      url: str(o.url),
    };
  });
}

function parseAwards(raw: unknown): BrokerAward[] {
  return parseArrayOf(raw, (o) => {
    const titulo = str(o.titulo);
    if (!titulo) return null;
    return {
      titulo,
      otorgante: str(o.otorgante),
      año: num(o["año"]),
    };
  });
}

function parseAsociaciones(raw: unknown): BrokerAsociacion[] {
  return parseArrayOf(raw, (o) => {
    const nombre = str(o.nombre);
    if (!nombre) return null;
    return {
      nombre,
      rol: str(o.rol),
      desde: numOrNull(o.desde),
      hasta: numOrNull(o.hasta),
    };
  });
}

function parseVoluntariado(raw: unknown): BrokerVoluntariado[] {
  return parseArrayOf(raw, (o) => {
    const organizacion = str(o.organizacion);
    if (!organizacion) return null;
    return {
      organizacion,
      rol: str(o.rol),
      desde: numOrNull(o.desde),
      hasta: numOrNull(o.hasta),
      descripcion: str(o.descripcion),
    };
  });
}

function parseFeatured(raw: unknown): BrokerFeatured[] {
  return parseArrayOf(raw, (o) => {
    const titulo = str(o.titulo);
    if (!titulo) return null;
    return {
      titulo,
      tipo: str(o.tipo),
      descripcion: str(o.descripcion),
      url: str(o.url),
      thumbnail_url: str(o.thumbnail_url),
    };
  });
}

function toNum(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

function mapBrokerRow(row: DbBrokerRow): Broker {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    headline: row.headline,
    bio_corta: row.bio_corta,
    bio_larga: row.bio_larga,
    foto_url: row.foto_url,
    banner_url: row.banner_url,
    telefono: row.telefono,
    whatsapp: row.whatsapp,
    email: row.email,
    instagram: row.instagram,
    facebook: row.facebook,
    linkedin: row.linkedin,
    ciudad: row.ciudad,
    anios_experiencia: row.anios_experiencia,
    certificaciones: parseCertifications(row.certificaciones),
    zonas_especializacion: row.zonas_especializacion ?? [],
    stats: parseStats(row.stats),
    filosofia: row.filosofia,
    tipos_propiedad: row.tipos_propiedad ?? [],
    servicios: row.servicios ?? [],
    idiomas: parseIdiomas(row.idiomas),
    educacion: parseEducacion(row.educacion),
    cursos: parseCursos(row.cursos),
    trayectoria: parseTrayectoria(row.trayectoria),
    publicaciones: parsePublicaciones(row.publicaciones),
    awards: parseAwards(row.awards),
    asociaciones: parseAsociaciones(row.asociaciones),
    voluntariado: parseVoluntariado(row.voluntariado),
    featured: parseFeatured(row.featured),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapListingRow(row: DbListingRow): Listing {
  return {
    id: row.id,
    broker_id: row.broker_id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion,
    tipo_operacion: row.tipo_operacion,
    precio: Number(row.precio),
    moneda: row.moneda,
    tipo_propiedad: row.tipo_propiedad,
    recamaras: row.recamaras,
    banios: toNum(row.banios),
    m2_construccion: toNum(row.m2_construccion),
    m2_terreno: toNum(row.m2_terreno),
    estacionamientos: row.estacionamientos,
    colonia: row.colonia,
    ciudad: row.ciudad,
    estado: row.estado,
    lat: toNum(row.lat),
    lng: toNum(row.lng),
    fotos: row.fotos ?? [],
    amenidades: row.amenidades ?? [],
    estado_publicacion: row.estado_publicacion,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Fetchers — always resolve to a usable shape (fall back to defaults).
// ---------------------------------------------------------------------------

export type BrokerBundle = {
  broker: Broker;
  /** All listings for this broker regardless of publication state. */
  allListings: Listing[];
  /** Only `activo` listings — what the public site shows. */
  activeListings: Listing[];
};

function bundleFromDefaults(): BrokerBundle {
  const active = DEFAULT_LISTINGS.filter(
    (l) => l.estado_publicacion === "activo"
  );
  return {
    broker: DEFAULT_BROKER,
    allListings: DEFAULT_LISTINGS,
    activeListings: active,
  };
}

/**
 * Fetch a broker by slug (or the first broker in the table when slug omitted)
 * together with their listings. Falls back to the hardcoded default broker
 * when Supabase is empty, credentials are missing, or the request fails.
 */
export async function fetchBrokerBundle(
  slug?: string
): Promise<BrokerBundle> {
  try {
    const base = supabase.from("brokers").select("*");
    const brokerRes = slug
      ? await base.eq("slug", slug).maybeSingle()
      : await base.order("created_at", { ascending: true }).limit(1).maybeSingle();

    const brokerRow = brokerRes.data as DbBrokerRow | null;
    if (!brokerRow) return bundleFromDefaults();

    const broker = mapBrokerRow(brokerRow);

    const listingsRes = await supabase
      .from("listings")
      .select("*")
      .eq("broker_id", broker.id)
      .order("created_at", { ascending: false });

    const rows = (listingsRes.data as DbListingRow[] | null) ?? [];
    const allListings = rows.map(mapListingRow);
    const activeListings = allListings.filter(
      (l) => l.estado_publicacion === "activo"
    );

    return { broker, allListings, activeListings };
  } catch {
    return bundleFromDefaults();
  }
}

export async function fetchListingBySlug(
  brokerSlug: string,
  listingSlug: string
): Promise<{ broker: Broker; listing: Listing } | null> {
  // Resolve broker first so we can enforce the (broker, slug) uniqueness.
  const bundle = await fetchBrokerBundle(brokerSlug);
  const listing = bundle.allListings.find(
    (l) => l.slug === listingSlug && l.estado_publicacion === "activo"
  );
  if (!listing) return null;
  return { broker: bundle.broker, listing };
}

export async function fetchDefaultBrokerListingBySlug(
  listingSlug: string
): Promise<{ broker: Broker; listing: Listing } | null> {
  const bundle = await fetchBrokerBundle();
  const listing = bundle.allListings.find(
    (l) => l.slug === listingSlug && l.estado_publicacion === "activo"
  );
  if (!listing) return null;
  return { broker: bundle.broker, listing };
}

export async function fetchAllListingSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("slug, estado_publicacion")
      .eq("estado_publicacion", "activo");
    if (error || !data || data.length === 0) {
      return DEFAULT_LISTINGS.filter(
        (l) => l.estado_publicacion === "activo"
      ).map((l) => l.slug);
    }
    return (data as { slug: string }[]).map((r) => r.slug);
  } catch {
    return DEFAULT_LISTINGS.filter(
      (l) => l.estado_publicacion === "activo"
    ).map((l) => l.slug);
  }
}

// ---------------------------------------------------------------------------
// UI adapter — convert a Listing + Broker into the existing `Property` shape
// that the gallery / card / explorer / detail components already consume.
// ---------------------------------------------------------------------------

const PROPERTY_TYPE_VALUES: PropertyType[] = [
  "Departamento",
  "Casa",
  "Terreno",
  "Local Comercial",
  "Oficina",
  "Bodega",
];

function coercePropertyType(v: string | null): PropertyType {
  if (v && (PROPERTY_TYPE_VALUES as string[]).includes(v)) {
    return v as PropertyType;
  }
  return "Departamento";
}

function operacionToPriceLabel(v: ListingOperacion): PriceLabel {
  return v === "renta" ? "Renta" : "Venta";
}

function brokerToAgent(broker: Broker): PropertyAgent {
  return {
    name: broker.nombre,
    phone: broker.telefono ?? "",
    email: broker.email ?? "",
    whatsapp: broker.whatsapp ?? "",
  };
}

export function listingToProperty(
  listing: Listing,
  broker: Broker
): Property {
  const location = [listing.colonia, listing.ciudad]
    .filter(Boolean)
    .join(", ");
  const placeholderFallback = Array.from(
    { length: 5 },
    (_, i) => `/images/properties/${listing.slug}/${i + 1}.jpg`
  );

  return {
    id: listing.slug,
    title: listing.titulo,
    location: location || listing.titulo,
    neighborhood: listing.colonia ?? "",
    city: listing.ciudad ?? "",
    state: listing.estado ?? "",
    price: Number(listing.precio),
    priceLabel: operacionToPriceLabel(listing.tipo_operacion),
    currency: "MXN",
    bedrooms: listing.recamaras ?? 0,
    bathrooms: listing.banios ?? 0,
    parkingSpots: listing.estacionamientos ?? 0,
    constructionM2: listing.m2_construccion ?? undefined,
    totalM2: listing.m2_terreno ?? undefined,
    description: listing.descripcion ?? "",
    features: [],
    images: listing.fotos.length > 0 ? listing.fotos : placeholderFallback,
    propertyType: coercePropertyType(listing.tipo_propiedad),
    status: "Disponible",
    amenities: listing.amenidades,
    agent: brokerToAgent(broker),
    coordinates: {
      lat: listing.lat ?? 0,
      lng: listing.lng ?? 0,
    },
    createdAt: listing.created_at ?? new Date().toISOString(),
  };
}

export function listingsToProperties(
  listings: Listing[],
  broker: Broker
): Property[] {
  return listings.map((l) => listingToProperty(l, broker));
}

export function getRelatedListings(
  listings: Listing[],
  currentSlug: string,
  limit = 3
): Listing[] {
  const current = listings.find((l) => l.slug === currentSlug);
  if (!current) return listings.filter((l) => l.slug !== currentSlug).slice(0, limit);
  return listings
    .filter((l) => l.slug !== currentSlug)
    .map((l) => ({
      listing: l,
      score:
        (l.tipo_propiedad === current.tipo_propiedad ? 2 : 0) +
        (l.ciudad === current.ciudad ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.listing);
}
