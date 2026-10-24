import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CtaBand from "@/components/CtaBand";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { buttonClass, StatusBadge } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { getSolutions } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Seules les solutions disponibles ont une fiche
async function findSolution(locale: string, slug: string) {
  return (await getSolutions(locale)).find((s) => s.slug === slug && s.status === "AVAILABLE");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = await findSolution(locale, slug);
  if (!solution) return {};
  return pageMetadata({
    locale,
    href: { pathname: "/solutions/[slug]", params: { slug } },
    title: `${solution.name} – ${solution.category}`,
    description: solution.summary,
  });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const solution = await findSolution(locale, slug);
  if (!solution) notFound();

  const t = await getTranslations({ locale, namespace: "catalog" });
  const d = await getTranslations({ locale, namespace: "solutionPage" });

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
              <p className="text-[15px] leading-normal font-semibold text-action">{solution.category}</p>
              <p className="max-w-[560px] text-[1.12rem] whitespace-pre-line text-slate">{solution.description || solution.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/contact" className={buttonClass("primary")}>
                  {d("contact")}
                </Link>
                {solution.appUrl && (
                  <a href={solution.appUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("outline")}>
                    {d("openApp")}
                    <span className="sr-only"> ({d("newTab")})</span>
                  </a>
                )}
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-line bg-white">
              {solution.image ? (
                <Image
                  src={solution.image}
                  alt={d("imageAlt", { name: solution.name })}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 480px"
                  className="object-cover object-top-left"
                />
              ) : solution.logo ? (
                <div className="absolute inset-0 m-auto h-[68%] w-[84%]">
                  <Image src={solution.logo} alt={t("logoAlt", { name: solution.name })} fill unoptimized priority className="object-contain" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {solution.features.length > 0 && (
        <section className="py-[88px] nav:py-[120px]">
          <div className="mx-auto max-w-[1120px] px-6">
            <h2 className="mb-12 max-w-[620px] text-[clamp(2rem,3.6vw,2.7rem)] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-[''] nav:mb-[72px]">
              {d("featuresTitle")}
            </h2>
            <div className="grid grid-cols-1 gap-10 nav:grid-cols-3 nav:gap-16">
              {solution.features.map((f) => (
                <div key={f.title} className="border-t-[3px] border-mint pt-5">
                  <h3 className="mb-2 text-[1.45rem]">{f.title}</h3>
                  <p className="text-slate">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {solution.screenshots.length > 0 && (
        <section className="border-t border-line bg-paper py-[88px] nav:py-[120px]">
          <div className="mx-auto max-w-[1120px] px-6">
            <div className="mb-12 max-w-[620px] nav:mb-16">
              <h2 className="text-[clamp(2rem,3.6vw,2.7rem)] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-['']">
                {d("galleryTitle")}
              </h2>
              <p className="mt-5 text-[1.05rem] text-slate">{d("galleryIntro", { name: solution.name })}</p>
            </div>
            <ScreenshotGallery
              shots={solution.screenshots}
              labels={{
                enlarge: d("enlarge"),
                close: d("close"),
                previous: d("previous"),
                next: d("next"),
                alt: d("screenshotAlt", { name: solution.name }),
              }}
            />
          </div>
        </section>
      )}

      <CtaBand title={d("ctaTitle", { name: solution.name })} text={d("ctaText")} />
    </>
  );
}
