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
        {tagline ? <p className="tagline">{tagline}</p> : null}
      </div>
    </header>
  );
}
