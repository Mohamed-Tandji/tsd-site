"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LanguageSwitch from "@/components/LanguageSwitch";
import { Link, usePathname } from "@/i18n/navigation";
import type { Pathname } from "@/i18n/routing";

type NavPath = Exclude<Pathname, "/solutions/[slug]" | "/mentions-legales" | "/confidentialite">;

const ITEMS: [NavPath, "home" | "solutions" | "about" | "team" | "contact"][] = [
  ["/", "home"],
  ["/solutions", "solutions"],
  ["/a-propos", "about"],
  ["/equipe", "team"],
  ["/contact", "contact"],
];

export default function Header({ logo }: { logo: string }) {
  const t = useTranslations("nav");
  const h = useTranslations("header");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Le menu mobile se ferme au changement de page et avec Échap
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: NavPath) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-2 px-6 xs:gap-7 nav:px-10">
        <Link href="/" aria-label={h("home")} className="shrink-0">
          <Image
            src={logo}
            alt="TSD Systems"
            width={200}
            height={40}
            priority
            unoptimized
            className="h-7 w-auto xs:h-10"
          />
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto cursor-pointer rounded border border-line px-3 py-2 text-sm leading-normal font-semibold xs:px-3.5 text-navy nav:hidden"
        >
          {h("menu")}
        </button>

        <nav
          id="menu-principal"
          aria-label={h("mainNav")}
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-[76px] flex-col border-b border-line bg-white px-6 pt-2 pb-4 nav:static nav:ml-auto nav:flex nav:flex-row nav:gap-1 nav:border-0 nav:p-0`}
        >
          {ITEMS.map(([href, key]) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`border-b py-3.5 text-[15px] leading-normal text-navy transition-colors duration-150 hover:text-action nav:border-b-[3px] nav:px-3.5 nav:py-2 ${
                  active ? "border-mint font-semibold" : "border-line font-medium nav:border-transparent"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <LanguageSwitch />
      </div>
    </header>
  );
}
