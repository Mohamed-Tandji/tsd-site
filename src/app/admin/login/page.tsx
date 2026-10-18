import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Field, Notice } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/ui";
import { getCurrentAdmin } from "@/lib/auth";
import { login } from "./actions";

export const metadata: Metadata = { title: "Connexion" };

const ERRORS: Record<string, string> = {
  invalid: "Courriel ou mot de passe incorrect.",
  blocked: "Trop de tentatives. Réessayez dans 15 minutes.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; ok?: string }> }) {
  if (await getCurrentAdmin()) redirect("/admin");
  const { error, ok } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <Image src="/brand/logo-tsd.svg" alt="TSD Systems" width={200} height={40} unoptimized className="mx-auto mb-8 h-10 w-auto" />
        <div className="rounded-md border border-line bg-white p-8">
          <h1 className="mb-6 font-serif text-[1.8rem]">Administration</h1>
          <Notice error={error ? ERRORS[error] : undefined} ok={ok === "logout" ? "Vous êtes déconnecté." : undefined} />
          <form action={login} className="grid gap-5">
            <Field name="email" label="Courriel" type="email" required autoComplete="username" maxLength={200} />
            <Field name="password" label="Mot de passe" type="password" required autoComplete="current-password" maxLength={200} />
            <div>
              <SubmitButton pendingLabel="Connexion…">Se connecter</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
