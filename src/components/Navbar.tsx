"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Sobre Mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Propiedades", href: "/propiedades" },
  { label: "Testimonios", href: "/#testimonios" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const pathname = usePathname() ?? "/";
  const isAdminLogin = pathname === "/admin";
  const isAdminPanel = /^\/admin\/(sitio|propiedades)/.test(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (isAdminLogin) return null;

  return (
    <>
      <header
        className={`fixed top-0 right-0 bg-white shadow-[0_1px_24px_rgba(26,42,74,0.06)] transition-all duration-500 ease-out ${
          isAdminPanel ? "left-0 lg:left-[240px]" : "left-0"
        } ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ zIndex: 9999 }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
          <Link
            href="/"
            className="text-xl md:text-2xl tracking-[0.18em] text-[color:var(--text-primary)]"
            style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
          >
            PAULO LEAL
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] uppercase text-[color:var(--text-primary)] hover:text-[color:var(--accent)] transition-colors duration-300"
                style={{ letterSpacing: "2px" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contacto"
              className="text-[12px] uppercase border border-[color:var(--accent)] text-[color:var(--accent)] px-5 py-3 hover:bg-[color:var(--accent)] hover:text-white transition-colors duration-300"
              style={{ letterSpacing: "2px" }}
            >
              Agendar Cita
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            style={{ zIndex: 10001 }}
          >
            <Menu
              size={24}
              className={`absolute transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0 rotate-90 text-white"
                  : "opacity-100 rotate-0 text-[color:var(--text-primary)]"
              }`}
            />
            <X
              size={26}
              className={`absolute transition-all duration-300 ${
                mobileOpen
                  ? "opacity-100 rotate-0 text-white"
                  : "opacity-0 -rotate-90 text-[color:var(--text-primary)]"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-[color:var(--midnight)] transition-all duration-500 ease-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 10000 }}
        aria-hidden={!mobileOpen}
      >
        <div className="h-full flex flex-col items-center justify-center gap-8 px-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-white text-3xl md:text-4xl tracking-[0.12em] hover:text-[color:var(--accent-light)] transition-all duration-500 ${
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                transitionDelay: mobileOpen ? `${i * 70 + 150}ms` : "0ms",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contacto"
            onClick={() => setMobileOpen(false)}
            className={`mt-6 text-[13px] uppercase border border-white text-white px-8 py-4 hover:bg-white hover:text-[color:var(--midnight)] transition-all duration-500 ${
              mobileOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{
              letterSpacing: "2px",
              transitionDelay: mobileOpen
                ? `${navLinks.length * 70 + 150}ms`
                : "0ms",
            }}
          >
            Agendar Cita
          </Link>
        </div>
      </div>
    </>
  );
}
