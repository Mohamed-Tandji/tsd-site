import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import { inputClass } from "@/components/admin/styles";
import { ConfirmSubmit, LangTabs, SubmitButton } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { defaultText, SECTIONS, sectionKeys } from "@/lib/messages-admin";
import { resetTexts, saveTexts } from "./actions";

export const metadata: Metadata = { title: "Textes des pages" };

type Search = Promise<{ section?: string; ok?: string; error?: string }>;

export default async function TextsPage({ searchParams }: { searchParams: Search }) {
  const { section: requested, ok, error } = await searchParams;
  const section = SECTIONS.find((s) => s.key === requested) ?? SECTIONS[0];
  const keys = sectionKeys(section.key);
  const saved = await db.setting.findMany({ where: { key: { in: keys.map((k) => `msg.${k}`) } } });
  const value = (key: string, locale: "fr" | "en") => {
    const row = saved.find((s) => s.key === `msg.${key}`);
    return row ? (locale === "fr" ? row.valueFr : row.valueEn) : defaultText(key, locale);
  };

  const fields = (locale: "fr" | "en") => (
    <div className="grid gap-6">
      {keys.map((key) => {
        const id = `${locale}:${key}`;
        const current = value(key, locale);
        const long = current.length > 70;
        const vars = current.match(/\{\w+\}|<\w+>/g);
        return (
          <div key={id}>
            <label htmlFor={id} className="font-semibold">
              {key.slice(section.key.length + 1).replaceAll(".", " › ")}
            </label>
            {locale === "en" && <p className="mt-0.5 text-sm text-slate">FR : {value(key, "fr")}</p>}
            {vars && <p className="mt-0.5 text-sm text-slate">À conserver tel quel : {[...new Set(vars)].join(" ")}</p>}
            {long ? (
              <textarea id={id} name={id} defaultValue={current} rows={3} maxLength={5000} className={`${inputClass} resize-y`} />
            ) : (
              <input id={id} name={id} defaultValue={current} maxLength={5000} className={inputClass} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <PageTitle title="Textes des pages" />
      <Notice ok={ok} error={error} />
      <nav aria-label="Sections" className="mb-6 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.key}
            href={`/admin/textes?section=${s.key}`}
            aria-current={s.key === section.key ? "page" : undefined}
            className={`rounded-full border px-3 py-1 text-sm ${s.key === section.key ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-action"}`}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      <form action={saveTexts} className="rounded-md border border-line bg-white p-6">
        <input type="hidden" name="section" value={section.key} />
        <h2 className="mb-1 font-sans text-lg font-semibold">{section.label}</h2>
        <p className="mb-5 text-sm text-slate">Un texte anglais laissé vide affiche le texte français.</p>
        <LangTabs fr={fields("fr")} en={fields("en")} />
        <div className="mt-8">
          <SubmitButton>Enregistrer</SubmitButton>
        </div>
      </form>

      <form action={resetTexts} className="mt-6">
        <input type="hidden" name="section" value={section.key} />
        <ConfirmSubmit message="Rétablir tous les textes d’origine de cette section ?">Rétablir les textes d’origine</ConfirmSubmit>
      </form>
    </>
  );
}
