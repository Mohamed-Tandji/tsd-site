import type { Metadata } from "next";
import reunion from "@/assets/apropos-reunion.jpg";
import bandeau from "@/assets/accueil-bandeau.jpg";
import { Card, Field, ImageField, Notice, PageTitle } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/ui";
import { getSiteSettings } from "@/lib/content";
import { LEGAL_FIELDS } from "@/lib/defaults";
import { saveContact, saveImages, saveLegal } from "./actions";

export const metadata: Metadata = { title: "Coordonnées et images" };

export default async function ContactSettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const s = await getSiteSettings();

  const images = [
    { key: "image.logo", label: "Logo (en-tête)", hint: "Fond transparent conseillé (PNG).", current: s.images.logo },
    { key: "image.logoWhite", label: "Logo blanc (pied de page)", hint: "Version claire pour le fond marine (PNG transparent).", current: s.images.logoWhite },
    { key: "image.hero", label: "Photo du bandeau d’accueil", hint: "Photo libre de droits, format paysage ou carré.", current: s.images.hero || bandeau.src },
    { key: "image.about", label: "Photo de la page À propos", hint: "Photo libre de droits ; elle ne doit pas être présentée comme l’équipe.", current: s.images.about || reunion.src },
  ];

  return (
    <>
      <PageTitle title="Coordonnées et images" />
      <Notice ok={ok} error={error} />

      <div className="grid gap-8">
        <Card title="Coordonnées et réseaux">
          <form action={saveContact} className="grid gap-5">
            <Field name="email" label="Courriel" type="email" required defaultValue={s.email} maxLength={200} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="phone1" label="Téléphone 1" defaultValue={s.phones[0]?.label} maxLength={40} />
              <Field name="phone2" label="Téléphone 2" defaultValue={s.phones[1]?.label} maxLength={40} />
            </div>
            <p className="text-sm text-slate">Réseaux : laissez le lien vide tant que le compte n’existe pas (le nom s’affiche sans lien).</p>
            {s.socials.map((n) => (
              <div key={n.key} className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
                <Field name={`social.${n.key}.handle`} label={`${n.label} – nom affiché`} defaultValue={n.handle} maxLength={80} />
                <Field name={`social.${n.key}.url`} label={`${n.label} – lien`} type="url" defaultValue={n.url} maxLength={300} hint="https://…" />
              </div>
            ))}
            <div>
              <SubmitButton>Enregistrer les coordonnées</SubmitButton>
            </div>
          </form>
        </Card>

        <Card title="Informations légales (mentions légales et confidentialité)">
          <form action={saveLegal} className="grid gap-5">
            <p className="text-sm text-slate">Un champ vide s’affiche « [À compléter] » sur le site.</p>
            {LEGAL_FIELDS.map((f) => (
              <Field key={f.key} name={f.key} label={f.label} defaultValue={s.legal[f.key.slice("legal.".length)]} maxLength={500} />
            ))}
            <div>
              <SubmitButton>Enregistrer les informations légales</SubmitButton>
            </div>
          </form>
        </Card>

        <Card title="Logos et photos">
          <form action={saveImages} className="grid gap-5">
            {images.map((img) => (
              <ImageField
                key={img.key}
                name={img.key}
                label={img.label}
                hint={img.hint}
                current={img.current}
                removeLabel="Revenir à l’image d’origine"
                canRemove={img.current.startsWith("/media/")}
              />
            ))}
            <div>
              <SubmitButton pendingLabel="Envoi…">Enregistrer les images</SubmitButton>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
