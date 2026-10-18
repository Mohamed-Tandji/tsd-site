import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui";
import { Link } from "@/i18n/navigation";

// Bandeau marine « Un projet en tête ? » ; titre et texte remplaçables
export default async function CtaBand({ title, text }: { title?: string; text?: string }) {
  const t = await getTranslations("cta");

  return (
    <section className="bg-navy py-[88px] text-center text-white nav:py-[120px]">
      <div className="mx-auto max-w-[1120px] px-6">
        <h2 className="mb-4 text-[clamp(2rem,3.6vw,2.9rem)]">{title ?? t("title")}</h2>
        <p className="mx-auto mb-9 max-w-[460px] text-footer">{text ?? t("text")}</p>
        <Link href="/contact" className={buttonClass("white")}>
          {t("button")}
        </Link>
      </div>
    </section>
  );
}
