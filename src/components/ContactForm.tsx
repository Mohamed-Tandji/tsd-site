"use client";

import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { type ContactState, sendContact } from "@/app/[locale]/contact/actions";
import { buttonClass } from "@/components/ui";
import { Link } from "@/i18n/navigation";

const inputClass =
  "mt-2 block w-full rounded border border-line bg-white px-4 py-3 text-base text-navy transition-colors duration-150 placeholder:text-slate/70 hover:border-slate focus:border-action focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-0 focus-visible:outline-brand aria-[invalid=true]:border-[#b42318]";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: "idle" });
  const [startedAt, setStartedAt] = useState(0);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Heure d'affichage du formulaire (antispam : envoi trop rapide = robot)
  useEffect(() => setStartedAt(Date.now()), []);

  // Après l'envoi, le focus va sur la confirmation ou sur le résumé des erreurs
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-md border border-line border-t-[3px] border-t-mint bg-paper p-8 focus:outline-none">
        <h2 className="text-[1.65rem]">{t("successTitle")}</h2>
        <p className="mt-3 text-slate">{t("successText")}</p>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const fieldError = (field: "name" | "email" | "message") =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-[#b42318]">
        {t(`errors.${errors[field]}`)}
      </p>
    ) : null;

  return (
    <form action={action} className="relative grid gap-6">
      {state.status === "error" && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="rounded border border-[#f3c4c0] bg-[#fdf1f0] px-4 py-3 text-[15px] text-[#8a1c13] focus:outline-none">
          {state.formError ? t(`errors.${state.formError}`) : t("errors.fix")}
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Champ piège : invisible pour les visiteurs, rempli par les robots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div>
        <label htmlFor="name" className="text-[15px] font-semibold">
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
          defaultValue={state.values?.name}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={inputClass}
        />
        {fieldError("name")}
      </div>

      <div>
        <label htmlFor="email" className="text-[15px] font-semibold">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          defaultValue={state.values?.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClass}
        />
        {fieldError("email")}
      </div>

      <div>
        <label htmlFor="message" className="text-[15px] font-semibold">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={7}
          defaultValue={state.values?.message}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputClass} resize-y`}
        />
        {fieldError("message")}
      </div>

      <p className="text-sm text-slate">
        {t.rich("privacy", {
          link: (chunks) => (
            <Link href="/confidentialite" className="font-medium text-action underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </p>

      <div>
        <button type="submit" disabled={pending} className={`${buttonClass("primary")} cursor-pointer disabled:cursor-wait disabled:opacity-70`}>
          {pending ? t("sending") : t("submit")}
        </button>
      </div>
    </form>
  );
}
