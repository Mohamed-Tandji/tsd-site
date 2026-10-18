import Link from "next/link";
import { Card, PageTitle } from "@/components/admin/fields";
import { formatDate } from "@/lib/admin";
import { db } from "@/lib/db";

export default async function AdminHome() {
  const [solutions, team, unread, messages] = await Promise.all([
    db.solution.count(),
    db.teamMember.count(),
    db.contactMessage.count({ where: { read: false } }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const tiles = [
    { href: "/admin/messages", label: "Messages non lus", value: unread },
    { href: "/admin/solutions", label: "Solutions", value: solutions },
    { href: "/admin/equipe", label: "Membres de l’équipe", value: team },
  ];

  return (
    <>
      <PageTitle title="Tableau de bord" />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="rounded-md border border-line bg-white p-5 transition-colors duration-150 hover:border-action">
            <div className="font-serif text-[2.2rem] leading-none font-bold">{t.value}</div>
            <div className="mt-2 text-slate">{t.label}</div>
          </Link>
        ))}
      </div>
      <Card title="Derniers messages">
        {messages.length === 0 ? (
          <p className="text-slate">Aucun message pour le moment.</p>
        ) : (
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}`} className="flex flex-wrap justify-between gap-2 py-3 hover:text-action">
                  <span className={m.read ? "" : "font-semibold"}>
                    {m.name} — {m.email}
                  </span>
                  <span className="text-sm text-slate">{formatDate(m.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
