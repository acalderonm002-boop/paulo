"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useState, type CSSProperties, type FormEvent } from "react";
import type { Broker } from "@/lib/brokers";

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
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "No se pudo enviar el mensaje");
      }
      form.reset();
      setState("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar");
      setState("error");
    }
  };

  const serif: CSSProperties = {
    fontFamily: "var(--font-dm-serif), Georgia, serif",
  };

  const labelStyle: CSSProperties = {
    color: "#5C5C5C",
    letterSpacing: "1.8px",
    fontWeight: 600,
  };

  const inputBase =
    "w-full bg-transparent px-0 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none transition-colors";

  const inputStyle: CSSProperties = {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid #D9D2C3",
    borderRadius: 0,
  };

  const directAction = (
    label: string,
    icon: React.ReactNode,
    href: string,
    external?: boolean
  ) => (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="inline-flex items-center justify-center gap-2 transition-colors"
      style={{
        border: "1px solid #1A1A1A",
        borderRadius: 10,
        padding: "12px 18px",
        fontSize: 14,
        fontWeight: 500,
        color: "#1A1A1A",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#1A1A1A";
        e.currentTarget.style.color = "#F5F1EA";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#1A1A1A";
      }}
    >
      {icon}
      {label}
    </a>
  );

  const socialIconClass =
    "text-[#1A1A1A] hover:text-[color:var(--brand)] transition-colors";

  return (
    <section
      id="contacto"
      className="bg-[color:var(--cream)] text-[color:var(--text-primary)]"
    >
      <div className="max-w-[720px] mx-auto px-5 sm:px-8 py-14 md:py-16">
        {/* Editorial heading */}
        <p
          className="text-[11px] uppercase mb-3"
          style={{
            color: "#5C5C5C",
            letterSpacing: "2.5px",
            fontWeight: 600,
          }}
        >
          Contacto
        </p>
        <h1
          className="leading-[1.05] mb-4"
          style={{
            ...serif,
            fontSize: "clamp(32px, 5vw, 48px)",
            color: "#1A1A1A",
          }}
        >
          Platiquemos sobre tu próximo proyecto.
        </h1>
        <p
          className="text-[15px] md:text-base"
          style={{
            color: "#5C5C5C",
            lineHeight: 1.6,
            maxWidth: "58ch",
          }}
        >
          Compra, venta, renta o inversión — escríbeme y te respondo lo antes
          posible.
        </p>

        <hr
          className="my-10 border-0 h-px"
          style={{ backgroundColor: "#D9D2C3" }}
        />

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-7" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            <label className="block">
              <span
                className="block text-[11px] uppercase mb-2"
                style={labelStyle}
              >
                Nombre
              </span>
              <input
                required
                name="name"
                type="text"
                autoComplete="name"
                className={inputBase}
                style={inputStyle}
              />
            </label>
            <label className="block">
              <span
                className="block text-[11px] uppercase mb-2"
                style={labelStyle}
              >
                Teléfono
              </span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className={inputBase}
                style={inputStyle}
              />
            </label>
          </div>
          <label className="block">
            <span
              className="block text-[11px] uppercase mb-2"
              style={labelStyle}
            >
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className={inputBase}
              style={inputStyle}
            />
          </label>
          <label className="block">
            <span
              className="block text-[11px] uppercase mb-2"
              style={labelStyle}
            >
              Mensaje
            </span>
            <textarea
              name="message"
              rows={5}
              className="w-full bg-transparent px-0 py-3 text-[15px] text-[color:var(--text-primary)] focus:outline-none transition-colors resize-y"
              style={inputStyle}
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={state === "submitting"}
              className="inline-flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                border: "1px solid #1A1A1A",
                borderRadius: 10,
                padding: "12px 24px",
                fontSize: 15,
                fontWeight: 500,
                color: "#1A1A1A",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                if (state === "submitting") return;
                e.currentTarget.style.backgroundColor = "#1A1A1A";
                e.currentTarget.style.color = "#F5F1EA";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#1A1A1A";
              }}
            >
              {state === "submitting" ? "Enviando..." : "Enviar mensaje"}
            </button>

            {state === "success" && (
              <p
                className="mt-4 text-[14px]"
                style={{ color: "#1A1A1A" }}
              >
                Mensaje enviado. Te contactaré pronto.
              </p>
            )}
            {state === "error" && (
              <p
                className="mt-4 text-[14px]"
                style={{ color: "#8B2E2E" }}
              >
                {errorMsg ?? "No se pudo enviar el mensaje."}
              </p>
            )}
          </div>
        </form>

        <hr
          className="my-10 border-0 h-px"
          style={{ backgroundColor: "#D9D2C3" }}
        />

        {/* Direct action row */}
        <p
          className="text-[11px] uppercase mb-4"
          style={{
            color: "#5C5C5C",
            letterSpacing: "2px",
            fontWeight: 600,
          }}
        >
          O contáctame directamente
        </p>
        <div className="flex flex-wrap gap-3">
          {broker.whatsapp &&
            directAction(
              "WhatsApp",
              <MessageCircle size={16} strokeWidth={2} />,
              whatsappHref(broker.whatsapp, broker.nombre),
              true
            )}
          {broker.telefono &&
            directAction(
              "Llamada",
              <Phone size={16} strokeWidth={2} />,
              `tel:${broker.telefono.replace(/[^\d+]/g, "")}`
            )}
          {broker.email &&
            directAction(
              "Correo",
              <Mail size={16} strokeWidth={2} />,
              `mailto:${broker.email}`
            )}
        </div>

        {/* Social icons */}
        {(broker.instagram || broker.facebook || broker.linkedin) && (
          <div className="mt-10">
            <p
              className="text-[11px] uppercase mb-4"
              style={{
                color: "#5C5C5C",
                letterSpacing: "2px",
                fontWeight: 600,
              }}
            >
              También me encuentras en
            </p>
            <div className="flex items-center gap-5">
              {broker.instagram && (
                <a
                  href={broker.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#E4405F" }}
                >
                  <FaInstagram size={24} />
                </a>
              )}
              {broker.facebook && (
                <a
                  href={broker.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#1877F2" }}
                >
                  <FaFacebook size={24} />
                </a>
              )}
              {broker.linkedin && (
                <a
                  href={broker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className={socialIconClass}
                  style={{ ["--brand" as string]: "#0A66C2" }}
                >
                  <FaLinkedin size={24} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
