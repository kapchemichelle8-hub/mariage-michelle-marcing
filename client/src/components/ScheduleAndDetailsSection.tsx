import { Church, Clock, Heart, MapPin, Music, Play, Scale, Sparkles } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";
import { WEDDING_CONFIG } from "../weddingConfig";
import { HandUnderline, Reveal, SectionTitle } from "./Ornaments";

const SCHEDULE_ICONS = { civil: Scale, church: Church, party: Music } as const;

type Step = (typeof WEDDING_CONFIG.schedule)[number];

function ScheduleStep({ item, index }: { item: Step; index: number }) {
  const ref = useReveal<HTMLLIElement>(0.3);
  const Icon = SCHEDULE_ICONS[item.icon as keyof typeof SCHEDULE_ICONS] ?? Heart;
  const tilt = ["md:-rotate-[0.6deg]", "md:rotate-[0.5deg]", "md:-rotate-[0.3deg]"][index] ?? "";
  const offset = ["md:ml-0", "md:ml-14", "md:ml-6"][index] ?? "";
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Paroisse Christ Sauveur Mbangué Douala")}`;

  return (
    <li ref={ref} className={`reveal relative pl-16 md:pl-20 ${offset}`} style={{ "--delay": `${index * 120}ms` } as CSSProperties}>
      <span className="step-dot absolute left-0 md:left-2 top-6 w-12 h-12 rounded-full bg-[#2a1d15] ring-2 ring-[#c69a58] flex items-center justify-center text-[#f3dfb2] shadow-lg z-10">
        <Icon className="w-5 h-5" />
      </span>
      <article className={`step-card card-luxury rounded-[1.6rem] p-6 md:p-7 ${tilt}`}>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-serif-luxury text-3xl md:text-4xl font-bold text-[#9a6a12] leading-none">{item.start}</span>
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#7c6d62]">Étape {index + 1} sur 3</span>
        </div>
        <h3 className="font-serif-luxury text-2xl md:text-[1.9rem] font-semibold text-[#2d241e] mt-2 leading-tight">{item.title}</h3>
        <p className="text-[15px] text-[#4a3b30] leading-relaxed mt-2">{item.description}</p>
        <p className="mt-4 pt-4 border-t border-dashed border-[#e1cfb5] flex items-start gap-2 text-sm font-medium text-[#5a4632]">
          <MapPin className="w-4 h-4 mt-0.5 text-[#9d7537] shrink-0" />
          <span>{item.location}</span>
        </p>
        {item.confirmed ? (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#855f24] underline decoration-[#c69a58]/50 underline-offset-4 hover:decoration-[#855f24]">
            Ouvrir dans Google Maps
          </a>
        ) : (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f4ede1] px-3 py-1 text-xs font-semibold text-[#855f24]">
            <Clock className="w-3.5 h-3.5" /> Lieu à venir, on vous tient au courant
          </span>
        )}
      </article>
    </li>
  );
}

export function ScheduleAndDetailsSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="space-y-28 py-20">
      {/* Notre histoire, façon album photo */}
      <section className="max-w-6xl mx-auto px-4">
        <SectionTitle kicker="Il était une fois…" title="Notre histoire">
          <p>{WEDDING_CONFIG.story}</p>
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 sm:gap-8 max-w-3xl mx-auto items-start">
          <Reveal className="flex flex-col items-center">
            <figure className="polaroid w-60 md:w-64 -rotate-3">
              <span className="tape" aria-hidden="true" />
              <div className="film-grain aspect-[4/5] overflow-hidden bg-[#efe5d6]">
                <img src={WEDDING_CONFIG.assets.bridePortrait} alt="Michelle, la mariée" loading="lazy" decoding="async" className="film w-full h-full object-cover object-[50%_20%]" />
              </div>
              <figcaption>Michelle</figcaption>
            </figure>
            <p className="font-serif-luxury italic text-lg text-[#4a3b30] text-center max-w-xs mt-6 leading-snug">{WEDDING_CONFIG.brideWords}</p>
          </Reveal>
          <Reveal delay={150} className="flex flex-col items-center sm:mt-16">
            <figure className="polaroid w-60 md:w-64 rotate-2">
              <span className="tape" aria-hidden="true" />
              <div className="film-grain aspect-[4/5] overflow-hidden bg-[#efe5d6]">
                <img src={WEDDING_CONFIG.assets.groomPortrait} alt="Marcing, le marié" loading="lazy" decoding="async" className="film w-full h-full object-cover object-[50%_20%]" />
              </div>
              <figcaption>Marcing</figcaption>
            </figure>
            <p className="font-serif-luxury italic text-lg text-[#4a3b30] text-center max-w-xs mt-6 leading-snug">{WEDDING_CONFIG.groomWords}</p>
          </Reveal>
        </div>

        <Reveal className="mt-16 max-w-2xl mx-auto text-center">
          <Heart className="w-6 h-6 mx-auto text-[#9d7537] fill-[#c69a58]/30 mb-3" />
          <blockquote className="font-serif-luxury text-2xl md:text-3xl italic font-medium text-[#2d241e] leading-snug">{WEDDING_CONFIG.quote}</blockquote>
          <span className="block mt-2 text-xs uppercase tracking-[0.25em] text-[#7c6d62] font-semibold">— {WEDDING_CONFIG.quoteAuthor}</span>
        </Reveal>
      </section>

      {/* Le grand jour : trois rendez-vous */}
      <section id="programme" className="max-w-5xl mx-auto px-4 scroll-mt-20">
        <SectionTitle kicker="Le grand jour" title={<>Trois moments, <span className="italic">un seul oui</span></>}>
          <p>
            Le {WEDDING_CONFIG.dateLong.toLowerCase()}, à Douala. Nous serions profondément heureux de vous avoir à nos
            côtés pour chacun de ces moments.
          </p>
        </SectionTitle>

        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <ol className="relative space-y-8" aria-label="Programme de la journée">
            <span className="absolute left-6 md:left-8 top-8 bottom-8 w-px bg-gradient-to-b from-[#c69a58]/10 via-[#c69a58] to-[#c69a58]/10" aria-hidden="true" />
            {WEDDING_CONFIG.schedule.map((item, idx) => (
              <ScheduleStep key={item.start} item={item} index={idx} />
            ))}
          </ol>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Reveal className="rounded-[1.6rem] bg-[#2a1d15] text-[#f6ead6] p-6 md:p-7 shadow-xl relative overflow-hidden">
              <span className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-[#c69a58]/20 blur-2xl" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#e2c27f] flex items-center gap-2"><Church className="w-4 h-4" /> Pour trouver l'église</p>
              <p className="font-serif-luxury text-2xl font-semibold mt-3 leading-snug">{WEDDING_CONFIG.locationName}</p>
              <p className="mt-1 text-sm text-[#e8dccb]">Mbangué, Douala</p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white/5 border border-[#c69a58]/30 p-4">
                <svg viewBox="0 0 32 28" className="mt-0.5 w-8 h-7 shrink-0" aria-hidden="true">
                  <path d="M16 2 2 13h4v13h20V13h4z" fill="#f6ead6" opacity=".9" />
                  <path d="M16 1 0 14h5L16 5l11 9h5z" fill="#c0392b" />
                  <path d="M14 26v-6h4v6" fill="#2a1d15" />
                  <path d="M16 0v4M14.5 1.5h3" stroke="#f6ead6" strokeWidth="1.2" />
                </svg>
                <p className="text-[15px] leading-relaxed">{WEDDING_CONFIG.directions}</p>
              </div>
              <p className="font-script text-3xl text-[#e2c27f] mt-4">on vous y attend à 15 h</p>
            </Reveal>
            <Reveal delay={120} className="card-luxury rounded-[1.6rem] p-6 text-[15px] text-[#4a3b30] leading-relaxed">
              <p className="flex items-start gap-2"><Sparkles className="w-4 h-4 mt-1 text-[#9d7537] shrink-0" /> {WEDDING_CONFIG.placesNote}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vidéo : chargée seulement après le clic */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-[#2a1d15] text-[#f6ead6] px-6 py-14 md:p-14 grid md:grid-cols-2 gap-10 items-center shadow-2xl">
          <Reveal className="text-center md:text-left">
            <p className="font-script text-3xl md:text-4xl text-[#e2c27f]">Nos petits moments</p>
            <h2 className="font-serif-luxury text-3xl md:text-4xl font-semibold mt-1 text-white">Un peu de nous, en images</h2>
            <HandUnderline className="md:!ml-0" />
            <p className="mt-4 text-[15px] leading-relaxed text-[#e8dccb]">
              Des fous rires, des selfies, des promesses… Quelques secondes de notre histoire, pour vous donner envie d'en écrire la suite avec nous.
            </p>
          </Reveal>
          <Reveal delay={120} className="mx-auto w-full max-w-[300px]">
            <div className="relative rounded-[1.8rem] overflow-hidden shadow-2xl ring-2 ring-[#c69a58] bg-black aspect-[9/16]">
              {!isVideoPlaying ? (
                <button type="button" onClick={() => setIsVideoPlaying(true)} className="group absolute inset-0 w-full h-full cursor-pointer" aria-label="Lire la vidéo de Michelle et Marcing">
                  <img src={WEDDING_CONFIG.assets.videoPoster} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 text-[#2a1d15] flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  </span>
                  <span className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">Appuyez pour regarder (avec le son)</span>
                </button>
              ) : (
                <video src={WEDDING_CONFIG.assets.videoUrl} controls autoPlay playsInline preload="metadata" className="w-full h-full object-cover" />
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
