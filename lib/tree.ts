import type { Article } from "./articles";
import { rand, seedFrom } from "./blob";

// Kept local so this module stays free of the filesystem imports in ./articles
// and can be pulled into client components for its types and constants.
const ROOT_ID = "root";

export type TreeNode = {
  id: string;
  title: string;
  label: string;
  excerpt: string;
  date: string;
  href: string | null;
  parentId: string | null;
  seed: number;
  /** Blob radii, in canvas units. */
  rx: number;
  ry: number;
  depth: number;
  x: number;
  y: number;
  children: TreeNode[];
};

export type Edge = { fromId: string; toId: string; seed: number };

export type FlatNode = Omit<TreeNode, "children">;
export type FlatLayout = { nodes: FlatNode[]; edges: Edge[]; width: number; height: number };

const COL = 348;
const ROW = 214;
const PAD = 170;

/** Deterministic wobble in [-1, 1], so a node always lands in the same spot. */
function wobble(seed: number, salt: number) {
  return rand(seed * 7919 + salt * 104729) * 2 - 1;
}

/**
 * Builds one tree per category. A node may have any number of children; the
 * frontmatter only says who the parent is.
 */
export function buildCategoryLayout(categoryName: string, articles: Article[]): FlatLayout {
  const byId = new Map<string, TreeNode>();

  const make = (
    id: string,
    title: string,
    label: string,
    excerpt: string,
    date: string,
    href: string | null,
  ): TreeNode => {
    const seed = seedFrom(id);
    const rx = Math.min(168, 100 + title.length * 3.6);
    return {
      id, title, label, excerpt, date, href, seed,
      rx, ry: Math.round(rx * 0.46),
      parentId: null, depth: 0, x: 0, y: 0, children: [],
    };
  };

  const root = make(ROOT_ID, categoryName, "the category", "", "", null);
  byId.set(ROOT_ID, root);

  const ordered = [...articles].sort((a, b) => a.date.localeCompare(b.date));
  for (const a of ordered) {
    byId.set(a.slug, make(a.slug, a.title, a.category, a.excerpt, a.date, `/articles/${a.slug}`));
  }

  for (const a of ordered) {
    const node = byId.get(a.slug)!;
    // A parent outside this category cannot be drawn here, so the article
    // hangs off the category node instead of vanishing.
    const parent = byId.get(a.parent) ?? root;
    parent.children.push(node);
    node.parentId = parent.id;
  }

  // Tidy layout: leaves take the next free column, parents centre over their
  // children. Sibling subtrees own disjoint column ranges, so nothing can
  // collide. The jitter afterwards loosens the grid without reintroducing
  // overlap, since it is far smaller than the spacing it perturbs.
  let nextColumn = 0;
  const nodes: TreeNode[] = [];
  const place = (n: TreeNode, depth: number) => {
    n.depth = depth;
    n.y = PAD + depth * ROW;
    if (n.children.length === 0) {
      n.x = PAD + nextColumn * COL;
      nextColumn += 1;
    } else {
      for (const child of n.children) place(child, depth + 1);
      n.x = (n.children[0].x + n.children[n.children.length - 1].x) / 2;
    }
    nodes.push(n);
  };
  place(root, 0);

  for (const n of nodes) {
    if (n.id === ROOT_ID) continue;
    n.x = Math.round(n.x + wobble(n.seed, 1) * 40);
    n.y = Math.round(n.y + wobble(n.seed, 2) * 34);
  }

  const edges: Edge[] = [];
  for (const n of nodes) {
    for (const c of n.children) {
      edges.push({ fromId: n.id, toId: c.id, seed: (n.seed + c.seed) % 100000 });
    }
  }

  const right = nodes.reduce((m, n) => Math.max(m, n.x + n.rx), 0);
  const bottom = nodes.reduce((m, n) => Math.max(m, n.y + n.ry), 0);

  return {
    nodes: nodes.map(({ children, ...rest }) => rest),
    edges,
    width: right + PAD,
    height: bottom + PAD,
  };
}
