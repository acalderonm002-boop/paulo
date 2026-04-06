"use client";

import {
  Building2,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PlusCircle,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BaseItem = {
  key: string;
  icon: LucideIcon;
  label: string;
};

type LinkItem = BaseItem & { href: string; external?: boolean };
type ButtonItem = BaseItem & { onClick: () => void; badge?: number };
type NavItem = LinkItem | ButtonItem;

type Props = {
  onNewProperty: () => void;
  onOpenMessages: () => void;
  onLogout: () => void;
  unreadCount: number;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

export default function AdminSidebar({
  onNewProperty,
  onOpenMessages,
  onLogout,
  unreadCount,
  mobileOpen,
  setMobileOpen,
}: Props) {
  const pathname = usePathname() ?? "";

  const items: NavItem[] = [
    {
      key: "sitio",
      icon: LayoutDashboard,
      label: "Página Principal",
      href: "/admin/sitio",
    },
    {
      key: "propiedades",
      icon: Building2,
      label: "Propiedades",
      href: "/admin/propiedades",
    },
    {
      key: "new",
      icon: PlusCircle,
      label: "Nueva Propiedad",
      onClick: onNewProperty,
    },
    {
      key: "messages",
      icon: MessageSquare,
      label: "Mensajes",
      onClick: onOpenMessages,
      badge: unreadCount,
    },
    {
      key: "public",
      icon: ExternalLink,
      label: "Ver Sitio Público",
      href: "/",
      external: true,
    },
    {
      key: "logout",
      icon: LogOut,
      label: "Cerrar Sesión",
      onClick: onLogout,
    },
  ];

  const baseItemClass =
    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[14px] transition-colors";

  const renderItem = (item: NavItem) => {
    const isLink = "href" in item;
    const active =
      isLink &&
      !item.external &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`));
    const cls = `${baseItemClass} ${
      active
        ? "bg-[color:var(--accent)] text-white"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

    const Icon = item.icon;
    const inner = (
      <>
        <Icon size={16} className="shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {!isLink && "badge" in item && item.badge != null && item.badge > 0 && (
          <span
            className="bg-[color:var(--accent)] text-white text-[10px] rounded-full px-1.5 min-w-[18px] text-center"
            style={{ fontWeight: 700 }}
          >
            {item.badge}
          </span>
        )}
      </>
    );

    if (isLink) {
      if (item.external) {
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cls}
          >
            {inner}
          </a>
        );
      }
      return (
        <Link
          key={item.key}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={cls}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => {
          item.onClick();
          setMobileOpen(false);
        }}
        className={cls}
      >
        {inner}
      </button>
    );
  };

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Cerrar menú admin" : "Abrir menú admin"}
        className="lg:hidden fixed top-4 left-4 w-11 h-11 rounded-lg bg-[color:var(--midnight)] text-white flex items-center justify-center shadow-lg"
        style={{ zIndex: 100000 }}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50"
          style={{ zIndex: 99998 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[240px] bg-[color:var(--midnight)] text-white flex flex-col transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ zIndex: 99999 }}
        aria-label="Panel de administración"
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div
            className="text-white text-xl tracking-[0.18em] mb-1"
            style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
          >
            PAULO LEAL
          </div>
          <p
            className="text-[12px] text-[color:var(--accent-light)] uppercase"
            style={{ letterSpacing: "2px", fontWeight: 600 }}
          >
            Admin
          </p>
        </div>

        <div className="mx-5 border-t border-white/10 mb-4" />

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-6">
          {items.map(renderItem)}
        </nav>
      </aside>
    </>
  );
}
