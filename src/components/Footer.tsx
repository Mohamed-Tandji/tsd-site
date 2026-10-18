import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MailIcon, PhoneIcon, SocialIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { contact, socials, solutions } from "@/lib/site";

const NAV = [
  ["/solutions", "solutions"],
  ["/a-propos", "about"],
  ["/equipe", "team"],
  ["/contact", "contact"],
] as const;

const linkClass = "text-footer hover:text-white hover:underline";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3.5 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-white before:mb-3.5 before:block before:h-0.5 before:w-6 before:bg-mint before:content-['']">
      {children}
    </h2>
  );
}

export default async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="border-t border-footer-line bg-navy pt-16 text-[15.5px] text-footer">
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-12 px-6 pb-16 xs:grid-cols-2 nav:grid-cols-[1.7fr_0.8fr_1fr_1.3fr]">
        <div>
          <Image src="/brand/logo-tsd-blanc.svg" alt="TSD Systems" width={269} height={54} unoptimized className="mb-3 h-[54px] w-auto" />
          <h2 className="sr-only">{t("contact")}</h2>
          <ul className="mt-7 grid gap-3">
            <li className="flex items-start gap-2.5">
              <MailIcon className="mt-[3px] flex-none opacity-80" />
              <a href={`mailto:${contact.email}`} className={`${linkClass} whitespace-nowrap`}>
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <PhoneIcon className="mt-[3px] flex-none opacity-80" />
              <span>
                {contact.phones.map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 && " / "}
                    <a href={`tel:${p.tel}`} className={`${linkClass} whitespace-nowrap`}>
                      {p.label}
                    </a>
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <nav aria-label={t("navigation")}>
          <ColumnTitle>{t("navigation")}</ColumnTitle>
          <ul className="grid gap-2">
            {NAV.map(([href, key]) => (
              <li key={href}>
                <Link href={href} className={linkClass}>
                  {n(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ColumnTitle>{t("solutions")}</ColumnTitle>
          <ul className="grid gap-2">
            {solutions.map((s) => (
              <li key={s.slug}>
                {s.status === "AVAILABLE" ? (
                  <Link href={{ pathname: "/solutions/[slug]", params: { slug: s.slug } }} className={linkClass}>
                    {s.name}
                  </Link>
                ) : (
                  <Link href="/solutions" className={linkClass}>
                    {s.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColumnTitle>{t("follow")}</ColumnTitle>
          <ul className="grid gap-3">
            {socials.map((s) => {
              const content = (
                <>
                  <SocialIcon name={s.key} className="flex-none" />
                  <span>{s.handle}</span>
                  {s.url && <span className="sr-only">({s.label}, {t("newTab")})</span>}
                </>
              );
              return (
                <li key={s.key}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2.5 text-[14.5px] ${linkClass}`}>
                      {content}
                    </a>
                  ) : (
                    // Compte pas encore créé : affiché sans lien
                    <span className="inline-flex items-center gap-2.5 text-[14.5px]">
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1120px] flex-wrap border-t border-footer-line justify-between gap-x-8 gap-y-3 px-6 pt-6 pb-[calc(24px+env(safe-area-inset-bottom,0px))] text-sm text-footer-muted">
        <span>{t("rights", { year: new Date().getFullYear() })}</span>
        <span className="flex gap-7">
          <Link href="/mentions-legales" className="text-footer-muted hover:text-white hover:underline">
            {t("legal")}
          </Link>
          <Link href="/confidentialite" className="text-footer-muted hover:text-white hover:underline">
            {t("privacy")}
          </Link>
        </span>
      </div>
    </footer>
  );
}
