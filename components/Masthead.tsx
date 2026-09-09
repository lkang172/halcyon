import Link from "next/link";

export default function Masthead({ tagline }: { tagline?: string }) {
  return (
    <header className="masthead">
      <div>
        <h1 className="wordmark">
          <Link href="/">
            halcyon<span className="dot">.</span>
          </Link>
        </h1>
        <p className="tagline">
          {tagline ?? "Notes on machines that think, arranged as a tree rather than a feed."}
        </p>
      </div>
    </header>
  );
}
