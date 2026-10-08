import { media, story } from "@/weddingConfig";
import { FloralDivider, HeartPortrait } from "./Ornaments";
import { Reveal } from "./Reveal";

export function LoveStorySection() {
  return (
    <section id="histoire" className="bg-cream/60 px-5 py-20 sm:py-24" aria-labelledby="story-title">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow">Notre histoire</p>
          <h2 id="story-title" className="mt-2 text-4xl sm:text-5xl">
            Deux cœurs, un même chemin
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          <Reveal className="flex flex-col items-center text-center md:items-start md:text-left">
            <HeartPortrait src={media.michelle} alt="Michelle, la mariée" className="w-40 -rotate-2" />
            <h3 className="script mt-4 text-5xl text-gold-deep">Michelle</h3>
            <p className="mt-3 max-w-sm font-serif text-lg leading-relaxed text-ink">{story.michelle}</p>
          </Reveal>
          <Reveal
            delay={150}
            className="flex flex-col items-center text-center md:mt-24 md:items-end md:text-right"
          >
            <HeartPortrait src={media.marcing} alt="Marcing, le marié" className="w-40 rotate-2" />
            <h3 className="script mt-4 text-5xl text-gold-deep">Marcing</h3>
            <p className="mt-3 max-w-sm font-serif text-lg leading-relaxed text-ink">{story.marcing}</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl text-center">
          <FloralDivider />
          <blockquote className="mt-6 font-serif text-2xl italic leading-snug text-cocoa sm:text-3xl">
            {story.quote}
          </blockquote>
          <p className="mt-6 text-base leading-relaxed text-ink/90 sm:text-lg">{story.together}</p>
          <p className="script mt-6 text-3xl text-gold-deep">Michelle &amp; Marcing</p>
        </Reveal>
      </div>
    </section>
  );
}
