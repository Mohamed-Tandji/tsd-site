// Contenu initial du site (FR/EN). Relançable sans risque : rien d'existant n'est écrasé.
// Usage : npx prisma db seed
// Premier compte admin : définir SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD (et SEED_ADMIN_NAME) dans .env
import { PrismaClient, type SolutionStatus } from "@prisma/client";
import { DEFAULT_SETTINGS } from "../src/lib/defaults";
import { hashPassword, PASSWORD_MIN_LENGTH } from "../src/lib/security";
import data from "./seed-data.json";

const db = new PrismaClient();

async function main() {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.setting.upsert({ where: { key }, update: {}, create: { key, valueFr: value, valueEn: value } });
  }
  console.log(`Réglages : ${Object.keys(DEFAULT_SETTINGS).length}`);

  for (const s of data.solutions) {
    await db.solution.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, status: s.status as SolutionStatus },
    });
  }
  console.log(`Solutions : ${data.solutions.length}`);

  if ((await db.teamMember.count()) === 0) {
    await db.teamMember.createMany({ data: data.team });
  }
  console.log(`Équipe : ${await db.teamMember.count()} membre(s)`);

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD ?? "";
  if (email && (await db.adminUser.count()) === 0) {
    if (password.length < PASSWORD_MIN_LENGTH) throw new Error(`SEED_ADMIN_PASSWORD : ${PASSWORD_MIN_LENGTH} caractères minimum.`);
    await db.adminUser.create({
      data: { email, name: process.env.SEED_ADMIN_NAME?.trim() || "Administrateur", passwordHash: await hashPassword(password) },
    });
    console.log(`Compte administrateur créé : ${email}`);
  } else if ((await db.adminUser.count()) === 0) {
    console.log("Aucun compte administrateur : définir SEED_ADMIN_EMAIL et SEED_ADMIN_PASSWORD puis relancer le seed.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
