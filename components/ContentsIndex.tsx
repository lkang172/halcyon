"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Article } from "@/lib/articles";

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ContentsIndex({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== input.current) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q
      ? articles.filter((a) =>
          `${a.title} ${a.excerpt} ${a.category}`.toLowerCase().includes(q),
        )
      : articles;

    const map = new Map<string, Article[]>();
    for (const a of matches) {
      if (!map.has(a.category)) map.set(a.category, []);
      map.get(a.category)!.push(a);
    }
    return {
      count: matches.length,
      list: [...map.entries()]
        .map(([name, items]) => ({ name, items }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [articles, query]);

  return (
    <>
      <div className="search-field">
        <span className="eyebrow">Find</span>
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles, categories, summaries…"
          aria-label="Search articles"
        />
        <span className="search-count">
          {groups.count} / {articles.length}
        </span>
      </div>
      <p className="eyebrow">Press / to search</p>

      {groups.list.length === 0 ? (
        <p className="no-results">Nothing here yet under “{query}”.</p>
      ) : (
        groups.list.map((group) => (
          <section className="category" key={group.name}>
            <div className="category-head">
              <h2>{group.name}</h2>
              <span className="eyebrow">
                {group.items.length} {group.items.length === 1 ? "piece" : "pieces"}
              </span>
            </div>
            {group.items.map((a) => (
              <Link className="entry" key={a.slug} href={`/articles/${a.slug}`}>
                <span className="entry-date">{formatDate(a.date)}</span>
                <span>
                  <span className="entry-title">{a.title}</span>
                  <span className="entry-excerpt">{a.excerpt}</span>
                </span>
              </Link>
            ))}
          </section>
        ))
      )}
    </>
  );
}
