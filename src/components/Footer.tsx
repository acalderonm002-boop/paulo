"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import SocialIcons from "./SocialIcons";

type ContactField = "name" | "email" | "phone" | "message";

const initialForm: Record<ContactField, string> = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function Footer() {
  const [form, setForm] = useState(initialForm);

  const onChange = (field: ContactField, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder submission — to be wired to backend later.
    console.log("contact form submission", form);
    setForm(initialForm);
  };

  const inputClass =
    "w-full bg-transparent border-0 border-b border-white/20 focus:border-[color:var(--accent)] focus:outline-none text-white placeholder-white/40 py-3 text-[15px] transition-colors";

  return (
    <footer className="relative w-full bg-[color:var(--midnight)] text-white pt-16 lg:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-12">
          {/* COLUMN 1 — Brand */}
          <div>
            <div
              className="text-[color:var(--accent)] text-2xl tracking-[0.18em] mb-6"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
              }}
            >
              PAULO LEAL
            </div>
            <p
              className="text-white/70 mb-8 text-[14.5px]"
              style={{ lineHeight: 1.8, maxWidth: "320px" }}
            >
              Asesor inmobiliario certificado por AMPI. Monterrey y área
              metropolitana.
            </p>

            <SocialIcons
              size={18}
              gapClass="gap-5"
              linkClass="text-white/60 hover:text-[color:var(--accent)]"
            />
          </div>

          {/* COLUMN 2 — Contact info */}
          <div>
            <h3
              className="text-[12px] uppercase text-[color:var(--accent)] mb-6"
              style={{ letterSpacing: "2.5px" }}
            >
              Contacto
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="text-[color:var(--accent)] mt-[2px] shrink-0"
                />
                <span className="text-white/80 text-[14.5px]" style={{ lineHeight: 1.7 }}>
                  San Pedro Garza García, Nuevo León
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="text-[color:var(--accent)] mt-[2px] shrink-0"
                />
                <a
                  href="mailto:paulo.leal@w-p.mx"
                  className="text-white/80 text-[14.5px] hover:text-[color:var(--accent)] transition-colors"
                >
                  paulo.leal@w-p.mx
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="text-[color:var(--accent)] mt-[2px] shrink-0"
                />
                <a
                  href="tel:+528128625350"
                  className="text-white/80 text-[14.5px] hover:text-[color:var(--accent)] transition-colors"
                >
                  81 2862 5350
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — Contact form */}
          <div id="contacto">
            <h3
              className="text-[12px] uppercase text-[color:var(--accent)] mb-6"
              style={{ letterSpacing: "2.5px" }}
            >
              Escríbeme
            </h3>

            <form onSubmit={onSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Nombre"
                required
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                className={inputClass}
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                className={inputClass}
              />
              <textarea
                placeholder="Mensaje"
                required
                rows={3}
                value={form.message}
                onChange={(e) => onChange("message", e.target.value)}
                className={`${inputClass} resize-none`}
              />

              <button
                type="submit"
                className="w-full mt-4 bg-[color:var(--accent)] text-white px-6 py-4 text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors duration-300"
                style={{ letterSpacing: "2px" }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-[13px] text-center sm:text-left">
            © 2026 Paulo Leal Saviñón. Todos los derechos reservados.
          </p>
          <a
            href="#"
            className="text-white/50 text-[13px] hover:text-[color:var(--accent)] transition-colors"
          >
            Aviso de Privacidad
          </a>
        </div>
      </div>
    </footer>
  );
}
