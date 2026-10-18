import "server-only";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CONTENT_TAG } from "@/lib/content";

// Petits utilitaires des actions d'administration

export const str = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();
export const bool = (formData: FormData, key: string) => formData.get(key) === "on";

// Le site public relit la base dès la requête suivante
export function contentChanged() {
  revalidateTag(CONTENT_TAG);
}

// Retour à la page avec un message (affiché par <Notice />)
export function back(path: string, notice: { ok?: string; error?: string }): never {
  const params = new URLSearchParams(notice as Record<string, string>);
  redirect(`${path}${path.includes("?") ? "&" : "?"}${params}`);
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

// Dates affichées dans l'administration (fuseau réglable : ADMIN_TIMEZONE)
export function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: process.env.ADMIN_TIMEZONE || "Africa/Bamako" });
}
