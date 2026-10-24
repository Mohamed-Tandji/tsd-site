import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import reunion from "@/assets/apropos-reunion.jpg";
import CtaBand from "@/components/CtaBand";
import LogoAnimation from "@/components/LogoAnimation";
import PageHeader from "@/components/PageHeader";
import { SectionHeading } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const PRINCIPLES = ["simple", "users", "lasting"] as const;
const VALUES = ["clarity", "reliability", "listening", "transparency"] as const;

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, n] = await Promise.all([getTranslations({ locale, namespace: "about" }), getTranslations({ locale, namespace: "nav" })]);
  return pageMetadata({ locale, href: "/a-propos", title: n("about"), description: t("intro") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const h = await getTranslations({ locale, namespace: "home" });
  const { images } = await getSiteSettings();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      {/* Mission */}
      <section className="py-[88px] nav:py-[120px]">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 nav:grid-cols-2 nav:gap-16">
          <div>
            <SectionHeading title={t("missionTitle")} tight />
            <p className="text-slate">{t("mission1")}</p>
            <p className="mt-4 text-slate">{t("mission2")}</p>
          </div>
          {/* Photo d'illustration (banque d'images) : décorative, ne représente pas l'équipe */}
          <div className="relative aspect-[3/2] overflow-hidden rounded-md">
            <Image src={images.about || reunion} alt="" fill sizes="(max-width: 900px) 100vw, 520px" className="object-cover" />
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="border-t border-line py-[88px] nav:py-[120px]">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading title={h("approachTitle")} />
          <div className="grid grid-cols-1 gap-10 nav:grid-cols-3 nav:gap-16">
            {PRINCIPLES.map((key) => (
              <div key={key} className="border-t-[3px] border-mint pt-5">
                <h3 className="mb-2 text-[1.45rem]">{h(`principles.${key}.title`)}</h3>
                <p className="text-slate">{h(`principles.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principes */}
      <section className="border-t border-line bg-paper py-[88px] nav:py-[120px]">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading title={t("valuesTitle")} />
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line xs:grid-cols-2">
            {VALUES.map((key) => (
              <div key={key} className="bg-white p-8">
                <dt className="font-serif text-[1.45rem] leading-[1.08] font-bold">{t(`values.${key}.title`)}</dt>
                <dd className="mt-2 text-slate">{t(`values.${key}.text`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Origine du nom */}
      <section className="border-t border-line py-[88px] nav:py-[120px]">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-12 px-6 nav:grid-cols-[0.85fr_1.15fr] nav:gap-16">
          <div className="max-w-[620px]">
            <h2 className="text-[clamp(2rem,3.6vw,2.7rem)]">
              {/* « TSD » dans la couleur du logo, même si le titre est modifié dans l'admin */}
              {t("nameTitle")
                .split(/(\bTSD\b)/)
                .map((part, i) => (part === "TSD" ? <span key={i} className="text-brand">{part}</span> : part))}
            </h2>
            <p className="mt-4 text-slate">{t("nameText")}</p>
            <Link href="/equipe" className="mt-6 inline-block font-semibold text-action underline-offset-4 hover:underline">
              {t("teamLink")} →
            </Link>
          </div>
          <LogoAnimation
            labels={{ title: t("animationTitle"), play: t("animationPlay"), pause: t("animationPause"), replay: t("animationReplay") }}
          />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
