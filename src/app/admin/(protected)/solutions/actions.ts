"use server";

import type { SolutionStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { back, bool, contentChanged, isHttpUrl, slugify, str } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteUpload, fileFrom, saveImage, UploadError } from "@/lib/uploads";

const FEATURE_ROWS = 4;

function features(formData: FormData, locale: "fr" | "en") {
  return Array.from({ length: FEATURE_ROWS }, (_, i) => ({
    title: str(formData, `${locale}.feature${i}.title`).slice(0, 120),
    text: str(formData, `${locale}.feature${i}.text`).slice(0, 600),
  })).filter((f) => f.title !== "");
}

// Image : nouveau fichier, retrait, ou inchangée
async function imageValue(formData: FormData, name: string, previous: string | null) {
  const file = fileFrom(formData, `${name}File`);
  if (file) {
    const url = await saveImage(file);
    await deleteUpload(previous);
    return url;
  }
  if (formData.get(`${name}Remove`) === "on") {
    await deleteUpload(previous);
    return null;
  }
  return previous;
}

export async function saveSolution(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id")) || null;
  const formPath = id ? `/admin/solutions/${id}` : "/admin/solutions/nouvelle";

  const name = str(formData, "name").slice(0, 80);
  const slug = slugify(str(formData, "slug") || name);
  const status: SolutionStatus = formData.get("status") === "AVAILABLE" ? "AVAILABLE" : "COMING_SOON";
  const appUrl = str(formData, "appUrl");
  if (!name) back(formPath, { error: "Le nom est obligatoire." });
  if (!slug) back(formPath, { error: "Adresse de la fiche invalide." });
  if (appUrl && !isHttpUrl(appUrl)) back(formPath, { error: "Le lien de l’application doit commencer par https://" });
  const taken = await db.solution.findFirst({ where: { slug, NOT: id ? { id } : undefined } });
  if (taken) back(formPath, { error: `L’adresse « ${slug} » est déjà utilisée par une autre solution.` });

  const existing = id ? await db.solution.findUnique({ where: { id } }) : null;
  if (id && !existing) back("/admin/solutions", { error: "Solution introuvable." });

  let logoUrl: string | null, imageUrl: string | null;
  try {
    logoUrl = await imageValue(formData, "logo", existing?.logoUrl ?? null);
    imageUrl = await imageValue(formData, "image", existing?.imageUrl ?? null);
  } catch (err) {
    if (err instanceof UploadError) back(formPath, { error: err.message });
    throw err;
  }

  const data = {
    name,
    slug,
    status,
    appUrl: appUrl || null,
    position: Number(formData.get("position")) || 0,
    published: bool(formData, "published"),
    logoUrl,
    imageUrl,
    taglineFr: str(formData, "fr.tagline").slice(0, 120),
    taglineEn: str(formData, "en.tagline").slice(0, 120),
    summaryFr: str(formData, "fr.summary").slice(0, 400),
    summaryEn: str(formData, "en.summary").slice(0, 400),
    descriptionFr: str(formData, "fr.description").slice(0, 3000),
    descriptionEn: str(formData, "en.description").slice(0, 3000),
    featuresFr: features(formData, "fr"),
    featuresEn: features(formData, "en"),
  };

  const saved = id ? await db.solution.update({ where: { id }, data }) : await db.solution.create({ data });
  contentChanged();
  back(`/admin/solutions/${saved.id}`, { ok: "Solution enregistrée. Elle est visible sur le site." });
}

export async function deleteSolution(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const solution = await db.solution.findUnique({ where: { id } });
  if (solution) {
    await db.solution.delete({ where: { id } });
    await deleteUpload(solution.logoUrl);
    await deleteUpload(solution.imageUrl);
    contentChanged();
  }
  redirect("/admin/solutions?ok=" + encodeURIComponent("Solution supprimée."));
}
