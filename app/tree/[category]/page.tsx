import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import TreeExplorer from "@/components/TreeExplorer";
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

  const layout = buildCategoryLayout(found.name, found.articles);
  const others = getCategories().filter((c) => c.slug !== found.slug);

  return (
    <main>
      <Masthead tagline={`${found.articles.length} pieces, arranged by what grew from what.`} />
      <div className="tree-head">
        <Link className="back-link" href="/">
          ← all categories
        </Link>
        <h2 className="tree-title">{found.name}</h2>
        <nav className="tree-switch">
          {others.map((c) => (
            <Link key={c.slug} href={`/tree/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
      <TreeExplorer layout={layout} storageKey={found.slug} />
      <Footer />
    </main>
  );
}
