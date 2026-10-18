import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { randomToken, sha256 } from "@/lib/security";

const COOKIE = "tsd_admin";
const SESSION_DAYS = 7;

// Limitation des tentatives de connexion sur 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 5;
const MAX_FAILS_PER_EMAIL = 10;

export async function createSession(userId: number) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { id: sha256(token), userId, expiresAt } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await db.session.deleteMany({ where: { id: sha256(token) } });
  store.delete(COOKIE);
}

// Administrateur connecté, ou null (mis en cache pour la durée de la requête)
export const getCurrentAdmin = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { id: sha256(token) },
    include: { user: { select: { id: true, email: true, name: true } } },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
});

// À appeler en tête de chaque page et de chaque action d'administration
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function isLoginBlocked(ipHash: string, email: string) {
  const since = new Date(Date.now() - ATTEMPT_WINDOW_MS);
  const [byIp, byEmail] = await Promise.all([
    db.loginAttempt.count({ where: { ipHash, success: false, createdAt: { gte: since } } }),
    db.loginAttempt.count({ where: { email, success: false, createdAt: { gte: since } } }),
  ]);
  return byIp >= MAX_FAILS_PER_IP || byEmail >= MAX_FAILS_PER_EMAIL;
}

export async function recordLoginAttempt(ipHash: string, email: string, success: boolean) {
  await db.loginAttempt.create({ data: { ipHash, email, success } });
  // Nettoyage des anciennes tentatives et sessions expirées
  const old = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await db.loginAttempt.deleteMany({ where: { createdAt: { lt: old } } });
  await db.session.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
