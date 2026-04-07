"use client";

import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  formatPrice,
  type PriceLabel,
  type Property,
  type PropertyType,
} from "@/data/properties";

type OpFilter = "Todos" | PriceLabel;
type TypeFilter = "Todos" | PropertyType;
type PriceBucket = "any" | "lt1" | "1to5" | "5to10" | "gt10";
type BedFilter = "any" | "1" | "2" | "3" | "4";

type Option<T extends string> = { value: T; label: string };

const OP_OPTIONS: Option<OpFilter>[] = [
  { value: "Todos", label: "Todos" },
  { value: "Venta", label: "Venta" },
  { value: "Renta", label: "Renta" },
];

const TYPE_OPTIONS: Option<TypeFilter>[] = [
  { value: "Todos", label: "Todos" },
  { value: "Departamento", label: "Departamento" },
  { value: "Casa", label: "Casa" },
  { value: "Terreno", label: "Terreno" },
  { value: "Local Comercial", label: "Local Comercial" },
  { value: "Oficina", label: "Oficina" },
  { value: "Bodega", label: "Bodega" },
];

const PRICE_OPTIONS: Option<PriceBucket>[] = [
  { value: "any", label: "Cualquiera" },
  { value: "lt1", label: "Menos de $1M" },
  { value: "1to5", label: "$1M - $5M" },
  { value: "5to10", label: "$5M - $10M" },
  { value: "gt10", label: "$10M+" },
];

const BED_OPTIONS: Option<BedFilter>[] = [
  { value: "any", label: "Cualquiera" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

// ---------------------------------------------------------------------------
// Filter dropdown — custom button + popover so we control display + style.
// ---------------------------------------------------------------------------

type FilterDropdownProps<T extends string> = {
  label: string;
  defaultValue: T;
  value: T;
  onChange: Dispatch<SetStateAction<T>>;
  options: ReadonlyArray<Option<T>>;
};

function FilterDropdown<T extends string>({
  label,
  defaultValue,
  value,
  onChange,
  options,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isDefault = value === defaultValue;
  const display =
    isDefault
      ? label
      : options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 bg-white border rounded-lg text-[13px] cursor-pointer hover:border-[color:var(--accent)] focus:outline-none focus:border-[color:var(--accent)] transition-colors ${
          isDefault
            ? "border-[#e5e7eb] text-[color:var(--text-primary)]"
            : "border-[color:var(--accent)] text-[color:var(--accent)]"
        }`}
        style={{
          padding: "8px 16px",
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontWeight: 600,
        }}
      >
        {display}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute z-50 mt-1 left-0 min-w-full w-max bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden"
        >
          {options.map((opt) => {
            const selected = value === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-[13px] transition-colors ${
                  selected
                    ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                    : "text-[color:var(--text-primary)] hover:bg-[color:var(--cream)]"
                }`}
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Map placeholder — static pins, sticky on desktop only.
// ---------------------------------------------------------------------------

const MAP_PINS: Array<{ top: string; left: string }> = [
  { top: "20%", left: "30%" },
  { top: "32%", left: "62%" },
  { top: "48%", left: "24%" },
  { top: "44%", left: "76%" },
  { top: "62%", left: "48%" },
  { top: "70%", left: "20%" },
  { top: "26%", left: "82%" },
  { top: "55%", left: "55%" },
];

function MapPlaceholder() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: "#e8e8e8" }}
      aria-label="Mapa de Propiedades (próximamente)"
    >
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(#d4d4d4 1px, transparent 1px), linear-gradient(90deg, #d4d4d4 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Pins */}
      {MAP_PINS.map((p, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute block w-4 h-4 rounded-full ring-2 ring-white shadow-md"
          style={{
            top: p.top,
            left: p.left,
            transform: "translate(-50%, -50%)",
            backgroundColor: "var(--accent)",
          }}
        />
      ))}

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md text-center max-w-[260px]">
          <div
            className="text-[16px] text-[color:var(--text-primary)] mb-1"
            style={{
              fontFamily: "var(--font-dm-serif), Georgia, serif",
            }}
          >
            Mapa de Propiedades
          </div>
          <div
            className="text-[12px] text-[color:var(--text-secondary)]"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            Integración de mapa próximamente
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compact card — slightly smaller than PropertyCard for the explorer grid.
// ---------------------------------------------------------------------------

function ExplorerCard({ property }: { property: Property }) {
  const [imgError, setImgError] = useState(false);
  const heroImage = property.images?.[0];

  const specs: string[] = [];
  if (property.bedrooms > 0) specs.push(`${property.bedrooms} rec`);
  if (property.bathrooms > 0) specs.push(`${property.bathrooms} ba`);
  if (property.constructionM2) specs.push(`${property.constructionM2} m²`);
  else if (property.totalM2) specs.push(`${property.totalM2} m²`);

  const locationLabel = property.neighborhood
    ? `${property.neighborhood}, ${property.city}`
    : property.city;

  return (
    <Link
      href={`/propiedades/${property.id}`}
      className="group block bg-white rounded-t-lg overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_24px_-10px_rgba(26,42,74,0.22)] hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image — 16:10 */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[color:var(--cream)]">
        {heroImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={property.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            style={{
              background:
                "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <div
          className="text-[18px] leading-none text-[color:var(--midnight)] mb-1.5"
          style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontWeight: 700,
          }}
        >
          {formatPrice(property)}
        </div>

        {specs.length > 0 && (
          <div
            className="text-[13px] text-[color:var(--text-secondary)] mb-1"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            {specs.join(" | ")}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] mb-2.5">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded"
            style={{ padding: "2px 6px", fontWeight: 600 }}
          >
            {property.propertyType}
          </span>
          <span
            className="text-[10px] border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)] rounded"
            style={{ padding: "2px 6px", fontWeight: 600 }}
          >
            {property.priceLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main explorer
// ---------------------------------------------------------------------------

type Props = { properties: Property[] };

export default function PropertiesExplorer({ properties }: Props) {
  const [op, setOp] = useState<OpFilter>("Todos");
  const [type, setType] = useState<TypeFilter>("Todos");
  const [price, setPrice] = useState<PriceBucket>("any");
  const [bed, setBed] = useState<BedFilter>("any");

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (op !== "Todos" && p.priceLabel !== op) return false;
      if (type !== "Todos" && p.propertyType !== type) return false;
      if (bed !== "any" && p.bedrooms < parseInt(bed, 10)) return false;
      if (price !== "any") {
        const v = p.price;
        if (price === "lt1" && v >= 1_000_000) return false;
        if (price === "1to5" && (v < 1_000_000 || v >= 5_000_000)) return false;
        if (price === "5to10" && (v < 5_000_000 || v >= 10_000_000))
          return false;
        if (price === "gt10" && v < 10_000_000) return false;
      }
      return true;
    });
  }, [properties, op, type, price, bed]);

  return (
    <div className="bg-white">
      {/* Filter bar — sticky just below the fixed navbar */}
      <div
        className="sticky bg-white border-b border-[#e5e7eb]"
        style={{ top: "76px", zIndex: 30 }}
      >
        <div className="px-6 py-3 flex items-center gap-3 overflow-x-auto md:flex-wrap">
          <FilterDropdown
            label="Operación"
            defaultValue="Todos"
            value={op}
            onChange={setOp}
            options={OP_OPTIONS}
          />
          <FilterDropdown
            label="Tipo"
            defaultValue="Todos"
            value={type}
            onChange={setType}
            options={TYPE_OPTIONS}
          />
          <FilterDropdown
            label="Precio"
            defaultValue="any"
            value={price}
            onChange={setPrice}
            options={PRICE_OPTIONS}
          />
          <FilterDropdown
            label="Recámaras"
            defaultValue="any"
            value={bed}
            onChange={setBed}
            options={BED_OPTIONS}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex items-start">
        {/* Map column — desktop only */}
        <aside
          className="hidden lg:block lg:w-1/2 lg:sticky lg:self-start"
          style={{
            top: "140px",
            height: "calc(100vh - 140px)",
          }}
        >
          <MapPlaceholder />
        </aside>

        {/* Cards column */}
        <div className="w-full lg:w-1/2 px-6 sm:px-8 py-5">
          <div
            className="text-[14px] text-[color:var(--text-secondary)] mb-4"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center text-[color:var(--text-secondary)] text-[14px]">
              No hay propiedades disponibles con estos filtros.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <ExplorerCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
