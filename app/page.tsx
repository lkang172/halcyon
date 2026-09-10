import BlobField from "@/components/BlobField";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import { getCategories } from "@/lib/articles";

export default function HomePage() {
  const categories = getCategories();

  return (
    <main>
      <Masthead tagline={`lucas' thoughts on emerging technology`} />
      {categories.length > 0 ? (
        <BlobField categories={categories} />
      ) : (
        <div className="field-empty">
          <p>Nothing has been written here yet.</p>
          <span className="eyebrow">
            The first Markdown file in content/articles grows the first branch
          </span>
        </div>
      )}
      <Footer />
    </main>
  );
}
