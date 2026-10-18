import PageHeader from "@/components/PageHeader";

// Mise en page commune des mentions légales et de la politique de confidentialité
export type LegalSection = { title: string; fields?: [string, string][]; paragraphs?: string[] };

export function Value({ value, missing }: { value: string; missing: string }) {
  return value ? <>{value}</> : <span className="rounded bg-[#fff4e5] px-1.5 text-[#8a4b00]">{missing}</span>;
}

export default function LegalDocument({ eyebrow, title, intro, sections, missing }: { eyebrow: string; title: string; intro?: string; sections: LegalSection[]; missing: string }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <section className="py-[72px] nav:py-24">
        <div className="mx-auto grid max-w-[1120px] gap-12 px-6">
          {sections.map((s) => (
            <div key={s.title} className="max-w-[760px] border-t border-line pt-8">
              <h2 className="text-[1.65rem]">{s.title}</h2>
              {s.fields && (
                <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-[220px_1fr]">
                  {s.fields.map(([label, value]) => (
                    <div key={label} className="contents">
                      <dt className="font-semibold">{label}</dt>
                      <dd className="text-slate">
                        <Value value={value} missing={missing} />
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {s.paragraphs?.map((p) => (
                <p key={p} className="mt-4 text-slate">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
