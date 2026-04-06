import { supabase } from "./supabase";

export type SiteConfig = {
  id: number;
  hero_tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_stat_1_number: string;
  hero_stat_1_label: string;
  hero_stat_2_number: string;
  hero_stat_2_label: string;
  hero_stat_3_number: string;
  hero_stat_3_label: string;
  about_tagline: string;
  about_title: string;
  about_text_1: string;
  about_text_2: string;
  about_image_url: string | null;
  about_certification_text: string;
  about_badge_number: string;
  about_badge_label: string;
  video_section_tagline: string;
  video_section_title: string;
  video_section_subtitle: string;
  video_section_url: string | null;
  content_section_tagline: string;
  content_section_title: string;
  content_section_url: string | null;
  cta_title: string;
  cta_subtitle: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  linkedin_url: string;
  whatsapp_number: string;
  email: string;
  phone: string;
  address: string;
  updated_at?: string;
};

export type ServiceRow = {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  sort_order: number;
};

export type TestimonialRow = {
  id: string;
  client_name: string;
  text: string;
  sort_order: number;
};

export type ClientRow = {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
};

export type SiteContent = {
  config: SiteConfig;
  services: ServiceRow[];
  testimonials: TestimonialRow[];
  clients: ClientRow[];
};

export const DEFAULT_CONFIG: SiteConfig = {
  id: 1,
  hero_tagline: "ASESOR INMOBILIARIO CERTIFICADO · MONTERREY, N.L.",
  hero_title:
    "¿Buscas comprar, rentar, vender o invertir en bienes raíces?",
  hero_subtitle:
    "Te acompaño en cada paso del proceso inmobiliario — compra, venta, renta o inversión — con estrategia, transparencia y un trato personalizado.",
  hero_image_url: "/images/paulo-portrait.jpg",
  hero_stat_1_number: "3+",
  hero_stat_1_label: "Años de Experiencia",
  hero_stat_2_number: "50+",
  hero_stat_2_label: "Propiedades",
  hero_stat_3_number: "AMPI",
  hero_stat_3_label: "Certificado",
  about_tagline: "SOBRE MÍ",
  about_title: "Estrategia comercial con trato humano",
  about_text_1:
    "Con más de 3 años en el sector y el respaldo de la inmobiliaria Walls & People, combino estrategia comercial con un trato humano y transparente. Me especializo en conectar personas con propiedades que no solo cumplen expectativas, sino que sean el proyecto ideal para ellos.",
  about_text_2:
    "Soy egresado de la UDEM de la Ingeniería en Gestión Empresarial e Ingeniería Industrial y de Sistemas. Mis estudios me han ayudado a buscar maneras de resolverle problemas a mis clientes y tener mayor organización al trabajar.",
  about_image_url: "/images/paulo-screenshot.png",
  about_certification_text:
    "Certificado por AMPI y con amplia red de contactos legales, notariales y financieros.",
  about_badge_number: "3+",
  about_badge_label: "años de experiencia",
  video_section_tagline: "CONÓCEME",
  video_section_title:
    "Me dedico a encontrar la mejor propiedad para tu empresa o para tu familia.",
  video_section_subtitle: "Estoy a tus órdenes para dar el siguiente paso.",
  video_section_url: "/images/videos/paulo-intro.mp4",
  content_section_tagline: "CONTENIDO",
  content_section_title: "Los mejores consejos del mundo inmobiliario",
  content_section_url: "/images/videos/paulo-tip-1.mp4",
  cta_title: "¿Listo para dar el siguiente paso?",
  cta_subtitle:
    "Agenda una cita sin compromiso y platiquemos sobre tu próximo proyecto inmobiliario.",
  instagram_url: "https://www.instagram.com/paulolealsav/",
  facebook_url:
    "https://www.facebook.com/people/Paulo-Leal-Bienes-Ra%C3%ADces/61572709677439/",
  tiktok_url: "https://www.tiktok.com/@paulolealsav",
  linkedin_url: "https://www.linkedin.com/in/paulo-leal-savi%C3%B1on",
  whatsapp_number: "528128625350",
  email: "paulo.leal@w-p.mx",
  phone: "81 2862 5350",
  address: "San Pedro Garza García, Nuevo León",
};

export const DEFAULT_SERVICES: ServiceRow[] = [
  {
    id: "default-1",
    icon_name: "Home",
    title: "Compra y Venta",
    description:
      "Residenciales, industriales y comerciales. Te asesoro para encontrar o vender la propiedad ideal al mejor precio.",
    sort_order: 0,
  },
  {
    id: "default-2",
    icon_name: "Building2",
    title: "Arrendamiento",
    description:
      "Cualquier tipo de inmueble para personas físicas o morales, con contratos seguros y condiciones favorables.",
    sort_order: 1,
  },
  {
    id: "default-3",
    icon_name: "Users",
    title: "Colaboraciones",
    description:
      "Alianzas con valuadores, notarios, abogados y brokers de créditos hipotecarios para cubrir cada necesidad.",
    sort_order: 2,
  },
  {
    id: "default-4",
    icon_name: "TrendingUp",
    title: "Inversión Inmobiliaria",
    description:
      "Maximiza el rendimiento de tu capital invirtiendo en las propiedades correctas con análisis fundamentado.",
    sort_order: 3,
  },
  {
    id: "default-5",
    icon_name: "FileSearch",
    title: "Opiniones de Valor",
    description:
      "Mediante distintos enfoques aporto una opinión profesional de valor sobre tu propiedad.",
    sort_order: 4,
  },
  {
    id: "default-6",
    icon_name: "MessageCircle",
    title: "Comunicación Directa",
    description:
      "Tiempos de respuesta rápidos. Estoy a un mensaje de distancia y te acompaño en todo el proceso.",
    sort_order: 5,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialRow[] = [
  {
    id: "default-t-1",
    client_name: "Juan Pablo Leal",
    text: "Paulo me ha ayudado tanto en temas comerciales y residenciales, con el local de mi negocio hace unos años y me acaba de rentar un depa. ¡Muy versátil!",
    sort_order: 0,
  },
  {
    id: "default-t-2",
    client_name: "Juan Carlos Garza",
    text: "Paulo me ayudó a encontrar la casa en la que llevo varios años viviendo y desde entonces siempre ha estado al pendiente de cualquier duda o necesidad.",
    sort_order: 1,
  },
  {
    id: "default-t-3",
    client_name: "Claudia Villegas",
    text: "Aparte de ayudarme con la renta de mi departamento Paulo me recomendó un buen servicio de mudanza, como foránea fue una gran ayuda.",
    sort_order: 2,
  },
];

export const DEFAULT_CLIENTS: ClientRow[] = [
  { id: "default-c-1", name: "Grupo Gallegos", logo_url: null, sort_order: 0 },
  { id: "default-c-2", name: "V-KOOL", logo_url: null, sort_order: 1 },
  {
    id: "default-c-3",
    name: "Import Market Auto",
    logo_url: null,
    sort_order: 2,
  },
  { id: "default-c-4", name: "TAES", logo_url: null, sort_order: 3 },
];

export const DEFAULT_CONTENT: SiteContent = {
  config: DEFAULT_CONFIG,
  services: DEFAULT_SERVICES,
  testimonials: DEFAULT_TESTIMONIALS,
  clients: DEFAULT_CLIENTS,
};

/**
 * Fetches all CMS content from Supabase in parallel. If the Supabase request
 * fails (credentials missing, network error, tables not created yet) we fall
 * back to the hardcoded defaults so the site always renders.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const [configRes, servicesRes, testimonialsRes, clientsRes] =
      await Promise.all([
        supabase.from("site_config").select("*").eq("id", 1).maybeSingle(),
        supabase
          .from("services")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("testimonials")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("clients")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

    return {
      config: (configRes.data as SiteConfig | null) ?? DEFAULT_CONFIG,
      services:
        (servicesRes.data as ServiceRow[] | null)?.length
          ? (servicesRes.data as ServiceRow[])
          : DEFAULT_SERVICES,
      testimonials:
        (testimonialsRes.data as TestimonialRow[] | null)?.length
          ? (testimonialsRes.data as TestimonialRow[])
          : DEFAULT_TESTIMONIALS,
      clients:
        (clientsRes.data as ClientRow[] | null)?.length
          ? (clientsRes.data as ClientRow[])
          : DEFAULT_CLIENTS,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}
