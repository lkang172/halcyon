import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import { getArticle, getArticles, ROOT_ID } from "@/lib/articles";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Not found — halcyon" };
  return { title: `${article.meta.title} — halcyon`, description: article.meta.excerpt };
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const all = getArticles();
  const { meta, html } = article;
  const parent = all.find((a) => a.slug === meta.parent) ?? null;
  // "root" is each category's own root node, not one shared root, so articles
  // in different categories are not siblings even when both hang off it.
  const siblings = all.filter(
    (a) => a.parent === meta.parent && a.category === meta.category && a.slug !== meta.slug,
  );
  const children = all.filter((a) => a.parent === meta.slug);

  return (
    <main className="article-page">
      <Masthead tagline={parent ? `A branch of “${parent.title}”.` : undefined} />
      <div className="shell">
        <div className="article-head">
          <div className="article-meta">
            <Link className="eyebrow" href={`/tree/${meta.categorySlug}`}>
              {meta.category}
            </Link>
            <span className="eyebrow">{formatDate(meta.date)}</span>
            <span className="eyebrow">{meta.readingTime} min</span>
          </div>
          <h1>{meta.title}</h1>
          <p className="lede" style={{ margin: 0 }}>
            {meta.excerpt}
          </p>
        </div>

        <hr className="rule" />

        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="siblings">
          <span className="eyebrow">
            {meta.parent === ROOT_ID ? "Sits at the top of" : "Grows from"}
          </span>
          {parent ? (
            <h2 style={{ fontSize: "1.4rem", marginTop: 8 }}>
              <Link href={`/articles/${parent.slug}`}>{parent.title} ↑</Link>
            </h2>
          ) : (
            <h2 style={{ fontSize: "1.4rem", marginTop: 8 }}>
              <Link href={`/tree/${meta.categorySlug}`}>{meta.category} ↑</Link>
            </h2>
          )}

          {siblings.length > 0 && (
            <>
              <span className="eyebrow" style={{ display: "block", marginTop: 40 }}>
                Shares a parent
              </span>
              <div className="sibling-grid">
                {siblings.map((s) => (
                  <Link key={s.slug} href={`/articles/${s.slug}`}>
                    <span className="eyebrow">{s.category}</span>
                    <strong>{s.title}</strong>
                  </Link>
                ))}
              </div>
            </>
          )}

          {children.length > 0 && (
            <>
              <span className="eyebrow" style={{ display: "block", marginTop: 40 }}>
                Branches below
              </span>
              <div className="sibling-grid">
                {children.map((c) => (
                  <Link key={c.slug} href={`/articles/${c.slug}`}>
                    <span className="eyebrow">{c.category}</span>
                    <strong>{c.title}</strong>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
