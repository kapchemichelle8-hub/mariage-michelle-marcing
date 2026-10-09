import { media, wedding } from "@/weddingConfig";
import { DovesHeart, Petals, Portrait } from "./Ornaments";

export function HeroSection() {
  return (
    <section id="accueil" className="relative">
      <div className="night relative isolate min-h-[100svh] overflow-hidden">
        <div className="mx-auto grid min-h-[100svh] max-w-6xl lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-14 lg:px-8">
          {/* Photo : plein écran sur mobile, arche encadrée d'or sur ordinateur */}
          <div className="absolute inset-0 lg:relative lg:order-2 lg:h-[80vh] lg:max-h-[780px]">
            <div className="h-full w-full lg:rounded-t-[999px] lg:rounded-b-[2rem] lg:bg-gradient-to-b lg:from-gold-soft lg:via-gold lg:to-gold-deep lg:p-[3px] lg:shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)]">
              <img
                src={media.hero.small}
                srcSet={`${media.hero.small} 720w, ${media.hero.large} 1200w`}
                sizes="(min-width: 1024px) 42vw, 100vw"
                width={media.hero.width}
                height={media.hero.height}
                alt="Michelle et Marcing en tenue traditionnelle ivoire et or, Marcing embrassant tendrement Michelle"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-[50%_22%] lg:rounded-t-[999px] lg:rounded-b-[calc(2rem-3px)]"
              />
            </div>
          </div>
          {/* Voile uniquement en bas, pour garder la photo lumineuse */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(28_20_16/0.5)_0%,transparent_14%,transparent_27%,rgb(28_20_16/0.78)_46%,rgb(28_20_16/0.95)_68%,#1c1410_100%)] lg:hidden" />

          <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-5 pb-32 pt-24 min-[400px]:pb-36 text-center [text-shadow:0_2px_16px_rgb(0_0_0/0.45)] sm:pb-44 lg:order-1 lg:min-h-0 lg:items-start lg:justify-center lg:pb-0 lg:text-left lg:[text-shadow:none]">
            <DovesHeart className="soft-float mb-3 h-8 w-28 text-gold-soft lg:mb-5 lg:h-12 lg:w-40" />
            <p className="eyebrow !text-[0.66rem] !tracking-[0.24em] !text-gold-soft sm:!text-xs sm:!tracking-[0.3em]">
              Avec la bénédiction de nos familles
            </p>
            <h1 className="mt-2 [filter:drop-shadow(0_2px_8px_rgb(0_0_0/0.65))] lg:mt-4 lg:[filter:none]">
              <span className="script gold-text block pb-1 text-[3.5rem] leading-[1.02] sm:text-7xl lg:text-[6rem]">
                Michelle
              </span>
              <span className="block font-display text-2xl italic leading-none text-gold-soft lg:text-4xl">&amp;</span>
              <span className="script gold-text block pb-1 text-[3.5rem] leading-[1.02] sm:text-7xl lg:text-[6rem]">
                Marcing
              </span>
            </h1>
            <p className="mt-3 max-w-md font-display text-lg italic leading-snug text-ivory sm:mt-5 sm:text-2xl">
              Nous nous disons oui, et nous aimerions tant que vous soyez là.
            </p>
            <div className="mt-4 flex items-center gap-3 sm:mt-6">
              <span className="h-px w-8 bg-gold-soft/70" aria-hidden="true" />
              <p className="font-display text-xl tracking-[0.18em] text-gold-soft sm:text-2xl">{wedding.shortDate}</p>
              <span className="h-px w-8 bg-gold-soft/70" aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.3em] text-ivory">
              {wedding.city} · {wedding.country}
            </p>
            <p className="mt-3 hidden text-sm text-ivory/90 lg:block">{wedding.title}</p>
            <a href="#rsvp" className="btn-gold mt-5 max-[399px]:!hidden sm:mt-7">
              Confirmer ma présence
            </a>
          </div>
        </div>
        <Petals />
      </div>

      {/* Médaillons des mariés à la jonction avec la section suivante */}
      <div className="relative z-20 -mt-24 flex items-center justify-center gap-3 px-4 sm:-mt-28 sm:gap-6">
        <div className="flex flex-col items-center">
          <Portrait src={media.michelle} alt="Portrait de Michelle" loading="eager" className="w-32 sm:w-44" />
        </div>
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cocoa text-gold-soft shadow-lg ring-2 ring-gold sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <span className="script text-3xl leading-none sm:text-4xl">&amp;</span>
        </span>
        <div className="flex flex-col items-center">
          <Portrait src={media.marcing} alt="Portrait de Marcing" loading="eager" className="w-32 sm:w-44" />
        </div>
      </div>
    </section>
  );
}
