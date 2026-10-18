"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

// Composants de l'administration (formulaires simples, sans dépendance)

export function SubmitButton({ children, pendingLabel = "Enregistrement…", variant = "primary" }: { children: React.ReactNode; pendingLabel?: string; variant?: "primary" | "danger" | "secondary" }) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "border-action bg-action text-white hover:bg-action-hover",
    danger: "border-[#b42318] bg-white text-[#b42318] hover:bg-[#fdf1f0]",
    secondary: "border-line bg-white text-navy hover:border-slate",
  }[variant];
  return (
    <button type="submit" disabled={pending} className={`cursor-pointer rounded border px-4 py-2 font-semibold transition-colors duration-150 disabled:cursor-wait disabled:opacity-60 ${styles}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}

// Bouton qui demande confirmation avant d'envoyer le formulaire
export function ConfirmSubmit({ children, message }: { children: React.ReactNode; message: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="cursor-pointer rounded border border-[#b42318] bg-white px-4 py-2 font-semibold text-[#b42318] transition-colors duration-150 hover:bg-[#fdf1f0] disabled:opacity-60"
    >
      {children}
    </button>
  );
}

// Onglets FR / EN : les deux panneaux restent dans le formulaire, un seul est visible
export function LangTabs({ fr, en }: { fr: React.ReactNode; en: React.ReactNode }) {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const tab = (value: "fr" | "en", label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={lang === value}
      aria-controls={`panel-${value}`}
      onClick={() => setLang(value)}
      className={`-mb-px cursor-pointer border-b-[3px] px-4 py-2 font-semibold ${lang === value ? "border-mint text-navy" : "border-transparent text-slate hover:text-action"}`}
    >
      {label}
    </button>
  );
  return (
    <div>
      <div role="tablist" aria-label="Langue du contenu" className="flex gap-1 border-b border-line">
        {tab("fr", "Français")}
        {tab("en", "English")}
      </div>
      <div role="tabpanel" id="panel-fr" aria-labelledby="tab-fr" hidden={lang !== "fr"} className="pt-5">
        {fr}
      </div>
      <div role="tabpanel" id="panel-en" aria-labelledby="tab-en" hidden={lang !== "en"} className="pt-5">
        {en}
      </div>
    </div>
  );
}
