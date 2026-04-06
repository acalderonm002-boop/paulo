"use client";

import { Images, Play } from "lucide-react";
import { useState } from "react";
import type { Property } from "@/data/properties";
import ImageLightbox from "./ImageLightbox";

type Props = { property: Property };

function Placeholder({ label }: { label: string }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, #ffffff 0%, transparent 55%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white/70 text-[11px] uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          {label}
        </span>
      </div>
    </>
  );
}

export default function PropertyGallery({ property }: Props) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);

  const openAt = (i: number) => {
    setStart(i);
    setOpen(true);
  };

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-3 h-[360px] md:h-[460px] lg:h-[520px]">
          {/* Main image */}
          <button
            type="button"
            onClick={() => openAt(0)}
            aria-label="Abrir galería"
            className="group relative rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <Placeholder label="Foto 1" />
            </div>
            {property.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play
                    size={30}
                    className="text-[color:var(--midnight)] ml-1"
                    fill="currentColor"
                  />
                </div>
              </div>
            )}
          </button>

          {/* 2x2 grid of thumbs (desktop only) */}
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`Ver foto ${i + 1}`}
                className="group relative rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                  <Placeholder label={`Foto ${i + 1}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* "Ver todas las fotos" button */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="absolute bottom-5 right-5 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[color:var(--text-primary)] px-5 py-3 rounded-lg text-[11px] uppercase shadow-lg hover:bg-white transition-colors"
          style={{ letterSpacing: "1.5px", fontWeight: 700 }}
        >
          <Images size={16} className="text-[color:var(--accent)]" />
          Ver todas las fotos ({property.images.length})
        </button>
      </div>

      <ImageLightbox
        images={property.images}
        open={open}
        startIndex={start}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
