import type { Article } from "./articles";

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
  depth: number;
  x: number;
  y: number;
  children: TreeNode[];
};

export type Edge = { from: [number, number]; to: [number, number]; fromId: string; toId: string };

export type FlatNode = Omit<TreeNode, "children">;
export type FlatLayout = { nodes: FlatNode[]; edges: Edge[]; width: number; height: number };

/** Node box, in the same units the canvas draws in. */
export const NODE_W = 208;
export const NODE_H = 66;

const COL = NODE_W + 26;
const ROW = NODE_H + 62;
const PAD = 90;

/**
 * Builds one tree per category. A node may have any number of children; the
 * frontmatter only says who the parent is.
 */
export function buildCategoryLayout(
  categoryName: string,
  articles: Article[],
): FlatLayout {
  const byId = new Map<string, TreeNode>();

  const make = (
    id: string,
    title: string,
    label: string,
    excerpt: string,
    date: string,
    href: string | null,
  ): TreeNode => ({
    id, title, label, excerpt, date, href,
    parentId: null, depth: 0, x: 0, y: 0, children: [],
  });

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
  // children. Because sibling subtrees own disjoint column ranges, no two
  // nodes on a level can collide however wide the tree grows.
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
      const first = n.children[0].x;
      const last = n.children[n.children.length - 1].x;
      n.x = (first + last) / 2;
    }
    nodes.push(n);
  };
  place(root, 0);

  const edges: Edge[] = [];
  for (const n of nodes) {
    for (const c of n.children) {
      edges.push({ from: [n.x, n.y], to: [c.x, c.y], fromId: n.id, toId: c.id });
    }
  }

  const width = PAD * 2 + Math.max(0, nextColumn - 1) * COL;
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const height = PAD * 2 + maxDepth * ROW;

  return {
    nodes: nodes.map(({ children, ...rest }) => rest),
    edges,
    width,
    height,
  };
}
