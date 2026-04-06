export type PropertyStatus =
  | "Disponible"
  | "Apartada"
  | "Vendida"
  | "Rentada";

export type PropertyType =
  | "Departamento"
  | "Casa"
  | "Terreno"
  | "Local Comercial"
  | "Oficina";

export type PriceLabel = "Venta" | "Renta";

export type PropertyAgent = {
  name: string;
  phone: string;
  email: string;
  whatsapp: string;
};

export type Property = {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  city: string;
  state: string;
  price: number;
  priceLabel: PriceLabel;
  currency: "MXN";
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  constructionM2?: number;
  totalM2?: number;
  description: string;
  features: string[];
  images: string[];
  videoUrl?: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  yearBuilt?: number;
  floor?: string;
  amenities: string[];
  agent: PropertyAgent;
  coordinates: { lat: number; lng: number };
  createdAt: string;
};

const AGENT: PropertyAgent = {
  name: "Paulo Leal Saviñón",
  phone: "81 2862 5350",
  email: "paulo.leal@w-p.mx",
  whatsapp: "528128625350",
};

const placeholderImages = (id: string, count: number): string[] =>
  Array.from(
    { length: count },
    (_, i) => `/images/properties/${id}/${i + 1}.jpg`
  );

export const properties: Property[] = [
  {
    id: "departamento-torre-dana",
    title: "Departamento en Torre Dana",
    location: "Torre Dana, Del Valle",
    neighborhood: "Del Valle",
    city: "San Pedro Garza García",
    state: "Nuevo León",
    price: 8500000,
    priceLabel: "Venta",
    currency: "MXN",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 1,
    constructionM2: 120,
    description:
      "Departamento de lujo ubicado en Torre Dana, uno de los desarrollos más exclusivos de Del Valle en San Pedro Garza García. El departamento cuenta con acabados de primera calidad, amplios ventanales de piso a techo con vistas panorámicas a la Sierra Madre y al skyline de San Pedro, pisos de madera natural, cocina integral equipada con electrodomésticos de línea premium y clósets vestidores. Espacios abiertos que integran la sala, comedor y terraza privada, perfectos para disfrutar los atardeceres regios con la familia o recibir invitados.",
    features: [
      "Acabados de lujo",
      "Ventanales de piso a techo",
      "Pisos de madera natural",
      "Cocina integral equipada",
      "Clósets vestidores",
      "Terraza privada",
      "Aire acondicionado central",
      "Cuarto de servicio",
    ],
    images: placeholderImages("departamento-torre-dana", 8),
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    propertyType: "Departamento",
    status: "Disponible",
    yearBuilt: 2019,
    floor: "Piso 15",
    amenities: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Roof Garden",
      "Business Center",
      "Salón de Eventos",
      "Áreas Verdes",
      "Valet Parking",
    ],
    agent: AGENT,
    coordinates: { lat: 25.6563, lng: -100.3737 },
    createdAt: "2026-02-14",
  },
  {
    id: "departamento-saqqara",
    title: "Departamento en Saqqara",
    location: "Saqqara, Zona San Ángel",
    neighborhood: "Colinas de San Jerónimo",
    city: "San Pedro Garza García",
    state: "Nuevo León",
    price: 35000,
    priceLabel: "Renta",
    currency: "MXN",
    bedrooms: 3,
    bathrooms: 2.5,
    parkingSpots: 2,
    constructionM2: 180,
    description:
      "Espectacular departamento en renta ubicado en Saqqara, en la exclusiva zona de San Ángel en San Pedro Garza García. Cuenta con tres amplias recámaras, dos baños y medio, doble estacionamiento techado y una distribución inteligente que maximiza la iluminación natural. La sala familiar se conecta con una terraza con vista abierta. Incluye cocina equipada, clósets de madera fina y acabados modernos en mármol. Ideal para familias o ejecutivos que buscan la tranquilidad de San Ángel a pocos minutos del corredor financiero.",
    features: [
      "Terraza con vista",
      "Sala familiar",
      "Cocina equipada",
      "Mármol en baños",
      "Clósets de madera fina",
      "Doble estacionamiento techado",
      "Bodega incluida",
      "Pet friendly",
    ],
    images: placeholderImages("departamento-saqqara", 6),
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    propertyType: "Departamento",
    status: "Disponible",
    yearBuilt: 2020,
    floor: "Piso 8",
    amenities: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Pet Friendly",
      "Área de Juegos",
      "Salón de Usos Múltiples",
      "Áreas Verdes",
    ],
    agent: AGENT,
    coordinates: { lat: 25.6308, lng: -100.3968 },
    createdAt: "2026-03-02",
  },
  {
    id: "terreno-industrial-salinas-victoria",
    title: "Terreno Industrial en Salinas Victoria",
    location: "Parque Industrial, Salinas Victoria",
    neighborhood: "Parque Industrial Salinas",
    city: "Salinas Victoria",
    state: "Nuevo León",
    price: 12000000,
    priceLabel: "Venta",
    currency: "MXN",
    bedrooms: 0,
    bathrooms: 0,
    parkingSpots: 0,
    totalM2: 5000,
    description:
      "Excelente oportunidad de inversión: terreno industrial de 5,000 m² en Salinas Victoria, dentro del corredor logístico que conecta Monterrey con los principales accesos carreteros al norte del país. El predio cuenta con frente a calle pavimentada, servicios básicos disponibles (agua, luz y drenaje), uso de suelo industrial vigente y acceso directo para trailers. Ideal para naves industriales, bodegas, centros de distribución o proyectos de manufactura ligera en una de las zonas con mayor crecimiento del estado.",
    features: [
      "5,000 m² de terreno",
      "Uso de suelo industrial",
      "Frente a calle pavimentada",
      "Servicios disponibles",
      "Acceso para trailers",
      "Zona de alto crecimiento",
      "Cercano a autopista",
      "Escrituras al corriente",
    ],
    images: placeholderImages("terreno-industrial-salinas-victoria", 5),
    propertyType: "Terreno",
    status: "Disponible",
    amenities: [],
    agent: AGENT,
    coordinates: { lat: 25.9612, lng: -100.2945 },
    createdAt: "2026-01-28",
  },
  {
    id: "departamento-valle-oriente",
    title: "Departamento en Valle Oriente",
    location: "Valle Oriente, San Pedro",
    neighborhood: "Valle Oriente",
    city: "San Pedro Garza García",
    state: "Nuevo León",
    price: 6200000,
    priceLabel: "Venta",
    currency: "MXN",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpots: 2,
    constructionM2: 140,
    description:
      "Moderno departamento en el corazón de Valle Oriente, a un costado del corredor financiero más importante de Monterrey. Dos recámaras amplias con clósets, dos baños completos, cocina integral con barra desayunadora, sala-comedor con vista a la ciudad y balcón privado. Edificio con seguridad las 24 horas y amenidades completas. A distancia caminable de restaurantes, oficinas corporativas y centros comerciales como Galerías Valle Oriente.",
    features: [
      "Cocina integral con barra",
      "Balcón privado",
      "Vista a la ciudad",
      "Doble estacionamiento",
      "Clósets amplios",
      "Piso laminado",
      "Aire acondicionado",
    ],
    images: placeholderImages("departamento-valle-oriente", 6),
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    propertyType: "Departamento",
    status: "Disponible",
    yearBuilt: 2018,
    floor: "Piso 11",
    amenities: [
      "Gimnasio",
      "Alberca",
      "Seguridad 24/7",
      "Roof Garden",
      "Business Center",
      "Áreas Verdes",
    ],
    agent: AGENT,
    coordinates: { lat: 25.6411, lng: -100.3614 },
    createdAt: "2026-02-20",
  },
  {
    id: "casa-carretera-nacional",
    title: "Casa en Carretera Nacional",
    location: "Carretera Nacional, Monterrey",
    neighborhood: "Carretera Nacional",
    city: "Monterrey",
    state: "Nuevo León",
    price: 15800000,
    priceLabel: "Venta",
    currency: "MXN",
    bedrooms: 4,
    bathrooms: 3.5,
    parkingSpots: 3,
    constructionM2: 380,
    totalM2: 500,
    description:
      "Casa residencial de lujo sobre Carretera Nacional con acabados de primer nivel. Cuatro recámaras incluyendo una master suite con vestidor y baño privado, tres baños y medio completos, sala de TV, estudio, cocina integral de diseño con isla central, comedor formal, sala principal con doble altura y jardín privado con área de asador. Tres cajones de estacionamiento techados. Residencial cerrado con caseta de vigilancia y acceso controlado, ideal para familias que buscan comodidad, seguridad y acceso rápido al sur de Monterrey.",
    features: [
      "Master suite con vestidor",
      "Doble altura en sala",
      "Cocina con isla central",
      "Estudio independiente",
      "Sala de TV",
      "Jardín privado con asador",
      "Tres cajones techados",
      "Cuarto de lavado",
      "Cuarto de servicio con baño",
    ],
    images: placeholderImages("casa-carretera-nacional", 8),
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    propertyType: "Casa",
    status: "Disponible",
    yearBuilt: 2021,
    amenities: [
      "Seguridad 24/7",
      "Caseta de Vigilancia",
      "Áreas Verdes",
      "Pet Friendly",
    ],
    agent: AGENT,
    coordinates: { lat: 25.5879, lng: -100.2459 },
    createdAt: "2026-03-18",
  },
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}

export function getRelatedProperties(id: string, limit = 3): Property[] {
  const current = getProperty(id);
  if (!current) return [];
  return properties
    .filter((p) => p.id !== id)
    .map((p) => ({
      property: p,
      score:
        (p.propertyType === current.propertyType ? 2 : 0) +
        (p.city === current.city ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.property);
}

export function formatPrice(property: Property): string {
  const formatted = new Intl.NumberFormat("es-MX").format(property.price);
  const base = `$${formatted} ${property.currency}`;
  return property.priceLabel === "Renta" ? `${base}/mes` : base;
}
