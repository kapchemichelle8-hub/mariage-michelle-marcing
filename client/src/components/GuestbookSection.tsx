import { trpc } from "@/lib/trpc";
import { ChevronDown, ChevronUp, Heart, MessageSquareQuote } from "lucide-react";
import { useState } from "react";

export function GuestbookSection() {
  const { data: messages, isLoading } = trpc.wedding.getMessages.useQuery();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return <section className="py-12 text-center text-muted-foreground text-xs">Chargement des vœux d'amour…</section>;
  }

  if (!messages || messages.length === 0) return null;

  const visibleMessages = showAll ? messages : messages.slice(0, 3);

  return (
    <section className="py-16 px-4 bg-[#f8f3eb] border-y border-[#ebdcc8]/70">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537]">Mots doux & bénédictions</p>
          <h2 className="font-serif-luxury text-2xl md:text-3xl font-bold tracking-wide text-[#2d241e] mt-1 mb-2">Le Livre d'Or des Mariés</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Les tendres pensées partagées par nos familles et amis lors de leur confirmation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleMessages.map((item) => (
            <div key={item.id} className="card-luxury p-5 rounded-2xl flex flex-col justify-between border-[#ebdcc8] hover:border-[#c69a58] transition-all">
              <div><MessageSquareQuote className="w-5 h-5 text-[#c69a58] mb-2" /><p className="text-xs md:text-sm text-[#43352b] italic leading-relaxed mb-4">« {item.message} »</p></div>
              <div className="pt-3 border-t border-[#ebdcc8]/50 flex items-center justify-between text-xs"><span className="font-semibold text-[#855f24] truncate">{item.name}</span><Heart className="w-3.5 h-3.5 text-[#c69a58] fill-[#c69a58]/40 shrink-0" /></div>
            </div>
          ))}
        </div>

        {messages.length > 3 && (
          <div className="text-center mt-8">
            <button type="button" onClick={() => setShowAll((value) => !value)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#c69a58]/60 text-[#855f24] text-xs font-semibold hover:bg-white transition-colors cursor-pointer">
              {showAll ? <><ChevronUp className="w-4 h-4" /> Voir moins</> : <><ChevronDown className="w-4 h-4" /> Voir plus de mots doux</>}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
