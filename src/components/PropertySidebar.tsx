"use client";

import { Check, Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { formatPrice, type Property } from "@/data/properties";

function WhatsAppSvg({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.331 0-4.512-.67-6.363-1.822l-.357-.214-3.7 1.24 1.24-3.7-.214-.357A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  );
}

export default function PropertySidebar({ property }: { property: Property }) {
  const waText = encodeURIComponent(
    `Hola Paulo, me interesa la propiedad ${property.title}`
  );
  const waUrl = `https://wa.me/${property.agent.whatsapp}?text=${waText}`;
  const mailUrl = `mailto:${property.agent.email}?subject=${encodeURIComponent(
    `Interés en ${property.title}`
  )}`;
  const telUrl = `tel:+${property.agent.whatsapp}`;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: `Hola, me interesa ${property.title}`,
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Placeholder — to be wired to backend later.
    console.log("property inquiry", { propertyId: property.id, ...form });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const inputClass =
    "w-full bg-[color:var(--cream)] border border-black/[0.08] rounded-lg px-4 py-3 text-[14px] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors";

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-7 sm:p-8">
        {/* Agent header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative w-14 h-14 rounded-full overflow-hidden shrink-0"
            style={{
              background:
                "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-[15px]"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
              }}
            >
              PL
            </div>
          </div>
          <div>
            <div
              className="text-[15px] text-[color:var(--text-primary)] leading-tight"
              style={{ fontWeight: 700 }}
            >
              {property.agent.name}
            </div>
            <div className="text-[12px] text-[color:var(--text-secondary)]">
              Asesor Inmobiliario
            </div>
            <div
              className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase px-2 py-0.5 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
              style={{ letterSpacing: "1.2px", fontWeight: 700 }}
            >
              <Check size={9} strokeWidth={3} />
              Certificado AMPI
            </div>
          </div>
        </div>

        <hr className="border-black/[0.06] mb-6" />

        {/* Price */}
        <div className="mb-6">
          <div
            className="text-[color:var(--midnight)] leading-none"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(28px, 2.4vw, 34px)",
            }}
          >
            {formatPrice(property)}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="space-y-3 mb-6">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 text-white py-[14px] rounded-lg text-[11px] uppercase hover:opacity-90 transition-opacity"
            style={{
              letterSpacing: "1.5px",
              fontWeight: 700,
              backgroundColor: "#25D366",
            }}
          >
            <WhatsAppSvg size={18} />
            Contactar por WhatsApp
          </a>
          <a
            href={telUrl}
            className="w-full inline-flex items-center justify-center gap-2 border border-[color:var(--midnight)] text-[color:var(--text-primary)] py-[14px] rounded-lg text-[11px] uppercase hover:bg-[color:var(--midnight)] hover:text-white transition-colors"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            <Phone size={16} />
            Llamar
          </a>
          <a
            href={mailUrl}
            className="w-full inline-flex items-center justify-center gap-2 border border-[color:var(--midnight)] text-[color:var(--text-primary)] py-[14px] rounded-lg text-[11px] uppercase hover:bg-[color:var(--midnight)] hover:text-white transition-colors"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            <Mail size={16} />
            Enviar Email
          </a>
        </div>

        <hr className="border-black/[0.06] mb-6" />

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <h4
            className="text-[color:var(--text-primary)] mb-1"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            ¿Te interesa esta propiedad?
          </h4>
          <input
            type="text"
            required
            placeholder="Nombre"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
            className={inputClass}
          />
          <textarea
            required
            rows={3}
            placeholder="Mensaje"
            value={form.message}
            onChange={(e) =>
              setForm((f) => ({ ...f, message: e.target.value }))
            }
            className={`${inputClass} resize-none`}
          />
          <button
            type="submit"
            className="w-full bg-[color:var(--accent)] text-white py-[14px] rounded-lg text-[11px] uppercase hover:bg-[color:var(--accent-light)] transition-colors"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            {submitted ? "¡Mensaje enviado!" : "Enviar mensaje"}
          </button>
        </form>

        <p className="text-center text-[11px] text-[color:var(--text-secondary)] mt-4">
          Respuesta en menos de 24 horas
        </p>
      </div>
    </aside>
  );
}
