import { media, wedding } from "@/weddingConfig";
import { DovesHeart, HeartPortrait, Petals } from "./Ornaments";

export function HeroSection() {
  return (
    <section id="accueil" className="relative">
      <div className="relative isolate min-h-[100svh] overflow-hidden bg-cocoa">
        {/* Même fichier que la photo principale : le navigateur ne le charge qu'une fois */}
        <img
          src={media.hero.small}
          srcSet={`${media.hero.small} 720w, ${media.hero.large} 1200w`}
          sizes="(min-width: 1024px) 45vw, 100vw"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-50 blur-2xl lg:block"
        />
        <div className="mx-auto grid min-h-[100svh] max-w-6xl lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-6">
          <div className="absolute inset-0 lg:relative lg:order-2 lg:h-[78vh] lg:max-h-[760px]">
            <img
              src={media.hero.small}
              srcSet={`${media.hero.small} 720w, ${media.hero.large} 1200w`}
              sizes="(min-width: 1024px) 45vw, 100vw"
              width={media.hero.width}
              height={media.hero.height}
              alt="Michelle et Marcing en tenue traditionnelle ivoire et or, Marcing embrassant tendrement Michelle"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover object-[50%_22%] lg:rounded-t-[999px] lg:rounded-b-[2rem] lg:shadow-[0_30px_60px_-25px_rgb(0_0_0/0.6)] lg:ring-1 lg:ring-gold/50"
            />
          </div>
          {/* Voile chaud pour la lisibilité */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(59_38_24/0.45)_0%,transparent_22%,transparent_38%,rgb(59_38_24/0.82)_62%,rgb(59_38_24/0.96)_100%)] lg:hidden" />

          <div className="relative z-10 flex min-h-[100svh] flex-col [text-shadow:0_1px_14px_rgb(30_18_10/0.45)] items-center justify-end px-5 pb-32 pt-24 sm:pb-40 text-center text-ivory lg:order-1 lg:min-h-0 lg:items-start lg:justify-center lg:pb-0 lg:text-left">
            <DovesHeart className="soft-float mb-2 h-8 w-28 text-gold-soft drop-shadow lg:mb-4 lg:h-12 lg:w-40" />
            <p className="eyebrow !text-[0.62rem] !tracking-[0.22em] !text-gold-soft sm:!text-[0.72rem] sm:!tracking-[0.32em]">
              Avec la bénédiction de nos familles
            </p>
            <h1 className="mt-2 !text-ivory lg:mt-3">
              <span className="script block text-[3.2rem] leading-[1] sm:text-7xl lg:text-[5.6rem]">
                Michelle
              </span>
              <span className="font-serif text-2xl italic leading-none text-gold-soft lg:text-4xl">&amp;</span>
              <span className="script block text-[3.2rem] leading-[1] sm:text-7xl lg:text-[5.6rem]">
                Marcing
              </span>
            </h1>
            <p className="mt-3 max-w-md font-serif text-lg leading-snug text-ivory/95 sm:mt-5 sm:text-2xl">
              Nous nous disons oui, et nous aimerions tant que vous soyez là.
            </p>
            <div className="mt-3 flex flex-col items-center gap-0.5 sm:mt-6 lg:items-start">
              <p className="font-serif text-xl tracking-[0.2em] text-gold-soft sm:text-2xl">{wedding.shortDate}</p>
              <p className="eyebrow !text-ivory/85">
                {wedding.city} · {wedding.country}
              </p>
            </div>
            <p className="mt-3 hidden text-sm text-ivory/75 sm:block">{wedding.title}</p>
          </div>
        </div>
        <Petals />
      </div>

      {/* Portraits en cœurs à la jonction avec la section suivante */}
      <div className="relative z-20 -mt-28 flex items-end justify-center gap-2 px-4 sm:-mt-32 sm:gap-5">
        <HeartPortrait
          src={media.michelle}
          alt="Portrait de Michelle"
          loading="eager"
          className="w-32 -rotate-3 sm:w-44"
        />
        <span className="script mb-10 text-4xl text-gold sm:text-5xl" aria-hidden="true">
          &amp;
        </span>
        <HeartPortrait
          src={media.marcing}
          alt="Portrait de Marcing"
          loading="eager"
          className="w-32 rotate-3 sm:w-44"
        />
      </div>
    </section>
  );
}
