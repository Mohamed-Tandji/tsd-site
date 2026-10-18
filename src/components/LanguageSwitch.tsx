"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

// Bouton à glissière FR/EN : reste sur la même page dans l'autre langue
export default function LanguageSwitch() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEn = locale === "en";

  function toggle() {
    startTransition(() => {
      // @ts-expect-error -- pathname et params proviennent de la route courante, ils sont cohérents
      router.replace({ pathname, params }, { locale: isEn ? "fr" : "en" });
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEn}
      aria-label={t("language")}
      onClick={toggle}
      disabled={pending}
      className="relative grid h-9 w-[84px] shrink-0 cursor-pointer grid-cols-2 rounded-full border border-line bg-paper p-0 text-[13px] font-semibold text-slate"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-navy transition-transform duration-150 ${isEn ? "translate-x-full" : ""}`}
      />
      <span aria-hidden="true" className={`relative grid place-items-center transition-colors duration-150 ${isEn ? "" : "text-white"}`}>
        FR
      </span>
      <span aria-hidden="true" className={`relative grid place-items-center transition-colors duration-150 ${isEn ? "text-white" : ""}`}>
        EN
      </span>
    </button>
  );
}
