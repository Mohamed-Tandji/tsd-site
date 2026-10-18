import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import MemberForm from "@/components/admin/MemberForm";

export const metadata: Metadata = { title: "Nouveau membre" };

export default async function NewMember({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <Link href="/admin/equipe" className="text-sm font-medium text-action hover:underline">
        ← Équipe
      </Link>
      <PageTitle title="Nouveau membre" />
      <Notice error={error} />
      <MemberForm />
    </>
  );
}
