import BlobField from "@/components/BlobField";
import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";
import { getCategories } from "@/lib/articles";

export default function HomePage() {
  const categories = getCategories();
  const total = categories.reduce((n, c) => n + c.articles.length, 0);

  return (
    <main>
      <Masthead tagline={`lucas' thoughts on emerging technology`} />
      <BlobField categories={categories} />
      <Footer />
    </main>
  );
}
