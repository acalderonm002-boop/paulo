import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/context/ToastContext";
import { fetchBrokerBundle } from "@/lib/brokers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
