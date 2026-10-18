import type { Metadata } from "next";
import { Card, Field, Notice, PageTitle } from "@/components/admin/fields";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/ui";
import { formatDate } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { PASSWORD_MIN_LENGTH } from "@/lib/security";
import { addAdmin, changeOwnPassword, deleteAdmin, resetPassword } from "./actions";

export const metadata: Metadata = { title: "Comptes" };

const pwHint = `${PASSWORD_MIN_LENGTH} caractères minimum. Une phrase de passe est idéale.`;

export default async function AccountsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const me = await requireAdmin();
  const admins = await db.adminUser.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, name: true, email: true, createdAt: true } });

  return (
    <>
      <PageTitle title="Comptes administrateurs" />
      <Notice ok={ok} error={error} />
      <div className="grid gap-8">
        <Card title="Comptes">
          <ul className="divide-y divide-line">
            {admins.map((a) => (
              <li key={a.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold">{a.name}</span> — {a.email}
                    {a.id === me.id && <span className="ml-2 rounded-full bg-paper px-2 text-sm">vous</span>}
                  </div>
                  <span className="text-sm text-slate">créé le {formatDate(a.createdAt)}</span>
                </div>
                {a.id !== me.id && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-action">Changer le mot de passe ou supprimer</summary>
                    <form action={resetPassword} className="mt-4 grid gap-4 sm:grid-cols-2">
                      <input type="hidden" name="id" value={a.id} />
                      <Field name="password" id={`password-${a.id}`} label="Nouveau mot de passe" type="password" required autoComplete="new-password" hint={pwHint} maxLength={200} />
                      <Field name="confirm" id={`confirm-${a.id}`} label="Confirmer" type="password" required autoComplete="new-password" maxLength={200} />
                      <div>
                        <SubmitButton variant="secondary">Changer le mot de passe</SubmitButton>
                      </div>
                    </form>
                    <form action={deleteAdmin} className="mt-4">
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmSubmit message={`Supprimer le compte de ${a.email} ?`}>Supprimer ce compte</ConfirmSubmit>
                    </form>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Ajouter un compte">
          <form action={addAdmin} className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Nom" required maxLength={100} />
            <Field name="email" label="Courriel" type="email" required maxLength={200} autoComplete="off" />
            <Field name="password" label="Mot de passe" type="password" required autoComplete="new-password" hint={pwHint} maxLength={200} />
            <Field name="confirm" label="Confirmer le mot de passe" type="password" required autoComplete="new-password" maxLength={200} />
            <div>
              <SubmitButton>Créer le compte</SubmitButton>
            </div>
          </form>
        </Card>

        <Card title="Changer mon mot de passe">
          <form action={changeOwnPassword} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field name="current" label="Mot de passe actuel" type="password" required autoComplete="current-password" maxLength={200} />
            </div>
            <Field name="password" label="Nouveau mot de passe" type="password" required autoComplete="new-password" hint={pwHint} maxLength={200} />
            <Field name="confirm" label="Confirmer" type="password" required autoComplete="new-password" maxLength={200} />
            <div>
              <SubmitButton>Changer mon mot de passe</SubmitButton>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
