import { useState } from "react";
import { gifts, media } from "@/weddingConfig";
import { Reveal } from "./Reveal";

function CopyNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* copie impossible : le numéro reste lisible à l'écran */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-gold/50 bg-white px-4 py-3 shadow-sm">
      <a href={`tel:${number.replace(/\s/g, "")}`} className="font-display text-2xl font-medium tracking-wider text-ink">
        {number}
      </a>
      <button
        type="button"
        onClick={copy}
        className="min-h-[44px] min-w-[72px] rounded-full border-[1.5px] border-gold px-3 text-sm font-medium text-gold-deep transition-colors hover:bg-cream"
        aria-label={`Copier le numéro ${number}`}
      >
        <span aria-live="polite">{copied ? "Copié ✓" : "Copier"}</span>
      </button>
    </div>
  );
}

export function GiftsSection() {
  return (
    <section id="cadeaux" className="bg-cream px-5 py-20 sm:py-28" aria-labelledby="gifts-title">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="order-2 md:order-1">
          <img
            src={media.table}
            width={720}
            height={1079}
            loading="lazy"
            decoding="async"
            alt="Table de fête dressée avec une assiette dorée, un menu calligraphié et des roses"
            className="depth mx-auto aspect-[4/5] w-full max-w-xs rounded-t-[999px] rounded-b-[1.6rem] object-cover shadow-[0_24px_50px_-30px_rgb(59_38_24/0.8)] md:max-w-none"
          />
        </Reveal>
        <Reveal delay={100} className="order-1 text-center md:order-2 md:text-left">
          <p className="eyebrow">Dons &amp; cadeaux</p>
          <h2 id="gifts-title" className="mt-2 text-4xl sm:text-5xl">
            Votre présence est déjà un cadeau
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">
            Vraiment. Venir jusqu’à Bandjoun, prier pour nous, nous envoyer un mot : c’est ce qui
            compte le plus. Si toutefois vous souhaitez nous accompagner autrement, une contribution
            volontaire sera reçue avec beaucoup de gratitude.
          </p>
          <div className="mt-7 space-y-3 text-left">
            <p className="text-sm text-muted">
              Au nom de <strong className="font-medium text-cocoa">{gifts.beneficiary}</strong>
            </p>
            {gifts.numbers.map((n) => (
              <CopyNumber key={n} number={n} />
            ))}
          </div>
          <p className="script mt-6 text-3xl text-gold-deep">Merci du fond du cœur</p>
        </Reveal>
      </div>
    </section>
  );
}
