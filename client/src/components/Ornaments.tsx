import { useEffect, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

/** Bloc qui apparaît doucement au défilement. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}

/** Petit trait tracé « à la main » sous un titre. */
export function HandUnderline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 14" className={`hand-underline ${className}`} fill="none" aria-hidden="true">
      <path
        d="M3 9c18-5 34-6 50-4 13 2 22 4 36 2 16-2 29-6 48-3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Titre de section : petite phrase manuscrite + grand titre + souligné. */
export function SectionTitle({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto mb-12">
      <p className="font-script text-3xl md:text-4xl text-[#9d7537]">{kicker}</p>
      <h2 className="font-serif-luxury text-3xl md:text-5xl font-semibold text-[#2d241e] mt-1 leading-tight">{title}</h2>
      <HandUnderline />
      {children && <div className="mt-4 text-[15px] md:text-base text-[#5a4632] leading-relaxed">{children}</div>}
    </Reveal>
  );
}

const HEART_PATH =
  "M0.5,0.97 C0.2,0.78 0.01,0.6 0.01,0.35 C0.01,0.16 0.15,0.03 0.31,0.03 C0.4,0.03 0.47,0.08 0.5,0.14 C0.53,0.08 0.6,0.03 0.69,0.03 C0.85,0.03 0.99,0.16 0.99,0.35 C0.99,0.6 0.8,0.78 0.5,0.97 Z";

/** Masque en cœur partagé (à monter une seule fois par page). */
export function HeartClipDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
          <path d={HEART_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Portrait en cœur, visage placé sous l'échancrure, rendu argentique. */
export function HeartPortrait({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={`heart-frame ${className}`} tabIndex={0}>
      <div className="heart-clip">
        <img src={src} alt={alt} decoding="async" />
      </div>
      <svg viewBox="0 0 1 1" preserveAspectRatio="none" className="heart-outline" aria-hidden="true">
        <path d={HEART_PATH} fill="none" stroke="#fff7e8" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      </svg>
    </figure>
  );
}

const DOVE_PATH =
  "M2 30c6-1 11-4 15-8 3-3 6-5 10-5 2 0 4 1 5 3 1-6 5-12 12-16 4-2 8-3 12-3-5 3-8 7-9 12 4-3 9-4 14-3-4 2-7 5-9 9 3 0 6 1 8 3-6 0-10 2-13 5-4 5-10 8-17 8-6 0-11-2-15-5-4 1-9 1-13 0z";

/** Deux colombes qui se font face autour d'un cœur. */
export function DovesHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} fill="currentColor" aria-hidden="true">
      <path d={DOVE_PATH} transform="translate(6 6)" />
      <path d={DOVE_PATH} transform="translate(154 6) scale(-1 1)" />
      <path d="M80 48s-11-6.8-14.6-13.6C63 29.6 65.8 23.5 71.5 23.5c3.4 0 5.3 1.8 6.3 3.6.6 1 2.3 1 2.9 0 1-1.8 2.9-3.6 6.3-3.6 5.7 0 8.5 6.1 6.1 10.9C91 41.2 80 48 80 48z" />
    </svg>
  );
}

/** Fine barre dorée qui suit la lecture de la page. */
export function ScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}
