import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import { MailIcon, PhoneIcon } from "@/components/icons";
import PageHeader from "@/components/PageHeader";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type MetaProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetaProps): Promise<Metadata> {
  const { locale } = await params;
  const [t, n] = await Promise.all([getTranslations({ locale, namespace: "contact" }), getTranslations({ locale, namespace: "nav" })]);
  return pageMetadata({ locale, href: "/contact", title: n("contact"), description: t("intro") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const contact = await getSiteSettings();

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")} />

      <section className="py-[88px] nav:py-[120px]">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-14 px-6 nav:grid-cols-[0.8fr_1.2fr] nav:gap-20">
          <div>
            <h2 className="text-[1.65rem] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-['']">
              {t("detailsTitle")}
            </h2>
            <ul className="mt-8 grid gap-5">
              <li className="flex items-start gap-3">
                <MailIcon size={20} className="mt-1 flex-none text-action" />
                <div>
                  <div className="text-sm font-semibold text-slate">{t("emailLabel")}</div>
                  <a href={`mailto:${contact.email}`} className="font-medium text-action underline-offset-4 hover:underline">
                    {contact.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon size={20} className="mt-1 flex-none text-action" />
                <div>
                  <div className="text-sm font-semibold text-slate">{t("phoneLabel")}</div>
                  <span>
                    {contact.phones.map((p, i) => (
                      <span key={p.tel}>
                        {i > 0 && " / "}
                        <a href={`tel:${p.tel}`} className="font-medium whitespace-nowrap text-action underline-offset-4 hover:underline">
                          {p.label}
                        </a>
                      </span>
                    ))}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[1.65rem] after:mt-4 after:block after:h-[3px] after:w-12 after:bg-mint after:content-['']">
              {t("formTitle")}
            </h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
