import Link from "next/link";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";

export default function NotFound() {
  return (
    <main>
      <Masthead tagline="This branch was pruned, or never grew." />
      <div className="shell">
        <span className="eyebrow">404</span>
        <h1 style={{ fontSize: "2.6rem", margin: "12px 0 0" }}>No node here</h1>
        <p className="lede">
          Nothing hangs at this address. Go back to <Link href="/">the tree</Link> or browse the{" "}
          <Link href="/contents">contents</Link>.
        </p>
      </div>
      <Footer />
    </main>
  );
}
