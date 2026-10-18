import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Équipe" };

export default async function TeamAdmin({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const { ok, error } = await searchParams;
  const members = await db.teamMember.findMany({ orderBy: [{ position: "asc" }, { id: "asc" }] });

  return (
    <>
      <PageTitle title="Équipe">
        <Link href="/admin/equipe/nouveau" className="rounded border border-action bg-action px-4 py-2 font-semibold text-white hover:bg-action-hover">
          Ajouter un membre
        </Link>
      </PageTitle>
      <Notice ok={ok} error={error} />
      <ul className="divide-y divide-line rounded-md border border-line bg-white">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-4 px-5 py-4">
            {m.photoUrl ? (
              <img src={m.photoUrl} alt="" className="size-12 rounded object-cover object-top" />
            ) : (
              <span className="size-12 rounded bg-paper" />
            )}
            <div className="flex-1">
              <Link href={`/admin/equipe/${m.id}`} className="font-semibold text-action hover:underline">
                {m.name}
              </Link>
              <div className="text-sm text-slate">
                {m.roleFr || "—"} · ordre {m.position}
                {!m.published && " · masqué"}
              </div>
            </div>
          </li>
        ))}
        {members.length === 0 && <li className="px-5 py-4 text-slate">Aucun membre.</li>}
      </ul>
    </>
  );
}
