import Image from "next/image";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { logout } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const unread = await db.contactMessage.count({ where: { read: false } });

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-white p-4 lg:border-r lg:border-b-0 lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 lg:mb-8 lg:block">
          <Image src="/brand/logo-tsd.svg" alt="TSD Systems" width={160} height={32} unoptimized className="h-8 w-auto" />
          <a href="/fr" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-action hover:underline lg:mt-3 lg:inline-block">
            Voir le site ↗
          </a>
        </div>
        <AdminNav unread={unread} />
        <div className="mt-4 border-t border-line pt-4 text-sm lg:mt-8">
          <p className="truncate text-slate" title={admin.email}>
            {admin.name}
          </p>
          <form action={logout} className="mt-2">
            <button type="submit" className="cursor-pointer font-medium text-action hover:underline">
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-[960px] px-4 py-8 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
