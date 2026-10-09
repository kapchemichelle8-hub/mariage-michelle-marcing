import { trpc } from "@/lib/trpc";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useState } from "react";
import { Reveal, SectionTitle } from "./Ornaments";

export function GuestbookSection() {
  const { data: messages, isLoading } = trpc.wedding.getMessages.useQuery();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return <section className="py-12 text-center text-muted-foreground text-xs">Chargement des vœux d'amour…</section>;
  }

  if (!messages || messages.length === 0) return null;

  const visibleMessages = showAll ? messages : messages.slice(0, 3);

  return (
    <section className="py-24 px-4 bg-[#f8f3eb] border-y border-[#ebdcc8]/70">
      <div className="max-w-5xl mx-auto">
        <SectionTitle kicker="Mots doux & bénédictions" title="Notre livre d’or">
          <p>Chaque mot que vous nous laissez, nous le lisons, nous le relisons, et nous le gardons précieusement.</p>
        </SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {visibleMessages.map((item, index) => (
            <Reveal
              key={item.id}
              delay={(index % 3) * 90}
              className={`card-luxury relative p-6 rounded-[1.4rem] flex flex-col justify-between overflow-hidden ${
                index % 3 === 1 ? "lg:translate-y-4" : ""
              }`}
            >
              <span className="absolute -top-3 left-5 font-serif-luxury text-6xl leading-none text-[#c69a58]/50 select-none pointer-events-none" aria-hidden="true">
                “
              </span>
              <p className="font-serif-luxury text-base md:text-lg italic text-[#2d241e] leading-relaxed mt-3 mb-5 break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-pre-line">
                {item.message}
              </p>
              <div className="pt-3 border-t border-dashed border-[#e1cfb5] flex items-center justify-between gap-2 text-sm mt-auto">
                <span className="font-semibold text-[#6c4b1a] truncate">{item.name}</span>
                <Heart className="w-4 h-4 text-[#c69a58] fill-[#c69a58]/40 shrink-0" />
              </div>
            </Reveal>
          ))}
        </div>

        {messages.length > 3 && (
          <div className="text-center mt-12">
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#c69a58] text-[#855f24] text-sm font-semibold hover:bg-white transition-colors cursor-pointer"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Lire d’autres mots doux ({messages.length - 3} de plus)
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
