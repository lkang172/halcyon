# halcyon

A blog about current technology, mostly artificial intelligence, arranged as a binary tree
instead of a feed. Each essay hangs beneath the essay that provoked it, so two pieces that share
a parent are two answers to the same question.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into ./out
```

The site is a static export, so `out/` can be served by anything: GitHub Pages, Netlify, Vercel,
or `npx serve out`.

## Writing an article

Add a Markdown file to `content/articles/`. The filename becomes the URL slug.

```markdown
---
title: "What Counts as Cracked"
category: "Research"
date: "2026-09-05"
excerpt: "One sentence shown on the tree and in the contents index."
parent: "navier-stokes-and-the-machine"
branch: "right"
readingTime: 7
---

Body text in Markdown.
```

`parent` is the slug of the article this one grows from, or `root` for a top-level piece.
`branch` is `left` or `right` and decides which side of the parent the node sits on. If a slot is
already taken the article falls into the next free one rather than disappearing, so a typo never
loses a piece.

`category` drives the grouping on the contents page and the label printed on each tree node. It is
independent of tree position on purpose: the tree shows lineage, the contents page shows subject.

## Layout of the code

| Path | What lives there |
| --- | --- |
| `app/` | Routes: home, about, contact, contents, `articles/[slug]` |
| `components/` | Menu, tree canvas, contents index, masthead, footer |
| `lib/articles.ts` | Reads and parses the Markdown files |
| `lib/tree.ts` | Builds the binary tree and computes node positions |
| `content/articles/` | The essays |

The tree layout gives every node its own column via an in-order traversal, which guarantees nodes
never overlap however lopsided the tree gets.
