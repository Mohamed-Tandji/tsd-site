"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

// Navigation TEMPORAIRE de l'étape 4 : elle sert à vérifier les pages séparées et le changement de langue.
// Elle sera remplacée à l'étape 5 par l'en-tête dessiné.
const ITEMS = [
  ["/", "home"],
  ["/solutions", "solutions"],
  ["/a-propos", "about"],
  ["/equipe", "team"],
  ["/contact", "contact"],
] as const;

export default function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const other = locale === "fr" ? "en" : "fr";

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-[1120px] items-center gap-6 px-6 py-4">
        <span className="font-serif text-xl font-bold text-brand">TSD SYSTEMS</span>
        <nav className="ml-auto flex gap-5 text-sm" aria-label="Navigation principale">
          {ITEMS.map(([href, key]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? "font-semibold text-action" : "text-navy hover:text-action"}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => router.replace(pathname, { locale: other })}
          className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
        >
          {locale.toUpperCase()} → {other.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
