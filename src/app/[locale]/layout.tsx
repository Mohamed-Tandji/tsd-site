import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { routing } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import "../globals.css";

const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-crimson" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

// Contenu lu en base à chaque requête (avec cache invalidé par l'administration)
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: "%s – TSD Systems" },
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "header" });
  const settings = await getSiteSettings();
  // Seuls les textes des composants client sont envoyés au navigateur (allège chaque page)
  const messages = await getMessages();
  const clientMessages = { nav: messages.nav, header: messages.header, contact: { form: (messages.contact as Record<string, unknown>).form } };

  return (
    <html lang={locale} className={`${crimson.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-navy antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-30 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <Header logo={settings.images.logo} />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
