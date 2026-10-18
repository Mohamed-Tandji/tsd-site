import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });

  return (
    <main className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-action">{c("step")}</p>
      <h1 className="mt-4 max-w-2xl font-serif text-6xl font-bold leading-[1.05]">{t("title")}</h1>
      <p className="mt-6 max-w-xl text-lg text-slate">{t("subtitle")}</p>
      <Link
        href="/solutions"
        className="mt-10 inline-block rounded bg-action px-6 py-3 font-semibold text-white hover:opacity-90"
      >
        {t("cta")}
      </Link>
    </main>
  );
}
