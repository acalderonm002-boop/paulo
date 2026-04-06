"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  PriceLabel,
  Property,
  PropertyType,
} from "@/data/properties";
import { mapDbToProperty } from "@/lib/properties-db";
import PropertyCard from "./PropertyCard";
import PropertyWizard from "./admin/PropertyWizard";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/context/ToastContext";

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

type AdminPropertyRow = Parameters<typeof mapDbToProperty>[0] & {
  id: string;
  slug: string;
  visible: boolean;
  title: string;
};

type Props = { properties: Property[] };

export default function PropertiesListing({ properties: initial }: Props) {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { showToast } = useToast();

  const [type, setType] = useState<TypeFilter>("Todos");
  const [op, setOp] = useState<OpFilter>("Todos");

  const [adminRows, setAdminRows] = useState<AdminPropertyRow[] | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const fetchAdmin = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/admin/properties", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar");
      const data = await res.json();
      setAdminRows((data.properties ?? []) as AdminPropertyRow[]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al cargar");
    }
  }, [isAdmin, showToast]);

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  const toggleVisibility = async (row: AdminPropertyRow) => {
    try {
      const res = await fetch(`/api/admin/properties/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !row.visible }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      setAdminRows((arr) =>
        (arr ?? []).map((x) =>
          x.id === row.id ? { ...x, visible: !x.visible } : x
        )
      );
      showToast(
        row.visible ? "Propiedad ocultada" : "Propiedad visible"
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  // Public rendering uses the server-provided list; admin rendering uses the
  // admin API's response (which includes hidden properties and DB uuids).
  const baseList = useMemo<Property[]>(() => {
    if (isAdmin && adminRows) {
      return adminRows.map((r) => mapDbToProperty(r));
    }
    return initial;
  }, [isAdmin, adminRows, initial]);

  const filtered = useMemo(() => {
    return baseList.filter((p) => {
      if (type !== "Todos" && p.propertyType !== type) return false;
      if (op !== "Todos" && p.priceLabel !== op) return false;
      return true;
    });
  }, [baseList, type, op]);

  const adminBySlug = useMemo(() => {
    const map = new Map<string, AdminPropertyRow>();
    (adminRows ?? []).forEach((r) => map.set(r.slug, r));
    return map;
  }, [adminRows]);

  const chipClass = (active: boolean) =>
    `whitespace-nowrap text-[12px] uppercase rounded-full border transition-colors ${
      active
        ? "bg-[color:var(--accent)] text-white border-[color:var(--accent)]"
        : "bg-white text-[color:var(--text-primary)] border-black/[0.08] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
    }`;

  return (
    <>
      <section className="pt-4 pb-12 lg:pt-6 lg:pb-16">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-12">
          {/* Back button */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] transition-colors"
            >
              <ArrowLeft size={14} />
              Regresar
            </Link>
            {isAdmin && !adminLoading && (
              <button
                type="button"
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center gap-2 bg-[color:var(--accent)] text-white px-4 py-2 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors"
                style={{ letterSpacing: "1.5px", fontWeight: 700 }}
              >
                <Plus size={14} />
                Nueva Propiedad
              </button>
            )}
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
              {filtered.map((p, i) => {
                const row = adminBySlug.get(p.id);
                const hidden = isAdmin && row && row.visible === false;
                return (
                  <div
                    key={p.id}
                    className={`relative transition-opacity ${
                      hidden ? "opacity-50" : ""
                    }`}
                  >
                    {isAdmin && row && (
                      <>
                        {hidden && (
                          <span
                            className="absolute top-3 left-3 z-[45] bg-black/70 text-white text-[10px] uppercase rounded-md px-2 py-1 backdrop-blur-sm"
                            style={{ letterSpacing: "1.5px", fontWeight: 700 }}
                          >
                            Oculta
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleVisibility(row);
                          }}
                          aria-label={row.visible ? "Ocultar" : "Mostrar"}
                          className="absolute top-3 right-3 z-[45] w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center text-[color:var(--text-primary)] hover:text-[color:var(--accent)]"
                        >
                          {row.visible ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                      </>
                    )}
                    <PropertyCard property={p} index={i} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PropertyWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          fetchAdmin();
        }}
      />
    </>
  );
}
