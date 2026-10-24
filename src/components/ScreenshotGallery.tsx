"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Shot = { url: string; caption: string };
type Labels = { enlarge: string; close: string; previous: string; next: string; alt: string };

// Galerie de captures d'écran : vignettes, puis agrandissement dans une fenêtre (Échap, flèches, clic hors de l'image)
export default function ScreenshotGallery({ shots, labels }: { shots: Shot[]; labels: Labels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const current = shots[index];
  const altFor = (shot: Shot) => shot.caption || labels.alt;

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const move = (step: number) => setIndex((i) => (i + step + shots.length) % shots.length);

  const navButton = "grid size-11 cursor-pointer place-items-center rounded border border-line bg-white text-navy transition-colors duration-150 hover:border-action hover:text-action";

  return (
    <>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-10 nav:grid-cols-2">
        {shots.map((shot, i) => (
          <li key={shot.url}>
            <figure>
              <button
                type="button"
                onClick={() => open(i)}
                className="group relative block aspect-[1600/826] w-full cursor-zoom-in overflow-hidden rounded-md border border-line bg-paper transition-colors duration-150 hover:border-action"
              >
                <Image src={shot.url} alt="" fill sizes="(max-width: 900px) 100vw, 540px" className="object-cover object-top-left" />
                <span className="sr-only">{labels.enlarge}</span>
              </button>
              {shot.caption && <figcaption className="mt-3 text-[15px] leading-normal text-slate">{shot.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={current ? altFor(current) : labels.alt}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        className="m-auto w-[min(1200px,94vw)] max-w-none rounded-md bg-white p-0 text-navy backdrop:bg-navy/80"
      >
        {current && (
          <div className="grid gap-4 p-4 xs:p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="pt-2.5 text-[15px] leading-normal">
                <span className="mr-3 font-semibold text-action">
                  {index + 1} / {shots.length}
                </span>
                {current.caption}
              </p>
              <button type="button" onClick={() => dialog.current?.close()} className={`${navButton} shrink-0`} aria-label={labels.close}>
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="relative aspect-[1600/826] w-full overflow-hidden rounded border border-line bg-paper">
              <Image src={current.url} alt={altFor(current)} fill sizes="94vw" className="object-contain" />
            </div>
            {shots.length > 1 && (
              <div className="flex justify-center gap-3">
                <button type="button" onClick={() => move(-1)} className={navButton} aria-label={labels.previous}>
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button type="button" onClick={() => move(1)} className={navButton} aria-label={labels.next}>
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
