import { ROOT_ID, type Article, type Branch } from "./articles";

export type TreeNode = {
  id: string;
  title: string;
  category: string | null;
  excerpt: string;
  date: string;
  href: string | null;
  parentId: string | null;
  depth: number;
  x: number;
  y: number;
  left: TreeNode | null;
  right: TreeNode | null;
};

export type Edge = {
  from: [number, number];
  to: [number, number];
  fromId: string;
  toId: string;
  branch: Branch;
};

export type Layout = {
  nodes: TreeNode[];
  edges: Edge[];
  width: number;
  height: number;
};

const COL = 190;
const ROW = 150;
const PAD = 120;

/** Builds the binary tree from article frontmatter, then lays it out. */
export function buildLayout(articles: Article[], rootTitle: string): Layout {
  const byId = new Map<string, TreeNode>();

  const make = (
    id: string,
    title: string,
    category: string | null,
    excerpt: string,
    date: string,
    href: string | null,
  ): TreeNode => ({
    id, title, category, excerpt, date, href,
    parentId: null, depth: 0, x: 0, y: 0, left: null, right: null,
  });

  const root = make(ROOT_ID, rootTitle, null, "", "", "/");
  byId.set(ROOT_ID, root);

  // Oldest-first so parents are placed before their children.
  const ordered = [...articles].sort((a, b) => a.date.localeCompare(b.date));
  for (const a of ordered) {
    byId.set(a.slug, make(a.slug, a.title, a.category, a.excerpt, a.date, `/articles/${a.slug}`));
  }

  const orphans: Article[] = [];
  for (const a of ordered) {
    const node = byId.get(a.slug)!;
    const parent = byId.get(a.parent);
    if (!parent) {
      orphans.push(a);
      continue;
    }
    if (parent[a.branch] === null) parent[a.branch] = node;
    else if (parent.left === null) parent.left = node;
    else if (parent.right === null) parent.right = node;
    else {
      orphans.push(a);
      continue;
    }
    node.parentId = parent.id;
  }

  // Anything that could not be attached hangs off the first free slot found
  // in a breadth-first sweep, so no article ever disappears from the tree.
  for (const a of orphans) {
    const node = byId.get(a.slug)!;
    const queue: TreeNode[] = [root];
    while (queue.length) {
      const n = queue.shift()!;
      if (n.left === null) { n.left = node; node.parentId = n.id; break; }
      if (n.right === null) { n.right = node; node.parentId = n.id; break; }
      queue.push(n.left, n.right);
    }
  }

  // In-order traversal: one column per node guarantees no overlap.
  let column = 0;
  const nodes: TreeNode[] = [];
  const walk = (n: TreeNode | null, depth: number) => {
    if (!n) return;
    walk(n.left, depth + 1);
    n.depth = depth;
    n.x = PAD + column * COL;
    n.y = PAD + depth * ROW;
    column += 1;
    nodes.push(n);
    walk(n.right, depth + 1);
  };
  walk(root, 0);

  const edges: Edge[] = [];
  for (const n of nodes) {
    if (n.left)
      edges.push({ from: [n.x, n.y], to: [n.left.x, n.left.y], fromId: n.id, toId: n.left.id, branch: "left" });
    if (n.right)
      edges.push({ from: [n.x, n.y], to: [n.right.x, n.right.y], fromId: n.id, toId: n.right.id, branch: "right" });
  }

  const width = PAD * 2 + Math.max(0, column - 1) * COL;
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.depth), 0);
  const height = PAD * 2 + maxDepth * ROW;

  return { nodes, edges, width, height };
}

/** Strips child pointers so the layout can cross the server/client boundary. */
export function serializeLayout(layout: Layout) {
  return {
    ...layout,
    nodes: layout.nodes.map(({ left, right, ...rest }) => rest),
  };
}

export type FlatNode = Omit<TreeNode, "left" | "right">;
export type FlatLayout = Omit<Layout, "nodes"> & { nodes: FlatNode[] };
