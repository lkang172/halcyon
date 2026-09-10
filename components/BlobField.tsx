import Link from "next/link";
import type { Category } from "@/lib/articles";
import { blobPath, placeBlob, seedFrom } from "@/lib/blob";

const TINTS = ["tint-clay", "tint-moss", "tint-slate", "tint-plum", "tint-ochre"];

export default function BlobField({ categories }: { categories: Category[] }) {
  return (
    <div className="blob-field">
      {categories.map((category, i) => {
        const seed = seedFrom(category.slug);
        const p = placeBlob(i, categories.length, category.articles.length, seed, category.name.length);
        return (
          <Link
            key={category.slug}
            href={`/tree/${category.slug}`}
            className={`blob ${TINTS[i % TINTS.length]}`}
            style={
              {
                left: `${p.left}%`,
                top: `${p.top}%`,
                "--size": `${p.size}px`,
                "--dur": `${p.duration}s`,
                "--delay": `${p.delay}s`,
                "--drift": `${p.drift}px`,
                "--tilt": `${p.tilt}deg`,
              } as React.CSSProperties
            }
          >
            <svg className="blob-shape" viewBox="-1.3 -1.3 2.6 2.6" aria-hidden="true">
              <path className="blob-fill" d={blobPath(seed)} />
              <path className="blob-outline" d={blobPath(seed + 5, 8, 0.2)} />
            </svg>
            <span className="blob-label">
              <span className="blob-name">{category.name}</span>
              <span className="blob-count">
                {category.articles.length} {category.articles.length === 1 ? "piece" : "pieces"}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
