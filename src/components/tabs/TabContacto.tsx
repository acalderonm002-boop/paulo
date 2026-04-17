"use client";

import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Broker } from "@/lib/brokers";
import SocialIcons from "../SocialIcons";

type Props = { broker: Broker };

type FormState = "idle" | "submitting" | "success" | "error";

function whatsappHref(whatsapp: string | null, brokerName: string): string {
  if (!whatsapp) return "#";
  const cleaned = whatsapp.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hola ${brokerName}, me gustaría más información.`
  );
  return `https://wa.me/${cleaned}?text=${text}`;
}

export default function TabContacto({ broker }: Props) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      broker_id: broker.id,
      source: "website" as const,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "No se pudo enviar el mensaje");
      }
      form.reset();
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
      setState("error");
    }
  };

  const socialLinks = {
    instagram: broker.instagram,
    facebook: broker.facebook,
    linkedin: broker.linkedin,
  };

  return (
    <section id="contacto" className="bg-[color:var(--cream)] py-14 lg:py-20">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
        <p
          className="text-[11px] uppercase text-[color:var(--accent)] mb-3"
          style={{ letterSpacing: "3px" }}
        >
          Contacto
        </p>
        <h2
          className="text-[color:var(--text-primary)] leading-[1.1] mb-10"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(28px, 3vw, 42px)",
            maxWidth: "720px",
          }}
        >
          Platiquemos sobre tu próximo proyecto inmobiliario.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-start">
          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span
                  className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
                  style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                >
                  Nombre
                </span>
                <input
                  required
                  name="name"
                  type="text"
                  autoComplete="name"
                  className="w-full bg-white border border-black/[0.08] rounded-md px-4 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
                />
              </label>
              <label className="block">
                <span
                  className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
                  style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                >
                  Teléfono
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className="w-full bg-white border border-black/[0.08] rounded-md px-4 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
                />
              </label>
            </div>
            <label className="block">
              <span
                className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                className="w-full bg-white border border-black/[0.08] rounded-md px-4 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
              />
            </label>
            <label className="block">
              <span
                className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                Mensaje
              </span>
              <textarea
                name="message"
                rows={5}
                className="w-full bg-white border border-black/[0.08] rounded-md px-4 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors resize-y"
              />
            </label>

            <button
              type="submit"
              disabled={state === "submitting"}
              className="inline-flex items-center justify-center gap-2 bg-[color:var(--accent)] text-white px-7 py-[14px] text-[12px] uppercase transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ letterSpacing: "2px", fontWeight: 600 }}
            >
              {state === "submitting" ? "Enviando..." : "Enviar mensaje"}
              <Send size={15} />
            </button>

            {state === "success" && (
              <p className="text-[14px] text-emerald-700">
                ¡Mensaje enviado! Te contactaré pronto.
              </p>
            )}
            {state === "error" && (
              <p className="text-[14px] text-rose-700">
                {errorMsg ?? "No se pudo enviar el mensaje."}
              </p>
            )}
          </form>

          {/* Direct contact */}
          <div className="space-y-3">
            {broker.whatsapp && (
              <a
                href={whatsappHref(broker.whatsapp, broker.nombre)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-white border border-black/[0.06] rounded-xl p-5 hover:border-[color:var(--accent)]/40 transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[color:var(--accent)]/10 shrink-0">
                  <MessageCircle
                    size={19}
                    className="text-[color:var(--accent)]"
                    strokeWidth={2}
                  />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-0.5"
                    style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                  >
                    WhatsApp
                  </div>
                  <div
                    className="text-[15px] text-[color:var(--text-primary)] truncate"
                    style={{ fontWeight: 600 }}
                  >
                    {broker.whatsapp}
                  </div>
                </div>
              </a>
            )}
            {broker.telefono && (
              <a
                href={`tel:${broker.telefono.replace(/[^\d+]/g, "")}`}
                className="group flex items-center gap-4 bg-white border border-black/[0.06] rounded-xl p-5 hover:border-[color:var(--accent)]/40 transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[color:var(--accent)]/10 shrink-0">
                  <Phone
                    size={19}
                    className="text-[color:var(--accent)]"
                    strokeWidth={2}
                  />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-0.5"
                    style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                  >
                    Teléfono
                  </div>
                  <div
                    className="text-[15px] text-[color:var(--text-primary)] truncate"
                    style={{ fontWeight: 600 }}
                  >
                    {broker.telefono}
                  </div>
                </div>
              </a>
            )}
            {broker.email && (
              <a
                href={`mailto:${broker.email}`}
                className="group flex items-center gap-4 bg-white border border-black/[0.06] rounded-xl p-5 hover:border-[color:var(--accent)]/40 transition-colors"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-full bg-[color:var(--accent)]/10 shrink-0">
                  <Mail
                    size={19}
                    className="text-[color:var(--accent)]"
                    strokeWidth={2}
                  />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-0.5"
                    style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                  >
                    Email
                  </div>
                  <div
                    className="text-[15px] text-[color:var(--text-primary)] truncate"
                    style={{ fontWeight: 600 }}
                  >
                    {broker.email}
                  </div>
                </div>
              </a>
            )}

            {(broker.instagram || broker.facebook || broker.linkedin) && (
              <div className="pt-3">
                <p
                  className="text-[11px] uppercase text-[color:var(--text-secondary)] mb-3"
                  style={{ letterSpacing: "1.5px", fontWeight: 600 }}
                >
                  También me encuentras en
                </p>
                <SocialIcons
                  size={22}
                  gapClass="gap-5"
                  links={socialLinks}
                  linkClass="text-[color:var(--text-primary)] hover:text-[color:var(--accent)]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
