import { getTranslations, setRequestLocale } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import PageHeader from "@/components/PageHeader";
import SolutionCard from "@/components/SolutionCard";
import { solutions } from "@/lib/site";

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solutionsPage" });

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />
      <section className="py-[88px] nav:py-[120px]">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-9 px-6 nav:grid-cols-3">
          {solutions.map((s) => (
            <SolutionCard key={s.slug} solution={s} headingLevel="h2" />
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
