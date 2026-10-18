import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalDocument from "@/components/LegalDocument";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return pageMetadata({ locale, href: "/confidentialite", title: t("title"), description: t("description") });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  const { legal, email } = await getSiteSettings();
  const missing = t("missing");

  return (
    <LegalDocument
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      missing={missing}
      sections={[
        { title: t("controllerTitle"), fields: [[t("controller"), legal.company], [t("contact"), email]] },
        { title: t("dataTitle"), paragraphs: [t("dataText"), t("ipText")] },
        { title: t("purposeTitle"), paragraphs: [t("purposeText")] },
        { title: t("recipientsTitle"), paragraphs: [t("recipientsText")] },
        { title: t("retentionTitle"), fields: [[t("retention"), legal.retention]] },
        { title: t("cookiesTitle"), paragraphs: [t("cookiesText")] },
        { title: t("rightsTitle"), paragraphs: [t("rightsText", { email })] },
      ]}
    />
  );
}
