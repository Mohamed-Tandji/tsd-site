import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonClass, StatusBadge } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import type { SolutionInfo } from "@/lib/site";

// Carte solution (accueil et page Solutions) : « Découvrir » seulement si la solution est disponible
export default async function SolutionCard({ solution, headingLevel = "h3" }: { solution: SolutionInfo; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const t = await getTranslations("catalog");
  const available = solution.status === "AVAILABLE";

  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-line bg-white">
      <div className="relative aspect-[16/10] border-b border-line bg-white">
        <div className="absolute inset-0 m-auto h-[68%] w-[84%]">
          <Image src={solution.logo} alt={t("logoAlt", { name: solution.name })} fill unoptimized className="object-contain" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-[30px]">
        <StatusBadge available={available} label={available ? t("available") : t("comingSoon")} />
        <Heading className="mt-1.5 text-[1.65rem]">{solution.name}</Heading>
        <div className="text-sm leading-normal font-semibold text-action">{t(`items.${solution.slug}.category`)}</div>
        <p className="text-[15.5px] text-slate">{t(`items.${solution.slug}.summary`)}</p>
        {available && (
          <div className="mt-auto pt-4">
            <Link
              href={{ pathname: "/solutions/[slug]", params: { slug: solution.slug } }}
              className={buttonClass("outline", "sm")}
              aria-label={t("discoverName", { name: solution.name })}
            >
              {t("discover")}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
