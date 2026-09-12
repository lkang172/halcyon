import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * Promotes a paragraph holding nothing but an image into a <figure>, captioned
 * with the image's Markdown title if it has one, else its alt text.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function rehypeFigures() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (!node.children) return;
      node.children = node.children.map((child) => {
        walk(child);
        if (child.type !== "element" || child.tagName !== "p") return child;

        const meaningful = child.children?.filter(
          (c) => c.type !== "text" || (c.value ?? "").trim() !== "",
        );
        if (meaningful?.length !== 1) return child;

        const img = meaningful[0];
        if (img.type !== "element" || img.tagName !== "img") return child;

        // basePath is applied to <Link> automatically but not to raw image
        // sources, so a root-relative image needs the prefix adding here.
        const src = img.properties?.src;
        if (BASE_PATH && typeof src === "string" && src.startsWith("/") && !src.startsWith("//")) {
          img.properties = { ...img.properties, src: `${BASE_PATH}${src}` };
        }

        const caption = img.properties?.title ?? img.properties?.alt;
        const children: HastNode[] = [img];
        if (typeof caption === "string" && caption.trim() !== "") {
          children.push({
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [{ type: "text", value: caption }],
          });
        }
        return { type: "element", tagName: "figure", properties: {}, children };
      });
    };
    walk(tree);
  };
}

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
  description: string;
  articles: Article[];
  latest: string;
};

/**
 * What each cluster is about, shown on the root blob of its tree. Keyed by the
 * slugified category name; a category with no entry here falls back to generic
 * copy in the hover card.
 */
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  safety:
    "Keeping AI systems safe for humans",
  evaluation:
    "How models are measured",
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
  if (!fs.existsSync(ARTICLES_DIR)) return [];
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
      .use(rehypeFigures)
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
      description: CATEGORY_DESCRIPTIONS[slugify(name)] ?? "",
      articles: list,
      latest: list.reduce((m, a) => (a.date > m ? a.date : m), ""),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategory(categorySlug: string): Category | null {
  return getCategories().find((c) => c.slug === categorySlug) ?? null;
}
