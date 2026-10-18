import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-24">
      <p className="text-sm font-semibold uppercase tracking-widest text-action">404</p>
      <h1 className="mt-4 font-serif text-5xl font-bold">{t("title")}</h1>
      <p className="mt-6 text-slate">{t("text")}</p>
      <Link href="/" className="mt-10 inline-block font-semibold text-action underline-offset-4 hover:underline">
        {t("back")}
      </Link>
    </div>
  );
}
