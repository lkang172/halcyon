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

const nextConfig: NextConfig = {
  ...(hasArticles() ? { output: "export" as const } : {}),
  images: { unoptimized: true },
  // Hides the floating Next.js dev badge in the corner during `next dev`.
  devIndicators: false,
};

export default nextConfig;
