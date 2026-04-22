"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import PropertyMap from "./PropertyMap";
import {
  abbreviatePrice,
  formatPrice,
  type PriceLabel,
  type Property,
  type PropertyType,
} from "@/data/properties";

// ---------------------------------------------------------------------------
// Filter types & options
// ---------------------------------------------------------------------------

type OpFilter = "Todos" | PriceLabel;
type TypeFilter = "Todos" | PropertyType;
type PriceBucket = "any" | "lt1" | "1to5" | "5to10" | "gt10";
type RentBucket = "any" | "rlt20" | "r20to50" | "r50to100" | "rgt100";
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

const SALE_PRICE_OPTIONS: Option<PriceBucket>[] = [
  { value: "any", label: "Cualquiera" },
  { value: "lt1", label: "Menos de $1M" },
  { value: "1to5", label: "$1M - $5M" },
  { value: "5to10", label: "$5M - $10M" },
  { value: "gt10", label: "$10M+" },
];

const RENT_PRICE_OPTIONS: Option<RentBucket>[] = [
  { value: "any", label: "Cualquiera" },
  { value: "rlt20", label: "Menos de $20K" },
  { value: "r20to50", label: "$20K - $50K" },
  { value: "r50to100", label: "$50K - $100K" },
  { value: "rgt100", label: "$100K+" },
];

const BED_OPTIONS: Option<BedFilter>[] = [
  { value: "any", label: "Cualquiera" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
];

// ---------------------------------------------------------------------------
// Custom dropdown (button + popover)
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
  const display = isDefault
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
          fontFamily: "var(--font-inter), sans-serif",
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
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
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
// Horizontal property card
// ---------------------------------------------------------------------------

type CardProps = {
  property: Property;
  hovered: boolean;
  onHover: (id: string | null) => void;
};

function HorizontalCard({ property, hovered, onHover }: CardProps) {
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
      onMouseEnter={() => onHover(property.id)}
      onMouseLeave={() => onHover(null)}
      className={`group flex items-stretch bg-white rounded-xl overflow-hidden border transition-all duration-200 ${
        hovered
          ? "border-[color:var(--accent)] shadow-[0_12px_28px_-10px_rgba(26,42,74,0.22)] -translate-y-0.5"
          : "border-transparent shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_-10px_rgba(26,42,74,0.22)] hover:-translate-y-0.5"
      }`}
    >
      {/* Image — 40% of card width */}
      <div className="relative w-[40%] shrink-0 self-stretch overflow-hidden bg-[color:var(--cream)]">
        {heroImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroImage}
            alt={property.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.04]"
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

      {/* Content — 60% */}
      <div className="flex-1 min-w-0 p-4 flex flex-col">
        <div
          className="text-[20px] leading-none text-[color:var(--midnight)] mb-2"
          style={{
            fontFamily: '"Cabinet Grotesk", var(--font-inter), sans-serif',
            fontWeight: 700,
          }}
        >
          {formatPrice(property)}
        </div>

        {specs.length > 0 && (
          <div
            className="text-[13px] text-[color:var(--text-secondary)] mb-1"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            {specs.join(" | ")}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[13px] text-[color:var(--text-secondary)] mb-3">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-auto">
          <span
            className="text-[11px] bg-[color:var(--accent)]/10 text-[color:var(--accent)] rounded"
            style={{ padding: "2px 8px", fontWeight: 600 }}
          >
            {property.propertyType}
          </span>
          <span
            className="text-[11px] border border-[color:var(--text-secondary)]/30 text-[color:var(--text-secondary)] rounded"
            style={{ padding: "2px 8px", fontWeight: 600 }}
          >
            {property.priceLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Search input (with debounce in parent)
// ---------------------------------------------------------------------------

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative flex-1 min-w-[200px] max-w-[360px] shrink-0">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)] pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o ubicación..."
        className="w-full bg-white border border-[#e5e7eb] rounded-lg pl-9 pr-9 py-2 text-[13px] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main explorer
// ---------------------------------------------------------------------------

type Props = { properties: Property[] };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function PropertiesExplorer({ properties }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [op, setOp] = useState<OpFilter>("Todos");
  const [type, setType] = useState<TypeFilter>("Todos");
  const [salePrice, setSalePrice] = useState<PriceBucket>("any");
  const [rentPrice, setRentPrice] = useState<RentBucket>("any");
  const [bed, setBed] = useState<BedFilter>("any");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Debounce the search input → search state.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset price buckets when switching operation.
  useEffect(() => {
    setSalePrice("any");
    setRentPrice("any");
  }, [op]);

  const filtered = useMemo(() => {
    const q = normalize(search);
    return properties.filter((p) => {
      if (op !== "Todos" && p.priceLabel !== op) return false;
      if (type !== "Todos" && p.propertyType !== type) return false;
      if (bed !== "any" && p.bedrooms < parseInt(bed, 10)) return false;
      if (q) {
        const hay = `${p.title} ${p.location} ${p.neighborhood} ${p.city}`;
        if (!normalize(hay).includes(q)) return false;
      }
      // Sale price bucket only applies to sale listings, rent bucket to rentals.
      if (p.priceLabel === "Venta" && salePrice !== "any") {
        const v = p.price;
        if (salePrice === "lt1" && v >= 1_000_000) return false;
        if (salePrice === "1to5" && (v < 1_000_000 || v >= 5_000_000))
          return false;
        if (salePrice === "5to10" && (v < 5_000_000 || v >= 10_000_000))
          return false;
        if (salePrice === "gt10" && v < 10_000_000) return false;
      }
      if (p.priceLabel === "Renta" && rentPrice !== "any") {
        const v = p.price;
        if (rentPrice === "rlt20" && v >= 20_000) return false;
        if (rentPrice === "r20to50" && (v < 20_000 || v >= 50_000))
          return false;
        if (rentPrice === "r50to100" && (v < 50_000 || v >= 100_000))
          return false;
        if (rentPrice === "rgt100" && v < 100_000) return false;
      }
      return true;
    });
  }, [properties, op, type, search, bed, salePrice, rentPrice]);

  // Has any filter been touched?
  const anyActive =
    search.length > 0 ||
    op !== "Todos" ||
    type !== "Todos" ||
    salePrice !== "any" ||
    rentPrice !== "any" ||
    bed !== "any";

  const clearAll = () => {
    setSearchInput("");
    setSearch("");
    setOp("Todos");
    setType("Todos");
    setSalePrice("any");
    setRentPrice("any");
    setBed("any");
  };

  // The price dropdown switches options/state depending on chosen operation.
  // When op is "Todos" we show the sale buckets (most common case).
  const showRentBuckets = op === "Renta";

  // Suppress the "abbreviatePrice" import lint when not used directly here.
  void abbreviatePrice;

  return (
    <div className="bg-white">
      {/* Filter bar — sticky at the top of the viewport, full-width white */}
      <div
        className="sticky bg-white border-b border-[#e5e7eb]"
        style={{ top: 0, zIndex: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center gap-3 overflow-x-auto md:flex-wrap">
          <SearchBar value={searchInput} onChange={setSearchInput} />
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
          {showRentBuckets ? (
            <FilterDropdown
              label="Precio"
              defaultValue="any"
              value={rentPrice}
              onChange={setRentPrice}
              options={RENT_PRICE_OPTIONS}
            />
          ) : (
            <FilterDropdown
              label="Precio"
              defaultValue="any"
              value={salePrice}
              onChange={setSalePrice}
              options={SALE_PRICE_OPTIONS}
            />
          )}
          <FilterDropdown
            label="Recámaras"
            defaultValue="any"
            value={bed}
            onChange={setBed}
            options={BED_OPTIONS}
          />
          {anyActive && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[12px] text-[color:var(--text-secondary)] hover:text-[color:var(--accent)] underline underline-offset-2 shrink-0"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Map + cards */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-6 items-start">
          {/* Map column — desktop only, sticky */}
          <aside
            className="hidden lg:block lg:sticky"
            style={{
              top: "74px",
              height: "calc(100vh - 94px)",
            }}
          >
            <PropertyMap
              properties={filtered}
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          </aside>

          {/* Cards column */}
          <div>
            <div
              className="text-[14px] text-[color:var(--text-secondary)] mb-4"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {filtered.length}{" "}
              {filtered.length === 1
                ? "propiedad disponible"
                : "propiedades disponibles"}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-[#e5e7eb] bg-[color:var(--cream)] p-10 text-center">
                <p className="text-[14px] text-[color:var(--text-primary)] mb-3">
                  No se encontraron propiedades
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 bg-[color:var(--accent)] text-white px-4 py-2 rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors"
                  style={{ letterSpacing: "1.2px", fontWeight: 700 }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((p) => (
                  <HorizontalCard
                    key={p.id}
                    property={p}
                    hovered={hoveredId === p.id}
                    onHover={setHoveredId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
