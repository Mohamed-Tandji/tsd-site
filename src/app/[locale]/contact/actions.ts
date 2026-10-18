"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactField, hashIp, isRateLimited, MIN_FILL_MS, notifyByEmail } from "@/lib/contact";
import { db } from "@/lib/db";

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<ContactField, string>>;
  formError?: "tooFast" | "rateLimited" | "server";
  values?: Record<ContactField, string>;
};

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Champ piège rempli : robot. On simule un succès sans rien enregistrer.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  const startedAt = Number(formData.get("startedAt"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return { status: "error", formError: "tooFast", values };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", fieldErrors, values };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnue";
  const ipHash = hashIp(ip);
  const locale = formData.get("locale") === "en" ? "en" : "fr";

  try {
    if (await isRateLimited(ipHash)) return { status: "error", formError: "rateLimited", values };

    const msg = await db.contactMessage.create({
      data: { name: parsed.data.name, email: parsed.data.email, body: parsed.data.message, locale, ipHash },
    });
    await notifyByEmail(msg);
    return { status: "success" };
  } catch (err) {
    console.error("Formulaire de contact :", err);
    return { status: "error", formError: "server", values };
  }
}
