import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import { formatDate } from "@/lib/admin";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Messages reçus" };

const PER_PAGE = 30;

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ page?: string; ok?: string }> }) {
  const { page: pageParam, ok } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [messages, total] = await Promise.all([
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    db.contactMessage.count(),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <PageTitle title="Messages reçus" />
      <Notice ok={ok} />
      <ul className="divide-y divide-line rounded-md border border-line bg-white">
        {messages.map((m) => (
          <li key={m.id}>
            <Link href={`/admin/messages/${m.id}`} className="block px-5 py-4 hover:bg-paper">
              <div className="flex flex-wrap justify-between gap-2">
                <span className={m.read ? "" : "font-semibold"}>
                  {!m.read && <span className="mr-2 inline-block size-2 rounded-full bg-action align-middle" aria-hidden="true" />}
                  {m.name} — {m.email}
                  {!m.read && <span className="sr-only"> (non lu)</span>}
                </span>
                <span className="text-sm text-slate">{formatDate(m.createdAt)}</span>
              </div>
              <p className="mt-1 truncate text-sm text-slate">{m.body}</p>
            </Link>
          </li>
        ))}
        {messages.length === 0 && <li className="px-5 py-4 text-slate">Aucun message pour le moment.</li>}
      </ul>
      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center gap-4 text-sm">
          {page > 1 && <Link href={`/admin/messages?page=${page - 1}`} className="font-medium text-action hover:underline">← Plus récents</Link>}
          <span className="text-slate">
            Page {page} sur {pages}
          </span>
          {page < pages && <Link href={`/admin/messages?page=${page + 1}`} className="font-medium text-action hover:underline">Plus anciens →</Link>}
        </nav>
      )}
    </>
  );
}
