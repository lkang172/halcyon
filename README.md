# halcyon

A blog about current technology, mostly artificial intelligence, arranged as trees instead of a
feed. The home page floats one blob per category. Click a blob and you drop into that category's
tree, where each essay hangs beneath the essay that provoked it, so two pieces sharing a parent
are two answers to the same question. A node may have any number of children.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into ./out
```

The site is a static export, so `out/` can be served by anything: GitHub Pages, Netlify, Vercel,
or `npx serve out`.

Static export is switched on in `next.config.ts` only when at least one article exists. Export
requires every dynamic route to generate at least one path, and the category and article routes
generate none while nothing has been written. With an empty `content/articles` the build still
succeeds, it just produces a server build rather than an export.

## Writing an article

Add a Markdown file to `content/articles/`. The filename becomes the URL slug.

```markdown
---
title: "What Counts as Cracked"
category: "Research"
date: "2026-09-05"
excerpt: "One sentence shown on the tree and in the contents index."
parent: "navier-stokes-and-the-machine"
readingTime: 7
---

Body text in Markdown.
```

`parent` is the slug of the article this one grows from, or `root` for a piece that sits at the
top of its category. A parent in a different category cannot be drawn, so such an article hangs
off the category node instead of disappearing.

`category` decides which blob the piece lives in and which tree it appears in. A new category
name creates a new blob automatically; the field scatters however many exist around a loose
ellipse, so nothing needs to be registered anywhere.

## Images

Put image files under `public/images/` and reference them from an article by their path
from `public`:

```markdown
![Alt text for screen readers](/images/intelligence-index.png "Caption printed under the image.")
```

An image alone in its own paragraph becomes a `<figure>`. The Markdown title, the quoted part,
becomes the caption; without one the alt text is used instead. Save a real file into the repo
rather than hotlinking someone else's asset, and credit the source in the caption.

## Layout of the code

| Path | What lives there |
| --- | --- |
| `app/` | Routes: home, about, contact, contents, `tree/[category]`, `articles/[slug]` |
| `components/` | Blob field, tree canvas, menu, contents index, masthead, footer |
| `lib/articles.ts` | Reads and parses the Markdown files, groups them into categories |
| `lib/tree.ts` | Builds one tree per category and computes node positions |
| `lib/blob.ts` | Organic blob paths and their scattered placement |
| `content/articles/` | The essays |

Tree layout is bottom-up: leaves take the next free column and parents centre over their children.
Sibling subtrees own disjoint column ranges, so nodes can never overlap however wide or lopsided a
tree grows. A seeded jitter then nudges each node off the grid, and the seed comes from the slug,
so a piece always lands in the same place.

Nodes are draggable. Whatever you rearrange is saved to `localStorage` under the category slug and
comes back on the next visit; the ↺ button in the corner throws the arrangement away and refits
the tree.
