import { useState } from "react";
import { media } from "@/weddingConfig";
import { Reveal } from "./Reveal";

/** La vidéo n'est téléchargée qu'après un clic sur « Lecture ». */
export function VideoSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="bg-cocoa px-5 py-20 text-ivory sm:py-24" aria-labelledby="video-title">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <Reveal className="text-center md:text-left">
          <p className="eyebrow !text-gold-soft">Nos moments</p>
          <h2 id="video-title" className="mt-2 text-4xl !text-ivory sm:text-5xl">
            Quelques souvenirs avant le grand jour
          </h2>
          <p className="mt-4 font-serif text-xl italic text-ivory/80">
            Des sourires, des selfies, des bagues… et beaucoup d’amour. Merci de faire partie de notre
            histoire.
          </p>
        </Reveal>
        <Reveal delay={120} className="mx-auto w-full max-w-[300px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] bg-black shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-1 ring-gold/40">
            {playing ? (
              <video
                src={media.video}
                poster={media.videoPoster}
                className="h-full w-full object-cover"
                controls
                autoPlay
                playsInline
              >
                Votre navigateur ne peut pas lire cette vidéo.
              </video>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label="Lire la vidéo de Michelle et Marcing (30 secondes)"
              >
                <img
                  src={media.videoPoster}
                  alt=""
                  width={406}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-cocoa shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
                <span className="absolute bottom-4 left-0 right-0 text-center text-sm text-ivory/90">
                  Appuyez pour lire · 30 s
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
