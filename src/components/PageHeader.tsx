// Bandeau de titre des pages intérieures (même grammaire que le bandeau de l'accueil)
export default function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1120px] px-6 py-[72px] nav:py-24">
        <p className="flex items-center gap-3.5 text-[13px] leading-none font-semibold tracking-[0.12em] text-action uppercase before:h-[3px] before:w-10 before:bg-mint before:content-['']">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-[760px] text-[clamp(2.4rem,4.2vw,3.6rem)] tracking-[-0.01em]">{title}</h1>
        {intro && <p className="mt-6 max-w-[620px] text-[1.18rem] text-slate">{intro}</p>}
      </div>
    </section>
  );
}
