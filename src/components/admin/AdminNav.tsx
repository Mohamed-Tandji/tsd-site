"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  ["/admin", "Tableau de bord"],
  ["/admin/textes", "Textes des pages"],
  ["/admin/coordonnees", "Coordonnées et images"],
  ["/admin/solutions", "Solutions"],
  ["/admin/equipe", "Équipe"],
  ["/admin/messages", "Messages reçus"],
  ["/admin/comptes", "Comptes"],
] as const;

export default function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav aria-label="Administration" className="flex gap-1 overflow-x-auto lg:flex-col">
      {ITEMS.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          className={`flex items-center justify-between gap-3 rounded px-3 py-2 whitespace-nowrap transition-colors duration-150 ${
            isActive(href) ? "bg-paper font-semibold text-navy shadow-[inset_3px_0_0_var(--color-mint)]" : "text-slate hover:bg-paper hover:text-navy"
          }`}
        >
          {label}
          {href === "/admin/messages" && unread > 0 && (
            <span className="rounded-full bg-action px-2 text-xs leading-5 font-semibold text-white">
              {unread}
              <span className="sr-only"> non lu(s)</span>
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
