import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Notice, PageTitle } from "@/components/admin/fields";
import SolutionForm from "@/components/admin/SolutionForm";
import { ConfirmSubmit } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteSolution } from "../actions";

export const metadata: Metadata = { title: "Modifier une solution" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; error?: string }> };

export default async function EditSolution({ params, searchParams }: Props) {
  const [{ id }, { ok, error }] = await Promise.all([params, searchParams]);
  const solution = await db.solution.findUnique({ where: { id: Number(id) || 0 } });
  if (!solution) notFound();

  return (
    <>
      <Link href="/admin/solutions" className="text-sm font-medium text-action hover:underline">
        ← Solutions
      </Link>
      <PageTitle title={solution.name}>
        {solution.status === "AVAILABLE" && solution.published && (
          <a href={`/fr/solutions/${solution.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-action hover:underline">
            Voir la fiche ↗
          </a>
        )}
      </PageTitle>
      <Notice ok={ok} error={error} />
      <SolutionForm key={`${solution.id}-${ok ?? ""}`} solution={solution} />
      <form action={deleteSolution} className="mt-10 border-t border-line pt-6">
        <input type="hidden" name="id" value={solution.id} />
        <ConfirmSubmit message={`Supprimer définitivement « ${solution.name} » ?`}>Supprimer la solution</ConfirmSubmit>
      </form>
    </>
  );
}
