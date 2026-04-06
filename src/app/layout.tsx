import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";

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

const SITE_TITLE = "Paulo Leal Saviñón | Asesor Inmobiliario en Monterrey";
const SITE_DESCRIPTION =
  "Compra, venta, renta e inversión en bienes raíces en Monterrey. Asesoría inmobiliaria certificada por AMPI.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "es_MX",
    siteName: "Paulo Leal Saviñón",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSerif.variable} ${dmSans.variable} antialiased`}>
        <Navbar />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
