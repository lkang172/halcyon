import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import TreeExplorer from "@/components/TreeExplorer";
import { getArticles } from "@/lib/articles";
import { buildLayout, serializeLayout } from "@/lib/tree";

export default function HomePage() {
  const layout = serializeLayout(buildLayout(getArticles(), "halcyon"));

  return (
    <main>
      <Masthead />
      <TreeExplorer layout={layout} />
      <Footer />
    </main>
  );
}
