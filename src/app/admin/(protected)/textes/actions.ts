"use server";

import { back, contentChanged } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { defaultText, isKnownKey, sectionKeys } from "@/lib/messages-admin";

export async function saveTexts(formData: FormData) {
  await requireAdmin();
  const section = String(formData.get("section") ?? "");
  const keys = sectionKeys(section);
  if (keys.length === 0) back("/admin/textes", { error: "Section inconnue." });

  for (const key of keys) {
    if (!isKnownKey(key)) continue;
    const fr = String(formData.get(`fr:${key}`) ?? "").trim().slice(0, 5000);
    const en = String(formData.get(`en:${key}`) ?? "").trim().slice(0, 5000);
    const id = `msg.${key}`;
    // Identique au texte d'origine : rien à enregistrer
    if (fr === defaultText(key, "fr") && en === defaultText(key, "en")) {
      await db.setting.deleteMany({ where: { key: id } });
    } else {
      await db.setting.upsert({ where: { key: id }, update: { valueFr: fr, valueEn: en }, create: { key: id, valueFr: fr, valueEn: en } });
    }
  }

  contentChanged();
  back(`/admin/textes?section=${section}`, { ok: "Textes enregistrés. Ils sont visibles sur le site." });
}

export async function resetTexts(formData: FormData) {
  await requireAdmin();
  const section = String(formData.get("section") ?? "");
  const keys = sectionKeys(section);
  await db.setting.deleteMany({ where: { key: { in: keys.map((k) => `msg.${k}`) } } });
  contentChanged();
  back(`/admin/textes?section=${section}`, { ok: "Textes d’origine rétablis." });
}
