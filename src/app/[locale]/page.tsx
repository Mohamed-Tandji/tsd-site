import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import bandeau from "@/assets/accueil-bandeau.jpg";
import CtaBand from "@/components/CtaBand";
import SolutionCard from "@/components/SolutionCard";
import { buttonClass, SectionHeading } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getSiteSettings, getSolutions } from "@/lib/content";

const AUDIENCES = ["schools", "businesses", "agriculture"] as const;
const PRINCIPLES = ["simple", "users", "lasting"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const [{ images }, solutions] = await Promise.all([getSiteSettings(), getSolutions(locale)]);

  return (
    <>
      {/* Bandeau : photo à droite fondue vers le blanc (en haut, fondue vers le bas, sous 900 px) */}
      <section className="relative overflow-hidden nav:flex nav:min-h-[720px] nav:items-center">
        <div
          aria-hidden="true"
          className="relative h-[300px] w-full [mask-image:linear-gradient(180deg,#000_55%,transparent)] nav:absolute nav:inset-y-0 nav:right-0 nav:h-auto nav:w-[48%] nav:[mask-image:linear-gradient(90deg,transparent_0,#000_48%)]"
        >
          <Image
            src={images.hero || bandeau}
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 48vw"
            quality={75}
            className="object-cover object-[62%_55%]"
          />
        </div>
        <div className="relative z-[1] mx-auto w-full max-w-[1120px] px-6">
          <div className="max-w-[560px] pb-20 nav:py-32">
            <p className="flex items-center gap-3.5 text-[13px] leading-none font-semibold tracking-[0.12em] text-action uppercase before:h-[3px] before:w-10 before:bg-mint before:content-['']">
              TSD Systems
            </p>
            <h1 className="mt-7 mb-[30px] text-[clamp(2.6rem,4.8vw,4.3rem)] tracking-[-0.01em]">{t("title")}</h1>
            <p className="mb-[46px] max-w-[480px] text-[1.18rem] text-slate">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/solutions" className={buttonClass("primary")}>
                {t("ctaSolutions")}
              </Link>
              <Link href="/contact" className={`${buttonClass("outline")} bg-white`}>
                {t("ctaContact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Publics visés */}
      <div className="border-y border-line">
        <ul className="mx-auto grid max-w-[1120px] grid-cols-1 px-6 xs:grid-cols-3">
          {AUDIENCES.map((key, i) => (
            <li
              key={key}
              className={`px-4 py-[30px] text-center text-[15px] leading-normal font-medium ${i > 0 ? "border-t border-line xs:border-t-0 xs:border-l" : ""}`}
            >
              {t(`audiences.${key}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Solutions */}
      <section className="py-[88px] nav:py-[136px]">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading title={t("solutionsTitle")} text={t("solutionsText")} />
          <div className="grid grid-cols-1 gap-9 nav:grid-cols-3">
            {solutions.map((s) => (
              <SolutionCard key={s.slug} solution={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Approche */}
      <section className="border-t border-line py-[88px] nav:py-[136px]">
        <div className="mx-auto max-w-[1120px] px-6">
          <SectionHeading title={t("approachTitle")} />
          <div className="grid grid-cols-1 gap-10 nav:grid-cols-3 nav:gap-16">
            {PRINCIPLES.map((key) => (
              <div key={key} className="border-t-[3px] border-mint pt-5">
                <h3 className="mb-2 text-[1.45rem]">{t(`principles.${key}.title`)}</h3>
                <p className="text-slate">{t(`principles.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
