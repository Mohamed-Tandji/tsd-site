"use server";

import { back, contentChanged, isHttpUrl, str } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { DEFAULT_SETTINGS, LEGAL_FIELDS, SOCIALS } from "@/lib/defaults";
import { deleteUpload, fileFrom, saveImage, UploadError } from "@/lib/uploads";

const PATH = "/admin/coordonnees";
const IMAGES = ["image.logo", "image.logoWhite", "image.hero", "image.about"] as const;

async function setValue(key: string, value: string) {
  await db.setting.upsert({ where: { key }, update: { valueFr: value, valueEn: value }, create: { key, valueFr: value, valueEn: value } });
}

async function getValue(key: string) {
  return (await db.setting.findUnique({ where: { key } }))?.valueFr ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function saveContact(formData: FormData) {
  await requireAdmin();
  const email = str(formData, "email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back(PATH, { error: "Adresse courriel invalide." });

  for (const { key } of SOCIALS) {
    const url = str(formData, `social.${key}.url`);
    if (url && !isHttpUrl(url)) back(PATH, { error: `Lien ${key} invalide : il doit commencer par https://` });
  }

  await setValue("contact.email", email);
  await setValue("contact.phone1", str(formData, "phone1").slice(0, 40));
  await setValue("contact.phone2", str(formData, "phone2").slice(0, 40));
  for (const { key } of SOCIALS) {
    await setValue(`social.${key}.handle`, str(formData, `social.${key}.handle`).slice(0, 80));
    await setValue(`social.${key}.url`, str(formData, `social.${key}.url`).slice(0, 300));
  }

  contentChanged();
  back(PATH, { ok: "Coordonnées enregistrées." });
}

export async function saveLegal(formData: FormData) {
  await requireAdmin();
  for (const { key } of LEGAL_FIELDS) await setValue(key, str(formData, key).slice(0, 500));
  contentChanged();
  back(PATH, { ok: "Informations légales enregistrées." });
}

export async function saveImages(formData: FormData) {
  await requireAdmin();
  try {
    for (const key of IMAGES) {
      const file = fileFrom(formData, `${key}File`);
      const remove = formData.get(`${key}Remove`) === "on";
      if (!file && !remove) continue;
      const previous = await getValue(key);
      // Retirer : retour à l'image fournie avec le site
      await setValue(key, file ? await saveImage(file) : DEFAULT_SETTINGS[key]);
      await deleteUpload(previous);
    }
  } catch (err) {
    if (err instanceof UploadError) back(PATH, { error: err.message });
    throw err;
  }

  contentChanged();
  back(PATH, { ok: "Images enregistrées." });
}
