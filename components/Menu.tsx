"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/contents", label: "Contents" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div className="menu-root" ref={root}>
      {open ? (
        <nav className="menu-panel" aria-label="Site">
          <div className="menu-panel-head">
            <span className="eyebrow">Index</span>
            <button className="menu-close" onClick={() => setOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </div>
          {LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              <span className="idx">{String(i + 1).padStart(2, "0")}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : (
        <button
          className="menu-button"
          aria-expanded={false}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <span className="menu-glyph">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
      )}
    </div>
  );
}
