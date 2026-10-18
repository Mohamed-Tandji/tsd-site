import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import PageHeader from "@/components/PageHeader";
import { getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, n] = await Promise.all([getTranslations({ locale, namespace: "team" }), getTranslations({ locale, namespace: "nav" })]);
  return pageMetadata({ locale, href: "/equipe", title: n("team"), description: t("intro") });
}

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });
  const team = await getTeam(locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-[88px] nav:py-[120px]">
        <ul className="mx-auto grid max-w-[1120px] grid-cols-1 gap-9 px-6 xs:grid-cols-2 nav:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.id} className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
              <div className="relative aspect-[4/5] border-b border-line bg-paper">
                {m.photo && (
                  <Image
                    src={m.photo}
                    alt={t("photoAlt", { name: m.name })}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 350px"
                    className="object-cover object-[50%_20%]"
                  />
                )}
              </div>
              <div className="p-[30px]">
                <h2 className="text-[1.65rem]">{m.name}</h2>
                <p className="mt-1.5 text-sm leading-normal font-semibold text-action">{m.role}</p>
                {m.bio && <p className="mt-3 text-[15.5px] whitespace-pre-line text-slate">{m.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
