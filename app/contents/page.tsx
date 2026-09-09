import ContentsIndex from "@/components/ContentsIndex";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import { getArticles } from "@/lib/articles";

export const metadata = { title: "Contents — halcyon" };

export default function ContentsPage() {
  return (
    <main>
      <Masthead tagline="The same essays, flattened into categories." />
      <div className="shell">
        <span className="eyebrow">Contents</span>
        <h1 style={{ fontSize: "2.6rem", margin: "12px 0 0" }}>Everything, by category</h1>
        <ContentsIndex articles={getArticles()} />
      </div>
      <Footer />
    </main>
  );
}
