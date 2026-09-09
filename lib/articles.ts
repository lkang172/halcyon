import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export const ROOT_ID = "root";

export type Article = {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string;
  excerpt: string;
  parent: string;
  readingTime: number;
};

export type Category = {
  name: string;
  slug: string;
  articles: Article[];
  latest: string;
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function readOne(file: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const { data } = matter(raw);
  const category = String(data.category ?? "Uncategorized");
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title ?? "Untitled"),
    category,
    categorySlug: slugify(category),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    parent: String(data.parent ?? ROOT_ID),
    readingTime: Number(data.readingTime ?? 5),
  };
}

export function getArticles(): Article[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readOne)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): { meta: Article; html: string } | null {
  const file = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { content } = matter(raw);
  const html = String(
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync(content),
  );
  return { meta: readOne(`${slug}.md`), html };
}

/** Groups articles into the categories that become the blobs on the home page. */
export function getCategories(articles = getArticles()): Category[] {
  const map = new Map<string, Article[]>();
  for (const a of articles) {
    if (!map.has(a.category)) map.set(a.category, []);
    map.get(a.category)!.push(a);
  }
  return [...map.entries()]
    .map(([name, list]) => ({
      name,
      slug: slugify(name),
      articles: list,
      latest: list.reduce((m, a) => (a.date > m ? a.date : m), ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategory(categorySlug: string): Category | null {
  return getCategories().find((c) => c.slug === categorySlug) ?? null;
}
