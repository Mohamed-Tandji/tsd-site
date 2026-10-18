import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Test de connexion à la base : http://localhost:3000/api/health
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, database: "connectée" });
  } catch {
    return Response.json({ ok: false, database: "inaccessible" }, { status: 503 });
  }
}
