"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

/**
 * Editorial photo gallery for the property detail page.
 * - 60vh mobile / 70vh desktop
 * - Embla carousel with arrow controls and a "X / N" counter pill
 * - Graceful placeholder when an image fails to load
 */
export default function PropertyDetailGallery({ images, alt }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const markFailed = (i: number) => {
    setFailedIndexes((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  const total = images.length;

  if (total === 0) {
    return (
      <div
        className="w-full flex items-center justify-center"
        style={{
          height: "60vh",
          backgroundColor: "#F7FAFD",
          border: "1px solid #D9D2C3",
          borderRadius: 12,
        }}
      >
        <span style={{ color: "#4A5C7A" }}>Sin fotos disponibles</span>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 12,
        border: "1px solid #D9D2C3",
      }}
    >
      <div
        ref={emblaRef}
        className="overflow-hidden h-[60vh] md:h-[70vh]"
        style={{ maxHeight: 720 }}
      >
        <div className="flex h-full">
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative shrink-0 grow-0 basis-full h-full"
              style={{ backgroundColor: "#F7FAFD" }}
            >
              {failedIndexes.has(i) ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span style={{ color: "#4A5C7A" }}>
                    Imagen no disponible
                  </span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover"
                  onError={() => markFailed(i)}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-colors"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
          >
            <ChevronLeft size={20} strokeWidth={2} color="#001751" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white transition-colors"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }}
          >
            <ChevronRight size={20} strokeWidth={2} color="#001751" />
          </button>
        </>
      )}

      {/* Counter pill */}
      <div
        className="absolute right-3 bottom-3 text-[12px] px-3 py-1.5 rounded-full"
        style={{
          backgroundColor: "rgba(26,26,26,0.75)",
          color: "#FFFFFF",
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        {index + 1} / {total}
      </div>
    </div>
  );
}
