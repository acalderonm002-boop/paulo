"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { PriceLabel, Property, PropertyType } from "@/data/properties";
import PropertyCard from "../PropertyCard";

type OpFilter = "Todos" | PriceLabel;
type TypeFilter = "Todos" | PropertyType;

const OP_FILTERS: OpFilter[] = ["Todos", "Venta", "Renta"];

const TYPE_FILTERS: TypeFilter[] = [
  "Todos",
  "Departamento",
  "Casa",
  "Terreno",
  "Local Comercial",
  "Oficina",
  "Bodega",
];

type Props = { properties: Property[] };

export default function TabPropiedades({ properties }: Props) {
  const [op, setOp] = useState<OpFilter>("Todos");
  const [type, setType] = useState<TypeFilter>("Todos");

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (op !== "Todos" && p.priceLabel !== op) return false;
        if (type !== "Todos" && p.propertyType !== type) return false;
        return true;
      }),
    [properties, op, type]
  );

  const chipClass = (active: boolean) =>
    `whitespace-nowrap text-[11px] uppercase rounded-full border transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
        : "bg-white text-[color:var(--text-primary)] border-black/[0.08] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    }`;

  return (
    <section
      id="propiedades"
      className="bg-[color:var(--cream)] py-10 lg:py-14"
    >
      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p
              className="text-[11px] uppercase text-[color:var(--accent)] mb-2"
              style={{ letterSpacing: "3px" }}
            >
              Portafolio
            </p>
            <h2
              className="text-[color:var(--text-primary)] leading-[1.1]"
              style={{
                fontFamily: "var(--font-dm-serif), Georgia, serif",
                fontSize: "clamp(26px, 2.8vw, 38px)",
              }}
            >
              Propiedades disponibles
            </h2>
          </div>
          <Link
            href="/propiedades"
            className="group inline-flex items-center gap-2 text-[12px] uppercase text-[color:var(--text-primary)] hover:text-[color:var(--accent)] transition-colors"
            style={{ letterSpacing: "2px", fontWeight: 600 }}
          >
            Explorar portafolio completo
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span
            className="text-[10px] uppercase text-[color:var(--text-secondary)] mr-1"
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
                padding: "6px 14px",
                letterSpacing: "1.2px",
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
          <span
            className="text-[10px] uppercase text-[color:var(--text-secondary)] ml-3 mr-1"
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
                padding: "6px 14px",
                letterSpacing: "1.2px",
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div
            className="py-16 text-center text-[color:var(--text-secondary)]"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            No hay propiedades disponibles con estos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
