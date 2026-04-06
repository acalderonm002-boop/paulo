"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  // Hide on mobile property detail routes to avoid overlap with the mobile bar
  const isPropertyDetail = /^\/propiedades\/[^/]+$/.test(pathname);
  const visibilityClass = isPropertyDetail ? "hidden lg:flex" : "flex";

  return (
    <motion.a
      href="https://wa.me/528128625350"
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
      <svg
        viewBox="0 0 24 24"
        fill="white"
        width="32"
        height="32"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.331 0-4.512-.67-6.363-1.822l-.357-.214-3.7 1.24 1.24-3.7-.214-.357A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    </motion.a>
  );
}
