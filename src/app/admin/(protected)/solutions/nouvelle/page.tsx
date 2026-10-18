import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageTitle } from "@/components/admin/fields";
import SolutionForm from "@/components/admin/SolutionForm";

export const metadata: Metadata = { title: "Nouvelle solution" };

export default async function NewSolution({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <>
      <Link href="/admin/solutions" className="text-sm font-medium text-action hover:underline">
        ← Solutions
      </Link>
      <PageTitle title="Nouvelle solution" />
      <Notice error={error} />
      <SolutionForm />
    </>
  );
}
