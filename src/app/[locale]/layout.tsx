import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/Nav";
import { routing } from "@/i18n/routing";
import "../globals.css";

const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-crimson" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${crimson.variable} ${inter.variable}`}>
      <body className="bg-white font-sans text-navy antialiased">
        <NextIntlClientProvider>
          <Nav />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
