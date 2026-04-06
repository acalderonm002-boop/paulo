"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UseAdminResult = {
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useAdmin(): UseAdminResult {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/verify", { cache: "no-store" });
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
    } catch {
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setIsAdmin(false);
    router.refresh();
  }, [router]);

  return { isAdmin, loading, logout, refresh };
}
