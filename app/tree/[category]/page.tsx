import { notFound } from "next/navigation";
import TreeCanvas from "@/components/TreeCanvas";
import { getCategories, getCategory } from "@/lib/articles";
import { buildCategoryLayout } from "@/lib/tree";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const found = getCategory(category);
  return { title: found ? `${found.name} — halcyon` : "Not found — halcyon" };
}

export default async function TreePage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  return (
    <main className="tree-page">
      <h1 className="tree-title">{found.name}</h1>
      <TreeCanvas layout={buildCategoryLayout(found.name, found.articles)} storageKey={found.slug} />
    </main>
  );
}
