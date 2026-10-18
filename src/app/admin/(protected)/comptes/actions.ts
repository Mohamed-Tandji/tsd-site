"use server";

import { back, str } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, PASSWORD_MIN_LENGTH, verifyPassword } from "@/lib/security";

const PATH = "/admin/comptes";

function checkPassword(password: string, confirm: string) {
  if (password.length < PASSWORD_MIN_LENGTH) back(PATH, { error: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.` });
  if (password.length > 200) back(PATH, { error: "Le mot de passe est trop long." });
  if (password !== confirm) back(PATH, { error: "Les deux mots de passe ne correspondent pas." });
}

export async function addAdmin(formData: FormData) {
  await requireAdmin();
  const name = str(formData, "name").slice(0, 100);
  const email = str(formData, "email").toLowerCase().slice(0, 200);
  const password = String(formData.get("password") ?? "");
  if (!name) back(PATH, { error: "Le nom est obligatoire." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back(PATH, { error: "Adresse courriel invalide." });
  checkPassword(password, String(formData.get("confirm") ?? ""));
  if (await db.adminUser.findUnique({ where: { email } })) back(PATH, { error: "Un compte existe déjà avec ce courriel." });

  await db.adminUser.create({ data: { name, email, passwordHash: await hashPassword(password) } });
  back(PATH, { ok: `Compte créé pour ${email}.` });
}

export async function changeOwnPassword(formData: FormData) {
  const admin = await requireAdmin();
  const user = await db.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await verifyPassword(String(formData.get("current") ?? ""), user.passwordHash))) back(PATH, { error: "Mot de passe actuel incorrect." });
  const password = String(formData.get("password") ?? "");
  checkPassword(password, String(formData.get("confirm") ?? ""));

  await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash: await hashPassword(password) } });
  back(PATH, { ok: "Votre mot de passe a été changé." });
}

// Nouveau mot de passe pour un autre compte : ses sessions ouvertes sont fermées
export async function resetPassword(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  if (id === admin.id) back(PATH, { error: "Pour votre propre compte, utilisez « Changer mon mot de passe »." });
  const password = String(formData.get("password") ?? "");
  checkPassword(password, String(formData.get("confirm") ?? ""));

  await db.adminUser.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
  await db.session.deleteMany({ where: { userId: id } });
  back(PATH, { ok: "Mot de passe changé. Le compte devra se reconnecter." });
}

export async function deleteAdmin(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  if (id === admin.id) back(PATH, { error: "Vous ne pouvez pas supprimer votre propre compte." });
  if ((await db.adminUser.count()) <= 1) back(PATH, { error: "Le dernier compte administrateur ne peut pas être supprimé." });

  await db.adminUser.deleteMany({ where: { id } });
  back(PATH, { ok: "Compte supprimé." });
}
