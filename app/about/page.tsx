import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";

export const metadata = { title: "About — halcyon" };

export default function AboutPage() {
  return (
    <main>
      <Masthead tagline="about" />
      <div className="shell">
        <h1 style={{ fontSize: "2.6rem", margin: "12px 0 0" }}>About</h1>
        <p className="lede">
          halcyon (adjective): a period of time in the past that was calm, peaceful, happy, and prosperous
        </p>
        <div className="prose">
          <p>
            I first learned of this word when seeing it used to describe a peaceful watermeadow in one of my 
            favorite books of all time, "Mossflower". However, "halcyon" can hardly be used to describe current 
            times, which are rapidly changing with the invention of groundbreaking technologies. 
          </p>
          <p>
            Since the invention of the transformer in 2017, it seems that AI has been evolving at an even more rapid pace, which carries significant implications for everyone. 
            I strongly believe in the importance of understanding the technologies I use and help develop. Thus, my goal is to learn about emerging technology architectures and use cases, significant breakthroughs, 
            safety risks, and more, and to document them by writing articles by hand. I believe that the best test of 
            understanding a concept is to explain it to others. 
            This website is a commitment that every week, I will learn at least one new thing from my list of interests
            and create an article about it. Please feel free to follow along - hopefully you will learn something new as well. 
          </p>
          <p>
            If anything that I write is incorrect, please feel free to open an issue in the Github repo. 
          </p>
          <h2>How to read it</h2>
          <p>
            My interests span many areas in the AI field, including applied AI, agentic development, 
            AI alignment, mechanistic intepretability, model architecture, and more. An intuitive way for me to 
            organize these articles is by grouping related concepts in a "blob", and in each blob, binary trees relate 
            articles to each other in a parent-child relationship that gives the reader a learning path to understand a more niche article 
            by starting from the fundamentals. 
          </p>

        </div>
      </div>
      <Footer />
    </main>
  );
}
