"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
  type TouchEvent,
} from "react";

type Props = {
  images: string[];
  open: boolean;
  startIndex: number;
  onClose: () => void;
};

const MIN_SWIPE_PX = 50;

export default function ImageLightbox({
  images,
  open,
  startIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    setIndex(startIndex);
  }, [startIndex, open]);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  if (!open) return null;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart == null || touchEnd == null) return;
    const distance = touchStart - touchEnd;
    if (distance > MIN_SWIPE_PX) next();
    else if (distance < -MIN_SWIPE_PX) prev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Galería de fotos"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
    >
      {/* Counter */}
      <div
        className="absolute top-6 left-6 text-white/80 text-[13px] tracking-[2px] uppercase"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
      >
        {index + 1} / {images.length}
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          onClose();
        }}
        aria-label="Cerrar galería"
        className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X size={26} />
      </button>

      {/* Prev */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          prev();
        }}
        aria-label="Foto anterior"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          next();
        }}
        aria-label="Foto siguiente"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-white/5 hover:bg-white/15 transition-colors"
      >
        <ChevronRight size={28} />
      </button>

      {/* Image frame */}
      <div
        onClick={stop}
        className="relative w-[90%] max-w-5xl aspect-[4/3] rounded-xl overflow-hidden shadow-2xl"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--midnight) 0%, var(--dark-blue) 100%)",
          }}
        >
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
              className="text-white/70 text-sm uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              Foto {index + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
