"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import {
  useRef,
  useState,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

const BASE_INPUT =
  "w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2.5 text-[14px] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors";

export function AdminLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
      style={{ letterSpacing: "1.5px", fontWeight: 700 }}
    >
      {children}
    </label>
  );
}

export function AdminField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <AdminLabel>{label}</AdminLabel>
      {children}
    </div>
  );
}

export function AdminInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${BASE_INPUT} ${props.className ?? ""}`} />;
}

export function AdminTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${BASE_INPUT} resize-y ${props.className ?? ""}`}
    />
  );
}

type ImageUploadProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
};

export function AdminImageUpload({
  value,
  onChange,
  label = "Imagen",
  accept = "image/*",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al subir");
      }
      const data = await res.json();
      onChange(data.url as string);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-5">
      <AdminLabel>{label}</AdminLabel>
      <div className="relative rounded-lg border border-dashed border-black/[0.15] overflow-hidden bg-[color:var(--cream)]">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="w-full aspect-[4/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-[color:var(--text-secondary)]">
            <div className="flex flex-col items-center gap-2">
              <ImagePlus size={28} />
              <span className="text-[12px]">Sin imagen</span>
            </div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Loader2
              size={24}
              className="animate-spin text-[color:var(--accent)]"
            />
          </div>
        )}
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Quitar imagen"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-[color:var(--text-primary)] hover:text-red-500 flex items-center justify-center shadow"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--accent)] hover:text-[color:var(--accent-light)] disabled:opacity-50"
          style={{ fontWeight: 700, letterSpacing: "0.5px" }}
        >
          <ImagePlus size={14} />
          {value ? "Cambiar imagen" : "Subir imagen"}
        </button>
        {error && <span className="text-[11px] text-red-500">{error}</span>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
