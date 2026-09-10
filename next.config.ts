import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Hides the floating Next.js dev badge in the corner during `next dev`.
  devIndicators: false,
};

export default nextConfig;
