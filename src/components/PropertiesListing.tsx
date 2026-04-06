"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import type {
  PriceLabel,
  Property,
  PropertyType,
} from "@/data/properties";
import PropertyCard from "./PropertyCard";

type TypeFilter = "Todos" | PropertyType;
type OpFilter = "Todos" | PriceLabel;

const TYPE_FILTERS: TypeFilter[] = [
  "Todos",
  "Departamento",
  "Casa",
  "Terreno",
  "Local Comercial",
  "Oficina",
];

const OP_FILTERS: OpFilter[] = ["Todos", "Venta", "Renta"];

type Props = { properties: Property[] };

export default function PropertiesListing({ properties }: Props) {
  const [type, setType] = useState<TypeFilter>("Todos");
  const [op, setOp] = useState<OpFilter>("Todos");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (type !== "Todos" && p.propertyType !== type) return false;
      if (op !== "Todos" && p.priceLabel !== op) return false;
      return true;
    });
  }, [type, op, properties]);

  const chipClass = (active: boolean) =>
    `whitespace-nowrap text-[12px] uppercase rounded-full border transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
        : "bg-white text-[color:var(--text-primary)] border-black/[0.08] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    }`;

  return (
    <section className="pt-4 pb-12 lg:pt-6 lg:pb-16">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        {/* Back button */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] transition-colors"
          >
            <ArrowLeft size={14} />
            Regresar
          </Link>
        </div>

        {/* Header */}
        <p
          className="text-[12px] uppercase text-[color:var(--accent)] mb-2"
          style={{ letterSpacing: "3px" }}
        >
          PORTAFOLIO
        </p>
        <h1
          className="text-[color:var(--text-primary)] leading-[1.1] mb-4"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(30px, 3.2vw, 44px)",
          }}
        >
          Propiedades Disponibles
        </h1>

        {/* Filters — single row */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span
            className="text-[11px] uppercase text-[color:var(--text-secondary)] mr-1"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            Tipo
          </span>
          {TYPE_FILTERS.map((f) => (
            <button
              key={`type-${f}`}
              type="button"
              onClick={() => setType(f)}
              className={chipClass(type === f)}
              style={{
                padding: "6px 16px",
                letterSpacing: "1.2px",
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
          <span
            className="text-[11px] uppercase text-[color:var(--text-secondary)] ml-3 mr-1"
            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
          >
            Operación
          </span>
          {OP_FILTERS.map((f) => (
            <button
              key={`op-${f}`}
              type="button"
              onClick={() => setOp(f)}
              className={chipClass(op === f)}
              style={{
                padding: "6px 16px",
                letterSpacing: "1.2px",
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[color:var(--text-secondary)]">
            No hay propiedades disponibles con estos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
