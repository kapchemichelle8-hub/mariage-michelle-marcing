import type { CSSProperties } from "react";

const DOVE_PATH =
  "M2 30c6-1 11-4 15-8 3-3 6-5 10-5 2 0 4 1 5 3 1-6 5-12 12-16 4-2 8-3 12-3-5 3-8 7-9 12 4-3 9-4 14-3-4 2-7 5-9 9 3 0 6 1 8 3-6 0-10 2-13 5-4 5-10 8-17 8-6 0-11-2-15-5-4 1-9 1-13 0z";

/** Deux colombes qui se font face autour d'un cœur. */
export function DovesHeart({ className = "", tone = "currentColor" }: { className?: string; tone?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} aria-hidden="true" fill={tone}>
      <g transform="translate(6 6)">
        <path d={DOVE_PATH} />
        <circle cx="31.5" cy="19" r="0.9" fill="#fffaf0" opacity="0.8" />
      </g>
      <g transform="translate(154 6) scale(-1 1)">
        <path d={DOVE_PATH} />
        <circle cx="31.5" cy="19" r="0.9" fill="#fffaf0" opacity="0.8" />
      </g>
      <path
        d="M80 48s-11-6.8-14.6-13.6C63 29.6 65.8 23.5 71.5 23.5c3.4 0 5.3 1.8 6.3 3.6.6 1 2.3 1 2.9 0 1-1.8 2.9-3.6 6.3-3.6 5.7 0 8.5 6.1 6.1 10.9C91 41.2 80 48 80 48z"
        opacity="0.95"
      />
    </svg>
  );
}

/** Séparateur floral fin, dessiné à la main. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70 sm:w-28" />
      <svg viewBox="0 0 80 24" className="h-6 w-20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M2 12c10 0 16-6 24-6 6 0 9 3 14 6 5-3 8-6 14-6 8 0 14 6 24 6" />
        <path d="M26 6c-2-3-1-5 2-5M54 6c2-3 1-5-2-5" />
        <path d="M40 18c-2.5-1.6-4-3.2-4-5 0-1.4 1-2.3 2.2-2.3.8 0 1.4.4 1.8 1 .4-.6 1-1 1.8-1 1.2 0 2.2.9 2.2 2.3 0 1.8-1.5 3.4-4 5z" fill="currentColor" stroke="none" />
        <circle cx="16" cy="10" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="64" cy="10" r="1.2" fill="currentColor" stroke="none" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70 sm:w-28" />
    </div>
  );
}

type PortraitProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/**
 * Portrait en médaillon rond : anneau or, liseré ivoire, visage centré.
 * Les photos sont recadrées en amont (visage au centre, épaules visibles).
 */
export function Portrait({ src, alt, className = "", loading = "lazy" }: PortraitProps) {
  return (
    <figure className={`depth gold-ring aspect-square ${className}`} tabIndex={0}>
      <div className="ring-inner h-full w-full">
        <img
          src={src}
          alt={alt}
          width={640}
          height={640}
          loading={loading}
          decoding="async"
          className="h-full w-full rounded-full object-cover object-center"
        />
      </div>
    </figure>
  );
}

const PETALS = [
  { left: "6%", size: 14, dur: 16, wait: 0, sway: 40, alpha: 0.75, leaf: false },
  { left: "18%", size: 10, dur: 19, wait: 5, sway: -30, alpha: 0.6, leaf: true },
  { left: "31%", size: 16, dur: 15, wait: 9, sway: 50, alpha: 0.8, leaf: false },
  { left: "47%", size: 11, dur: 21, wait: 2, sway: -45, alpha: 0.55, leaf: false },
  { left: "59%", size: 13, dur: 17, wait: 12, sway: 35, alpha: 0.7, leaf: true },
  { left: "72%", size: 15, dur: 18, wait: 6, sway: -40, alpha: 0.75, leaf: false },
  { left: "84%", size: 10, dur: 22, wait: 14, sway: 25, alpha: 0.6, leaf: false },
  { left: "93%", size: 12, dur: 16, wait: 3, sway: -35, alpha: 0.7, leaf: true },
];

/** Quelques pétales et feuilles qui tombent lentement (désactivés si mouvement réduit). */
export function Petals({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PETALS.map((p, i) => (
        <svg
          key={i}
          className="petal"
          viewBox="0 0 20 20"
          width={p.size}
          height={p.size}
          style={
            {
              left: p.left,
              "--dur": `${p.dur}s`,
              "--wait": `${p.wait}s`,
              "--sway": `${p.sway}px`,
              "--alpha": p.alpha,
            } as CSSProperties
          }
        >
          {p.leaf ? (
            <path d="M2 18C2 8 8 2 18 2 18 12 12 18 2 18z" fill="#b8a46a" />
          ) : (
            <path d="M10 1c5 3 8 7 8 11a8 8 0 0 1-16 0c0-4 3-8 8-11z" fill="#f1dcc6" stroke="#e3c7a6" strokeWidth="0.6" />
          )}
        </svg>
      ))}
    </div>
  );
}
