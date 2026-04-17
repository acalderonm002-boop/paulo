"use client";

import { Check, Loader2, Mail, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { WhatsAppIcon } from "./SocialIcons";
import { formatPrice, type Property } from "@/data/properties";
import { useToast } from "@/context/ToastContext";

type SidebarField = "name" | "phone" | "message";

type Props = {
  property: Property;
  brokerId?: string;
  listingId?: string;
  agentInitials?: string;
  agentCertification?: string | null;
};

export default function PropertySidebar({
  property,
  brokerId,
  listingId,
  agentInitials,
  agentCertification,
}: Props) {
  const { showToast } = useToast();

  const agentName = property.agent.name;
  const firstName = agentName.split(/\s+/)[0] || agentName;
  const initials =
    agentInitials ??
    agentName
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("");

  const waText = encodeURIComponent(
    `Hola ${firstName}, me interesa la propiedad ${property.title}`
  );
  const waUrl = `https://wa.me/${property.agent.whatsapp}?text=${waText}`;
  const mailUrl = `mailto:${property.agent.email}?subject=${encodeURIComponent(
    `Interés en ${property.title}`
  )}`;
  const telUrl = `tel:+${property.agent.whatsapp}`;

  const initialForm: Record<SidebarField, string> = {
    name: "",
    phone: "",
    message: `Hola, me interesa ${property.title}`,
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Partial<Record<SidebarField, string>>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const onChange = (field: SidebarField, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((err) => {
        const next = { ...err };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): Partial<Record<SidebarField, string>> => {
    const next: Partial<Record<SidebarField, string>> = {};
    if (!form.name.trim()) next.name = "Este campo es requerido";
    if (!form.phone.trim()) next.phone = "Este campo es requerido";
    if (!form.message.trim()) next.message = "Este campo es requerido";
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "property_page",
          broker_id: brokerId ?? null,
          listing_id: listingId ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al enviar");
      }
      showToast(`Mensaje enviado. ${firstName} te contactará pronto.`);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "No se pudo enviar el mensaje."
      );
    } finally {
      setLoading(false);
    }
  };

  const baseInput =
    "w-full bg-[color:var(--cream)] border rounded-lg px-4 py-3 text-[14px] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none transition-colors";

  const inputClass = (field: SidebarField) =>
    `${baseInput} ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-black/[0.08] focus:border-[color:var(--accent)]"
    }`;

  const errorText = (field: SidebarField) =>
    errors[field] ? (
      <p className="mt-1 text-[11px] text-red-500">{errors[field]}</p>
    ) : null;

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
              {initials || "·"}
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
            {agentCertification && (
              <div
                className="mt-1.5 inline-flex items-center gap-1 text-[9px] uppercase px-2 py-0.5 rounded-full bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                style={{ letterSpacing: "1.2px", fontWeight: 700 }}
              >
                <Check size={9} strokeWidth={3} />
                Certificado {agentCertification}
              </div>
            )}
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
            <WhatsAppIcon size={18} />
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
        <form onSubmit={onSubmit} noValidate className="space-y-3">
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
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => onChange("name", e.target.value)}
              className={inputClass("name")}
              aria-invalid={!!errors.name}
            />
            {errorText("name")}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={inputClass("phone")}
              aria-invalid={!!errors.phone}
            />
            {errorText("phone")}
          </div>
          <div>
            <textarea
              rows={3}
              placeholder="Mensaje"
              value={form.message}
              onChange={(e) => onChange("message", e.target.value)}
              className={`${inputClass("message")} resize-none`}
              aria-invalid={!!errors.message}
            />
            {errorText("message")}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[color:var(--accent)] text-white py-[14px] rounded-lg text-[11px] uppercase hover:bg-[color:var(--accent-light)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar mensaje"
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-[color:var(--text-secondary)] mt-4">
          Respuesta en menos de 24 horas
        </p>
      </div>
    </aside>
  );
}
