import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { ToastProvider } from "@/context/ToastContext";
import { fetchBrokerBundle } from "@/lib/brokers";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://paulolealsav.com";

export async function generateMetadata(): Promise<Metadata> {
  const { broker } = await fetchBrokerBundle();
  const title = `${broker.nombre} | Asesor Inmobiliario${
    broker.ciudad ? ` en ${broker.ciudad}` : ""
  }`;
  const description =
    broker.bio_corta ??
    "Asesoría inmobiliaria profesional: compra, venta, renta e inversión.";
  const image = broker.foto_url ?? "/images/paulo-portrait.jpg";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_MX",
      siteName: broker.nombre,
      images: [
        {
          url: image,
          width: 810,
          height: 810,
          alt: broker.nombre,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { broker } = await fetchBrokerBundle();

  return (
    <html lang="es">
      <body className={`${dmSerif.variable} ${dmSans.variable} antialiased`}>
        <ToastProvider>
          <LoadingScreen />
          <Navbar brokerName={broker.nombre} />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
