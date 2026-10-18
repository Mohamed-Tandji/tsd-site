import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { locale: string; ns: "contact" | "legal" | "privacy" };

export default async function PlaceholderPage({ locale, ns }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: `pages.${ns}` });
  const c = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-action">{c("step")}</p>
      <h1 className="mt-4 font-serif text-5xl font-bold">{t("title")}</h1>
      <p className="mt-6 text-slate">{c("soon")}</p>
    </div>
  );
}
