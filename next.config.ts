import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * `output: "export"` demands that every dynamic route generate at least one
 * path, and both /tree/[category] and /articles/[slug] generate none while
 * there is nothing written yet. Static export therefore switches itself on
 * with the first article and stays on from then.
 */
function hasArticles(): boolean {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "content", "articles"))
      .some((file) => file.endsWith(".md"));
  } catch {
    return false;
  }
}

/**
 * GitHub Pages serves a project site from /<repo>, so the build needs that
 * prefix. The deploy workflow sets it; local dev leaves it empty and the site
 * stays at the root. Remove it if the site ever moves to its own domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(hasArticles() ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
  // Exports each route as a directory with an index.html, which is what a
  // plain static host resolves cleanly. Without it the export writes both
  // tree/evaluation.html and an empty tree/evaluation/ directory, and Pages
  // picks the directory and 404s.
  trailingSlash: true,
  images: { unoptimized: true },
  // Hides the floating Next.js dev badge in the corner during `next dev`.
  devIndicators: false,
};

export default nextConfig;
