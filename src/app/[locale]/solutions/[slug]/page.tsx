import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import { buttonClass, StatusBadge } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { solutions } from "@/lib/site";

const FEATURES = ["a", "b", "c"] as const;

// Seules les solutions disponibles ont une fiche
const available = solutions.filter((s) => s.status === "AVAILABLE");

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => available.map((s) => ({ locale, slug: s.slug })));
}

export const dynamicParams = false;

export default async function SolutionDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const solution = available.find((s) => s.slug === slug);
  if (!solution) notFound();

  const t = await getTranslations({ locale, namespace: "catalog" });
  const d = await getTranslations({ locale, namespace: "solutionPage" });
  const item = (key: string) => t(`items.${slug}.${key}`);

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-6 py-[72px] nav:py-24">
          <Link href="/solutions" className="text-[15px] font-medium text-action underline-offset-4 hover:underline">
            ← {d("back")}
          </Link>
          <div className="mt-10 grid grid-cols-1 items-center gap-12 nav:grid-cols-[1.1fr_0.9fr] nav:gap-16">
            <div className="flex flex-col gap-4">
              <StatusBadge available label={t("available")} />
              <h1 className="text-[clamp(2.4rem,4.2vw,3.6rem)] tracking-[-0.01em]">{solution.name}</h1>
              <p className="text-[15px] leading-normal font-semibold text-action">{item("category")}</p>
              <p className="max-w-[560px] text-[1.12rem] text-slate">{item("description")}</p>
              <div className="mt-4">
                <Link href="/contact" className={buttonClass("primary")}>
                  {d("contact")}
                </Link>
              </div>
            </div>
            <div className="relative aspect-[16/10] rounded-md border border-line bg-white">
              <div className="absolute inset-0 m-auto h-[68%] w-[84%]">
                <Image src={solution.logo} alt={t("logoAlt", { name: solution.name })} fill unoptimized priority className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-[88px] nav:py-[120px]">
        <div className="mx-auto max-w-[1120px] px-6">
          <h2 className="mb-12 max-w-[620px] text-[clamp(2rem,3.6vw,2.7rem)] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-[''] nav:mb-[72px]">
            {d("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-10 nav:grid-cols-3 nav:gap-16">
            {FEATURES.map((key) => (
              <div key={key} className="border-t-[3px] border-mint pt-5">
                <h3 className="mb-2 text-[1.45rem]">{item(`features.${key}.title`)}</h3>
                <p className="text-slate">{item(`features.${key}.text`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={d("ctaTitle", { name: solution.name })} text={d("ctaText")} />
    </>
  );
}
