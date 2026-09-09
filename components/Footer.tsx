export default function Footer() {
  return (
    <footer className="site-foot">
      <span className="eyebrow">halcyon — an essay tree</span>
      <span className="eyebrow">Written by hand · {new Date().getFullYear()}</span>
    </footer>
  );
}
