import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Notice, PageTitle } from "@/components/admin/fields";
import MemberForm from "@/components/admin/MemberForm";
import { ConfirmSubmit } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteMember } from "../actions";

export const metadata: Metadata = { title: "Modifier un membre" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> };

export default async function EditMember({ params, searchParams }: Props) {
  const [{ id }, { ok, error }] = await Promise.all([params, searchParams]);
  const member = await db.teamMember.findUnique({ where: { id: Number(id) || 0 } });
  if (!member) notFound();

  return (
    <>
      <Link href="/admin/equipe" className="text-sm font-medium text-action hover:underline">
        ← Équipe
      </Link>
      <PageTitle title={member.name} />
      <Notice ok={ok} error={error} />
      <MemberForm key={`${member.id}-${ok ?? ""}`} member={member} />
      <form action={deleteMember} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={member.id} />
        <ConfirmSubmit message={`Retirer définitivement « ${member.name} » de l’équipe ?`}>Supprimer ce membre</ConfirmSubmit>
      </form>
    </>
  );
}
