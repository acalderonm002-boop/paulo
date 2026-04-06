"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!password) {
      setError("Ingresa la contraseña");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Error al iniciar sesión");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <main
      className="fixed inset-0 flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--midnight)" }}
    >
      <div
        className="w-full bg-white rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)]"
        style={{ maxWidth: "400px", padding: "48px" }}
      >
        <div className="text-center mb-10">
          <div
            className="text-[color:var(--text-primary)] text-2xl tracking-[0.18em] mb-2"
            style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
          >
            PAULO LEAL
          </div>
          <p
            className="text-[color:var(--text-secondary)] text-[13px] uppercase"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "2.5px",
            }}
          >
            Administración
          </p>
          <div
            aria-hidden
            className="mx-auto mt-5 h-[2px] w-[40px] bg-[color:var(--accent)]"
          />
        </div>

        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div>
            <label
              className="block text-[11px] uppercase text-[color:var(--text-secondary)] mb-1.5"
              style={{ letterSpacing: "1.5px", fontWeight: 700 }}
            >
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              autoFocus
              className={`w-full bg-[color:var(--cream)] border rounded-lg px-4 py-3 text-[15px] focus:outline-none transition-colors ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-black/[0.1] focus:border-[color:var(--accent)]"
              }`}
            />
            {error && (
              <p className="mt-2 text-[12px] text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[color:var(--accent)] text-white py-[14px] rounded-lg text-[12px] uppercase hover:bg-[color:var(--accent-light)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ letterSpacing: "2px", fontWeight: 700 }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
