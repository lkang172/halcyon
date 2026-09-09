"use client";

import Link from "next/link";
import { useState } from "react";
import TreeCanvas from "@/components/TreeCanvas";
import type { FlatLayout, FlatNode } from "@/lib/tree";

export default function TreeExplorer({ layout }: { layout: FlatLayout }) {
  const [focused, setFocused] = useState<FlatNode | null>(null);

  return (
    <>
      <TreeCanvas layout={layout} onFocus={setFocused} />
      <div className="preview">
        {focused ? (
          <div>
            <span className="eyebrow">{focused.label}</span>
            <h3>{focused.title}</h3>
            <p>{focused.excerpt || "Everything below grows out of this cluster."}</p>
            {focused.href ? (
              <p className="meta">
                <Link className="preview-read" href={focused.href}>
                  Read →
                </Link>
              </p>
            ) : null}
          </div>
        ) : (
          <p className="preview-empty">
            Hover a node to see what grows there. Siblings share a parent because they share an
            argument.
          </p>
        )}
      </div>
    </>
  );
}
