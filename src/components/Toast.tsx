"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  message: string;
  onDismiss: () => void;
  duration?: number;
};

export default function Toast({ message, onDismiss, duration = 4000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <motion.div
      layout
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      className="relative pointer-events-auto bg-[color:var(--midnight)] text-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.25)] min-w-[280px] max-w-[380px] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 pr-10">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 shrink-0">
          <Check
            size={16}
            className="text-emerald-400"
            strokeWidth={3}
          />
        </span>
        <p
          className="text-[14px] leading-snug"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          {message}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar notificación"
        className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[color:var(--accent-light)] origin-left"
      />
    </motion.div>
  );
}
