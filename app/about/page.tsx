import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";

export const metadata = { title: "About — halcyon" };

export default function AboutPage() {
  return (
    <main>
      <Masthead tagline="About the tree and the person pruning it." />
      <div className="shell">
        <span className="eyebrow">About</span>
        <h1 style={{ fontSize: "2.6rem", margin: "12px 0 0" }}>Why a tree</h1>
        <p className="lede">
          A feed says what is newest. A tree says what came from what. This site is an attempt to
          learn about artificial intelligence in public, and to keep the shape of the argument
          visible while doing it.
        </p>
        <div className="prose">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Every essay hangs beneath the one that provoked it. Two essays that share a parent are
            two answers to the same question, which is usually more interesting than two essays
            published on the same day.
          </p>
          <h2>How to read it</h2>
          <p>
            Start at the root and walk down. Or open the contents page, which flattens everything
            into categories for when you already know what you are looking for.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
