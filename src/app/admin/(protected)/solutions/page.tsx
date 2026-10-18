import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Solutions" };

export default async function SolutionsAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const solutions = await db.solution.findMany({ orderBy: [{ position: "asc" }, { id: "asc" }] });

  return (
    <>
      <PageTitle title="Solutions">
        <Link href="/admin/solutions/nouvelle" className="rounded border border-action bg-action px-4 py-2 font-semibold text-white hover:bg-action-hover">
          Ajouter une solution
        </Link>
      </PageTitle>
      <Notice ok={ok} error={error} />
      <ul className="divide-y divide-line rounded-md border border-line bg-white">
        {solutions.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <Link href={`/admin/solutions/${s.id}`} className="font-semibold text-action hover:underline">
                {s.name}
              </Link>
              <div className="text-sm text-slate">
                {s.status === "AVAILABLE" ? "Disponible" : "Bientôt disponible"} · ordre {s.position}
                {!s.published && " · masquée"}
              </div>
            </div>
            <Link href={`/admin/solutions/${s.id}`} className="text-sm font-medium text-action hover:underline">
              Modifier
            </Link>
          </li>
        ))}
        {solutions.length === 0 && <li className="px-5 py-4 text-slate">Aucune solution.</li>}
      </ul>
    </>
  );
}
