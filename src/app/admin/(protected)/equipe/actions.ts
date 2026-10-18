"use server";

import { redirect } from "next/navigation";
import { back, bool, contentChanged, str } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteUpload, fileFrom, saveImage, UploadError } from "@/lib/uploads";

export async function saveMember(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const formPath = id ? `/admin/equipe/${id}` : "/admin/equipe/nouveau";

  const name = str(formData, "name").slice(0, 100);
  if (!name) back(formPath, { error: "Le nom est obligatoire." });

  const existing = id ? await db.teamMember.findUnique({ where: { id } }) : null;
  if (id && !existing) back("/admin/equipe", { error: "Membre introuvable." });

  let photoUrl = existing?.photoUrl ?? null;
  try {
    const file = fileFrom(formData, "photoFile");
    if (file) {
      photoUrl = await saveImage(file);
      await deleteUpload(existing?.photoUrl);
    } else if (formData.get("photoRemove") === "on") {
      await deleteUpload(existing?.photoUrl);
      photoUrl = null;
    }
  } catch (err) {
    if (err instanceof UploadError) back(formPath, { error: err.message });
    throw err;
  }

  const data = {
    name,
    photoUrl,
    position: Number(formData.get("position")) || 0,
    published: bool(formData, "published"),
    roleFr: str(formData, "fr.role").slice(0, 120),
    roleEn: str(formData, "en.role").slice(0, 120),
    bioFr: str(formData, "fr.bio").slice(0, 2000),
    bioEn: str(formData, "en.bio").slice(0, 2000),
  };

  const saved = id ? await db.teamMember.update({ where: { id }, data }) : await db.teamMember.create({ data });
  contentChanged();
  back(`/admin/equipe/${saved.id}`, { ok: "Membre enregistré. Il est visible sur le site." });
}

export async function deleteMember(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const member = await db.teamMember.findUnique({ where: { id } });
  if (member) {
    await db.teamMember.delete({ where: { id } });
    await deleteUpload(member.photoUrl);
    contentChanged();
  }
  redirect("/admin/equipe?ok=" + encodeURIComponent("Membre supprimé."));
}
