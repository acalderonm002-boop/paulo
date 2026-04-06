"use client";

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

  const pillClass = (active: boolean) =>
    `text-[11px] uppercase px-4 py-2 rounded-full border transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
        : "bg-white text-[color:var(--text-primary)] border-black/[0.08] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    }`;

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-10 lg:mb-12">
          <p
            className="text-[12px] uppercase text-[color:var(--accent)] mb-4"
            style={{ letterSpacing: "3px" }}
          >
            PORTAFOLIO
          </p>
          <h1
            className="text-[color:var(--text-primary)] leading-[1.1]"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
              fontSize: "clamp(32px, 3.5vw, 52px)",
            }}
          >
            Propiedades Disponibles
          </h1>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-12">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] uppercase text-[color:var(--text-secondary)] mr-2"
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              Tipo
            </span>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setType(f)}
                className={pillClass(type === f)}
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[10px] uppercase text-[color:var(--text-secondary)] mr-2"
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              Operación
            </span>
            {OP_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setOp(f)}
                className={pillClass(op === f)}
                style={{ letterSpacing: "1.5px", fontWeight: 600 }}
              >
                {f}
              </button>
            ))}
          </div>
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
