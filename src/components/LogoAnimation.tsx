"use client";

import { useEffect, useRef, useState } from "react";

type Labels = { title: string; play: string; pause: string; replay: string };

// Animation du logo : lue une fois quand elle devient visible, sans son ni boucle.
// Animations réduites demandées : image finale seulement, lecture au clic.
export default function LogoAnimation({ labels }: { labels: Labels }) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");

  useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (state === "playing") return el.pause();
    if (state === "ended") el.currentTime = 0;
    el.play().catch(() => {});
  };

  return (
    <figure className="grid gap-3">
      <div className="overflow-hidden rounded-md border border-line bg-navy">
        <video
          ref={video}
          className="block aspect-video w-full"
          poster="/videos/tsd-logo-animation.webp"
          muted
          playsInline
          preload="none"
          aria-label={labels.title}
          onPlay={() => setState("playing")}
          onPause={(e) => !e.currentTarget.ended && setState("paused")}
          onEnded={() => setState("ended")}
        >
          <source src="/videos/tsd-logo-animation.webm" type="video/webm" />
          <source src="/videos/tsd-logo-animation.mp4" type="video/mp4" />
        </video>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="cursor-pointer justify-self-end rounded border border-line px-3.5 py-2 text-sm font-semibold text-navy transition-colors duration-150 hover:border-action hover:text-action"
      >
        {state === "playing" ? labels.pause : state === "ended" ? labels.replay : labels.play}
      </button>
    </figure>
  );
}
