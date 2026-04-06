"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import MessagesDrawer from "./MessagesDrawer";
import PropertyWizard from "./PropertyWizard";
import { useAdmin } from "@/hooks/useAdmin";

type Props = { children: ReactNode };

export default function AdminShell({ children }: Props) {
  const { isAdmin, loading, logout } = useAdmin();
  const router = useRouter();
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Redirect to login if the cookie was cleared.
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace("/admin");
    }
  }, [loading, isAdmin, router]);

  // Initial unread count.
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/contacts", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        type C = { read: boolean };
        setUnread(
          ((data.contacts ?? []) as C[]).filter((c) => !c.read).length
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/admin");
  }, [logout, router]);

  if (loading || !isAdmin) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "var(--cream)" }}
      >
        <Loader2
          size={24}
          className="animate-spin text-[color:var(--accent)]"
        />
      </div>
    );
  }

  return (
    <>
      <AdminSidebar
        onNewProperty={() => setWizardOpen(true)}
        onOpenMessages={() => setMessagesOpen(true)}
        onLogout={handleLogout}
        unreadCount={unread}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="lg:ml-[240px] min-h-screen">{children}</div>

      <MessagesDrawer
        open={messagesOpen}
        onClose={() => setMessagesOpen(false)}
        onUnreadChange={setUnread}
      />

      <PropertyWizard
        open={wizardOpen}
        onClose={() => {
          setWizardOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
