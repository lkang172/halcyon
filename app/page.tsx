import BlobField from "@/components/BlobField";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import { getCategories } from "@/lib/articles";

export default function HomePage() {
  const categories = getCategories();
  const total = categories.reduce((n, c) => n + c.articles.length, 0);

  return (
    <main>
      <Masthead tagline={`${total} pieces in ${categories.length} clusters. Pick one to open its tree.`} />
      <BlobField categories={categories} />
      <p className="blob-hint">
        Each cluster holds a tree. Inside one, an essay hangs beneath the essay that provoked it.
      </p>
      <Footer />
    </main>
  );
}
