import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ToastProvider } from "@/context/ToastContext";

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
const SITE_TITLE = "Paulo Leal Saviñón | Asesor Inmobiliario en Monterrey";
const SITE_DESCRIPTION =
  "Compra, venta, renta e inversión en bienes raíces en Monterrey. Asesoría inmobiliaria certificada por AMPI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "es_MX",
    siteName: "Paulo Leal Saviñón",
    images: [
      {
        url: "/images/paulo-portrait.jpg",
        width: 810,
        height: 810,
        alt: "Paulo Leal Saviñón",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/paulo-portrait.jpg"],
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
        <ToastProvider>
          <LoadingScreen />
          <Navbar />
          {children}
          <WhatsAppFloat />
        </ToastProvider>
      </body>
    </html>
  );
}
