import { createHash } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";

// Règles du formulaire de contact (les messages d'erreur sont des clés traduites côté client)
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameShort").max(100, "nameLong"),
  email: z.string().trim().max(200, "emailInvalid").email("emailInvalid"),
  message: z.string().trim().min(10, "messageShort").max(5000, "messageLong"),
});

export type ContactField = keyof z.infer<typeof contactSchema>;

export const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 }; // 5 envois par heure et par IP
export const MIN_FILL_MS = 2000; // un humain met plus de 2 s à remplir le formulaire
const DAILY_EMAIL_CAP = 100; // offre gratuite Resend : 100 courriels par jour

export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`)
    .digest("hex");
}

export async function isRateLimited(ipHash: string) {
  const since = new Date(Date.now() - RATE_LIMIT.windowMs);
  const count = await db.contactMessage.count({ where: { ipHash, createdAt: { gte: since } } });
  return count >= RATE_LIMIT.max;
}

// Notification par courriel via l'API Resend ; sans clé, le message est seulement enregistré
export async function notifyByEmail(msg: { id: number; name: string; email: string; body: string; locale: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const sentToday = await db.contactMessage.count({ where: { notified: true, createdAt: { gte: startOfDay } } });
  if (sentToday >= DAILY_EMAIL_CAP) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "TSD Systems <site@tsdsystems.net>",
        to: [process.env.CONTACT_TO || "contact@tsdsystems.net"],
        reply_to: msg.email,
        subject: `Nouveau message du site – ${msg.name}`,
        text: `Nom : ${msg.name}\nCourriel : ${msg.email}\nLangue : ${msg.locale}\n\n${msg.body}\n\n— Message n° ${msg.id}, à retrouver dans /admin`,
      }),
    });
    if (!res.ok) {
      console.error("Resend :", res.status, await res.text());
      return false;
    }
    await db.contactMessage.update({ where: { id: msg.id }, data: { notified: true } });
    return true;
  } catch (err) {
    console.error("Resend :", err);
    return false;
  }
}
