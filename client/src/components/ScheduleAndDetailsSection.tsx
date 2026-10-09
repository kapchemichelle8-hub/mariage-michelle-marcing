import { useReveal } from "@/hooks/useReveal";
import { media, schedule, wedding, type ScheduleStep } from "@/weddingConfig";
import { FloralDivider } from "./Ornaments";
import { Reveal } from "./Reveal";

const ICONS = [
  // Mairie
  <path key="m" d="M4 20h16M5 20V10m14 10V10M3 10l9-6 9 6M9 20v-6h6v6M8 10v.01M16 10v.01" />,
  // Église
  <path key="e" d="M12 2v4m-2-2h4M7 22V11l5-4 5 4v11M3 22h18M10 22v-4a2 2 0 0 1 4 0v4" />,
  // Soirée
  <path key="s" d="M8 22h8M12 15v7M6 3h12l-1 6a5 5 0 0 1-10 0L6 3zM6.5 7h11" />,
];

function Step({ step, index }: { step: ScheduleStep; index: number }) {
  const ref = useReveal<HTMLLIElement>(0.3);
  const offsets = ["md:ml-0", "md:ml-16", "md:ml-6"];
  const tilts = ["md:-rotate-[0.6deg]", "md:rotate-[0.5deg]", "md:-rotate-[0.3deg]"];
  return (
    <li
      ref={ref}
      className={`step-card reveal relative pl-12 ${offsets[index]} md:pl-16`}
      style={{ "--delay": `${index * 120}ms` } as React.CSSProperties}
    >
      <span className="step-dot absolute left-[0.4rem] top-7 grid h-8 w-8 place-items-center rounded-full bg-cocoa text-gold-soft ring-2 ring-gold md:left-[0.9rem]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {ICONS[index]}
        </svg>
      </span>
      <article
        className={`rounded-[1.6rem] border border-gold/45 bg-white p-6 shadow-[0_24px_48px_-28px_rgb(28_20_16/0.55)] transition-transform duration-300 hover:-translate-y-1 sm:p-7 ${tilts[index]}`}
      >
        <p className="font-display text-3xl font-semibold leading-none text-gold-deep sm:text-4xl">{step.time}</p>
        <h3 className="mt-3 text-2xl sm:text-[1.7rem]">{step.title}</h3>
        <p className="mt-1 flex items-start gap-1.5 text-sm font-medium text-muted">
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.4" />
          </svg>
          {step.place}
        </p>
        <p className="mt-3 leading-relaxed text-ink">{step.text}</p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(step.mapQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
        >
          Voir sur la carte
        </a>
      </article>
    </li>
  );
}

export function ScheduleAndDetailsSection() {
  return (
    <section id="quand-ou" className="paper scroll-mt-16 px-5 py-20 sm:py-24" aria-labelledby="when-title">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow">Quand &amp; Où ?</p>
          <h2 id="when-title" className="mt-2 text-4xl sm:text-5xl">
            {wedding.dateLabel}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-display text-xl italic leading-snug text-ink">
            Nous serions profondément heureux de vous avoir à nos côtés pour ces trois moments qui
            comptent tant pour nous.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <ol className="relative space-y-8" aria-label="Programme de la journée">
            <span className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-gradient-to-b from-gold/10 via-gold/60 to-gold/10 md:left-[1.9rem]" aria-hidden="true" />
            {schedule.map((step, i) => (
              <Step key={step.time} step={step} index={i} />
            ))}
          </ol>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Reveal>
              <figure className="depth overflow-hidden rounded-[1.6rem] shadow-[0_24px_50px_-30px_rgb(59_38_24/0.8)]">
                <img
                  src={media.soiree.small}
                  srcSet={`${media.soiree.small} 800w, ${media.soiree.large} 1400w`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  width={1400}
                  height={933}
                  loading="lazy"
                  decoding="async"
                  alt="Longues tables en bois éclairées de bougies et de guirlandes lumineuses, prêtes pour la soirée"
                  className="aspect-[3/2] w-full object-cover"
                />
                <figcaption className="bg-cocoa px-5 py-3 text-center font-display text-lg italic text-gold-soft">
                  Et le soir venu, la fête en famille
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={100} className="rounded-[1.6rem] border border-gold/50 bg-cream p-6">
              <p className="eyebrow">Pour venir à Nlem</p>
              <p className="mt-3 font-serif text-xl leading-snug text-ink">{wedding.itinerary}</p>
              <p className="mt-4 text-sm text-muted">
                Bandjoun, région de l’Ouest, Cameroun. Prévoyez un petit lainage : les soirées de
                décembre sont fraîches sur les hauts plateaux.
              </p>
            </Reveal>
          </div>
        </div>
        <FloralDivider className="mt-20" />
      </div>
    </section>
  );
}
