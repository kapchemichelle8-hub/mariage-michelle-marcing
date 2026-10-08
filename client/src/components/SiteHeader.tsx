import { useEffect, useState } from "react";
import { Link } from "wouter";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-ivory/92 shadow-[0_1px_0_rgb(198_161_91/0.25)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <a
          href="#accueil"
          className={`script text-[1.7rem] leading-none transition-colors ${scrolled ? "text-cocoa" : "text-ivory"}`}
        >
          M <span className="text-gold">&amp;</span> M
        </a>
        <nav className="flex items-center gap-2 text-sm sm:gap-5">
          <a
            href="#quand-ou"
            className={`hidden transition-colors hover:text-gold sm:inline ${scrolled ? "text-ink" : "text-ivory/90"}`}
          >
            Quand &amp; Où ?
          </a>
          <Link
            href="/espace-maries"
            className={`hidden text-xs tracking-wide transition-colors hover:text-gold md:inline ${
              scrolled ? "text-muted" : "text-ivory/70"
            }`}
          >
            Espace Mariés
          </Link>
          <a href="#rsvp" className="btn-gold !px-4 !py-2 text-[0.8rem] sm:!px-5">
            Confirmer ma présence
          </a>
        </nav>
      </div>
    </header>
  );
}
