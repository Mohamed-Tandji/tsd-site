"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, destroySession, isLoginBlocked, recordLoginAttempt } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientIp, hashIp, hashPassword, verifyPassword } from "@/lib/security";

// Empreinte factice : un courriel inconnu prend autant de temps qu'un mauvais mot de passe
let dummyHash: Promise<string> | undefined;

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const ipHash = hashIp(clientIp(await headers()));

  if (await isLoginBlocked(ipHash, email)) redirect("/admin/login?error=blocked");

  const user = email ? await db.adminUser.findUnique({ where: { email } }) : null;
  dummyHash ??= hashPassword("mot-de-passe-factice");
  const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));

  await recordLoginAttempt(ipHash, email, !!user && valid);
  if (!user || !valid) redirect("/admin/login?error=invalid");

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login?ok=logout");
}
