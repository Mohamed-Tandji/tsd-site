import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, PageTitle } from "@/components/admin/fields";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/ui";
import { formatDate } from "@/lib/admin";
import { db } from "@/lib/db";
import { deleteMessage, markUnread } from "../actions";

export const metadata: Metadata = { title: "Message" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = await db.contactMessage.findUnique({ where: { id: Number(id) || 0 } });
  if (!message) notFound();
  // Ouvrir un message le marque comme lu
  if (!message.read) await db.contactMessage.update({ where: { id: message.id }, data: { read: true } });

  return (
    <>
      <Link href="/admin/messages" className="text-sm font-medium text-action hover:underline">
        ← Messages reçus
      </Link>
      <PageTitle title={`Message de ${message.name}`} />
      <Card>
        <dl className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <dt className="font-semibold">Courriel</dt>
          <dd>
            <a href={`mailto:${message.email}`} className="text-action hover:underline">
              {message.email}
            </a>
          </dd>
          <dt className="font-semibold">Reçu le</dt>
          <dd>{formatDate(message.createdAt)}</dd>
          <dt className="font-semibold">Langue du site</dt>
          <dd>{message.locale === "en" ? "Anglais" : "Français"}</dd>
          <dt className="font-semibold">Notification</dt>
          <dd>{message.notified ? "Envoyée par courriel" : "Non envoyée (enregistré seulement)"}</dd>
        </dl>
        <div className="mt-6 border-t border-line pt-6 whitespace-pre-wrap">{message.body}</div>
      </Card>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`mailto:${message.email}?subject=${encodeURIComponent("Re : votre message à TSD Systems")}`} className="rounded border border-action bg-action px-4 py-2 font-semibold text-white hover:bg-action-hover">
          Répondre
        </a>
        <form action={markUnread}>
          <input type="hidden" name="id" value={message.id} />
          <SubmitButton variant="secondary" pendingLabel="…">
            Marquer comme non lu
          </SubmitButton>
        </form>
        <form action={deleteMessage}>
          <input type="hidden" name="id" value={message.id} />
          <ConfirmSubmit message="Supprimer définitivement ce message ?">Supprimer</ConfirmSubmit>
        </form>
      </div>
    </>
  );
}
