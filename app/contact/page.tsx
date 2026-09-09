import Footer from "@/components/Footer";
import Masthead from "@/components/Masthead";

export const metadata = { title: "Contact — halcyon" };

const CHANNELS = [
  { key: "Email", label: "lucaskang.gt@gmail.com", href: "mailto:lucaskang.gt@gmail.com" },
  { key: "GitHub", label: "github.com/lkang172", href: "https://github.com/lkang172" },
  { key: "Corrections", label: "Open an issue on the repository", href: "https://github.com/lkang172" },
];

export default function ContactPage() {
  return (
    <main>
      <Masthead tagline="Arguments, corrections, and suggested branches are all welcome." />
      <div className="shell">
        <span className="eyebrow">Contact</span>
        <h1 style={{ fontSize: "2.6rem", margin: "12px 0 0" }}>Say something</h1>
        <p className="lede">
          If an essay here is wrong, the fastest way to fix it is to tell me which part and why.
        </p>
        <ul className="contact-list">
          {CHANNELS.map((c) => (
            <li key={c.key}>
              <span className="k">{c.key}</span>
              <a href={c.href}>{c.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </main>
  );
}
