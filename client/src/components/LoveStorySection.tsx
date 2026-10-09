import { media, story } from "@/weddingConfig";
import { FloralDivider, Portrait } from "./Ornaments";
import { Reveal } from "./Reveal";

export function LoveStorySection() {
  return (
    <section id="histoire" className="bg-cream px-5 pb-20 pt-24 sm:pb-28 sm:pt-28" aria-labelledby="story-title">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="eyebrow">Notre histoire</p>
          <h2 id="story-title" className="mt-2 text-4xl sm:text-5xl">
            Deux cœurs, un même chemin
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-10">
          <Reveal className="flex flex-col items-center text-center md:items-start md:text-left">
            <Portrait src={media.michelle} alt="Michelle, la mariée" className="w-44 sm:w-52" />
            <h3 className="script gold-text-deep mt-5 pb-1 text-6xl">Michelle</h3>
            <p className="mt-3 max-w-sm font-serif text-xl leading-relaxed text-ink">{story.michelle}</p>
          </Reveal>
          <Reveal
            delay={150}
            className="flex flex-col items-center text-center md:mt-24 md:items-end md:text-right"
          >
            <Portrait src={media.marcing} alt="Marcing, le marié" className="w-44 sm:w-52" />
            <h3 className="script gold-text-deep mt-5 pb-1 text-6xl">Marcing</h3>
            <p className="mt-3 max-w-sm font-serif text-xl leading-relaxed text-ink">{story.marcing}</p>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl text-center">
          <FloralDivider />
          <blockquote className="mt-6 font-display text-2xl italic leading-snug text-ink sm:text-3xl">
            {story.quote}
          </blockquote>
          <p className="mt-6 text-base leading-relaxed text-ink sm:text-lg">{story.together}</p>
          <p className="script mt-6 text-3xl text-gold-deep">Michelle &amp; Marcing</p>
        </Reveal>
      </div>
    </section>
  );
}
