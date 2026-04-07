"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./SocialIcons";

type Props = { whatsappNumber?: string };

export default function WhatsAppFloat({
  whatsappNumber = "528128625350",
}: Props = {}) {
  const pathname = usePathname() ?? "/";

  // Always hide on any admin route.
  if (pathname.startsWith("/admin")) return null;

  // Hide on mobile property detail routes to avoid overlap with the mobile bar
  const isPropertyDetail = /^\/propiedades\/[^/]+$/.test(pathname);
  const visibilityClass = isPropertyDetail ? "hidden lg:flex" : "flex";

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ opacity: 0, y: 60, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 1.4,
        type: "spring",
        stiffness: 260,
        damping: 14,
        mass: 0.9,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed items-center justify-center rounded-full ${visibilityClass}`}
      style={{
        bottom: "24px",
        right: "24px",
        width: "60px",
        height: "60px",
        backgroundColor: "#25D366",
        boxShadow: "0 4px 12px rgba(37, 211, 54, 0.3)",
        zIndex: 9999,
        transition: "transform 0.2s ease",
      }}
    >
      <WhatsAppIcon size={32} className="text-white" />
    </motion.a>
  );
}
