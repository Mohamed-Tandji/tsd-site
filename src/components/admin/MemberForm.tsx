import type { TeamMember } from "@prisma/client";
import { saveMember } from "@/app/admin/(protected)/equipe/actions";
import { Card, Checkbox, Field, ImageField, TextArea } from "@/components/admin/fields";
import { LangTabs, SubmitButton } from "@/components/admin/ui";

export default function MemberForm({ member }: { member?: TeamMember }) {
  const panel = (locale: "fr" | "en") => {
    const L = locale === "fr" ? "Fr" : "En";
    return (
      <div className="grid gap-5">
        <Field name={`${locale}.role`} label="Fonction" hint="Ex. : Cofondateur" defaultValue={member?.[`role${L}`]} maxLength={120} />
        <TextArea name={`${locale}.bio`} label="Présentation (facultatif)" rows={4} defaultValue={member?.[`bio${L}`]} maxLength={2000} />
      </div>
    );
  };

  return (
    <form action={saveMember} className="grid gap-8">
      {member && <input type="hidden" name="id" value={member.id} />}
      <Card title="Informations">
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Field name="name" label="Nom complet" required defaultValue={member?.name} maxLength={100} />
            <Field name="position" label="Ordre d’affichage" type="number" defaultValue={member?.position ?? 0} />
          </div>
          <ImageField name="photo" label="Portrait" current={member?.photoUrl} hint="Portrait professionnel, format vertical conseillé." />
          <Checkbox name="published" label="Afficher sur le site" defaultChecked={member?.published ?? true} />
        </div>
      </Card>
      <Card title="Textes">
        <LangTabs fr={panel("fr")} en={panel("en")} />
        <p className="mt-4 text-sm text-slate">Un champ anglais laissé vide affiche le texte français.</p>
      </Card>
      <div>
        <SubmitButton>Enregistrer</SubmitButton>
      </div>
    </form>
  );
}
