import type { Solution } from "@prisma/client";
import { saveSolution } from "@/app/admin/(protected)/solutions/actions";
import { Card, Checkbox, Field, ImageField, TextArea } from "@/components/admin/fields";
import { inputClass } from "@/components/admin/styles";
import { LangTabs, SubmitButton } from "@/components/admin/ui";

const FEATURE_ROWS = 4;

type Feature = { title: string; text: string };
const asFeatures = (value: unknown): Feature[] => (Array.isArray(value) ? (value as Feature[]) : []);

export default function SolutionForm({ solution }: { solution?: Solution }) {
  const panel = (locale: "fr" | "en") => {
    const L = locale === "fr" ? "Fr" : "En";
    const feats = asFeatures(solution?.[`features${L}`]);
    return (
      <div className="grid gap-5">
        <Field name={`${locale}.tagline`} label="Catégorie" hint="Ex. : Gestion scolaire" defaultValue={solution?.[`tagline${L}`]} maxLength={120} />
        <TextArea name={`${locale}.summary`} label="Résumé (carte)" rows={3} defaultValue={solution?.[`summary${L}`]} maxLength={400} />
        <TextArea name={`${locale}.description`} label="Description (fiche)" hint="3 à 5 lignes." rows={5} defaultValue={solution?.[`description${L}`]} maxLength={3000} />
        <fieldset className="grid gap-4">
          <legend className="mb-2 font-semibold">Points clés (fiche) – laisser le titre vide pour ne pas afficher la ligne</legend>
          {Array.from({ length: FEATURE_ROWS }, (_, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr]">
              <label className="text-sm">
                Titre {i + 1}
                <input name={`${locale}.feature${i}.title`} defaultValue={feats[i]?.title ?? ""} maxLength={120} className={inputClass} />
              </label>
              <label className="text-sm">
                Texte {i + 1}
                <input name={`${locale}.feature${i}.text`} defaultValue={feats[i]?.text ?? ""} maxLength={600} className={inputClass} />
              </label>
            </div>
          ))}
        </fieldset>
      </div>
    );
  };

  return (
    <form action={saveSolution} className="grid gap-8">
      {solution && <input type="hidden" name="id" value={solution.id} />}
      <Card title="Informations générales">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Nom" required defaultValue={solution?.name} maxLength={80} />
            <Field name="slug" label="Adresse de la fiche" hint="Ex. : kalanso-kunafoni (rempli à partir du nom si vide)" defaultValue={solution?.slug} maxLength={60} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="font-semibold">
                Statut
              </label>
              <select id="status" name="status" defaultValue={solution?.status ?? "COMING_SOON"} className={inputClass}>
                <option value="AVAILABLE">Disponible (bouton « Découvrir » et fiche)</option>
                <option value="COMING_SOON">Bientôt disponible (sans lien)</option>
              </select>
            </div>
            <Field name="position" label="Ordre d’affichage" type="number" defaultValue={solution?.position ?? 0} />
          </div>
          <Field name="appUrl" label="Lien vers l’application (facultatif)" type="url" hint="https://…" defaultValue={solution?.appUrl} />
          <Checkbox name="published" label="Afficher sur le site" defaultChecked={solution?.published ?? true} />
        </div>
      </Card>

      <Card title="Logo et visuel">
        <div className="grid gap-5">
          <ImageField name="logo" label="Logo" current={solution?.logoUrl} hint="PNG à fond transparent conseillé." />
          <ImageField name="image" label="Visuel de la fiche (capture d’écran)" current={solution?.imageUrl} hint="Remplace le logo dans l’en-tête de la fiche." />
        </div>
      </Card>

      <Card title="Textes">
        <LangTabs fr={panel("fr")} en={panel("en")} />
        <p className="mt-4 text-sm text-slate">Un champ anglais laissé vide affiche le texte français.</p>
      </Card>

      <div>
        <SubmitButton>Enregistrer la solution</SubmitButton>
      </div>
    </form>
  );
}
