"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function markUnread(formData: FormData) {
  await requireAdmin();
  await db.contactMessage.updateMany({ where: { id: Number(formData.get("id")) }, data: { read: false } });
  redirect("/admin/messages?ok=" + encodeURIComponent("Message marqué comme non lu."));
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await db.contactMessage.deleteMany({ where: { id: Number(formData.get("id")) } });
  redirect("/admin/messages?ok=" + encodeURIComponent("Message supprimé."));
}
