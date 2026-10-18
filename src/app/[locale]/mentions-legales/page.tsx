import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import LegalDocument from "@/components/LegalDocument";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalPage" });
  return pageMetadata({ locale, href: "/mentions-legales", title: t("title"), description: t("description") });
}

export default async function LegalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legalPage" });
  const { legal, email, phones } = await getSiteSettings();

  return (
    <LegalDocument
      eyebrow={t("eyebrow")}
      title={t("title")}
      missing={t("missing")}
      sections={[
        {
          title: t("publisherTitle"),
          fields: [
            [t("company"), legal.company],
            [t("form"), legal.form],
            [t("registration"), legal.registration],
            [t("address"), legal.address],
            [t("email"), email],
            [t("phone"), phones.map((p) => p.label).join(" / ")],
          ],
        },
        { title: t("directorTitle"), fields: [[t("director"), legal.publisher]] },
        { title: t("hostTitle"), fields: [[t("host"), legal.host]] },
        { title: t("ipTitle"), paragraphs: [t("ipText"), t("photosText")] },
        { title: t("contactTitle"), paragraphs: [t("contactText", { email })] },
      ]}
    />
  );
}
