import { Copy, Gift, Heart, Phone } from "lucide-react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export function GiftsSection() {
  const copyNumber = async (number: string) => {
    await navigator.clipboard.writeText(number);
    toast.success(`Numéro ${number} copié`);
  };

  return (
    <section className="py-20 px-4 bg-[#f4ede1] border-y border-[#ebdcc8]/70">
      <div className="max-w-3xl mx-auto text-center">
        <div className="gift-ornament flex items-center justify-center gap-2 text-[#9d7537] mb-5" aria-hidden="true">
          <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
        </div>
        <p className="font-script text-4xl text-[#9d7537]">{WEDDING_CONFIG.gifts.title}</p>
        <h2 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#2d241e] mt-2 mb-5">Votre affection est notre plus beau cadeau</h2>
        <p className="text-sm md:text-base text-[#6f5c4c] leading-relaxed max-w-2xl mx-auto">
          {WEDDING_CONFIG.gifts.intro}
        </p>

        <div className="card-luxury mt-8 rounded-3xl p-6 md:p-8 text-left max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#f8eedd] flex items-center justify-center"><Gift className="w-6 h-6 text-[#9d7537]" /></div>
            <div><p className="text-xs uppercase tracking-widest text-[#9d7537] font-semibold">Contribution mobile</p><p className="font-serif-luxury text-lg font-bold text-[#2d241e]">{WEDDING_CONFIG.gifts.recipient}</p></div>
          </div>
          <div className="space-y-3">
            {WEDDING_CONFIG.gifts.numbers.map((number) => (
              <div key={number} className="flex items-center justify-between gap-3 rounded-2xl bg-[#faf7f2] border border-[#ebdcc8] px-4 py-3">
                <a href={`tel:${number}`} className="flex items-center gap-2 font-serif-luxury text-lg font-bold tracking-wider text-[#855f24] hover:underline"><Phone className="w-4 h-4" />{number}</a>
                <button type="button" onClick={() => copyNumber(number)} className="p-2 rounded-full text-[#9d7537] hover:bg-[#f4ede1] transition-colors cursor-pointer" aria-label={`Copier le numéro ${number}`}><Copy className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>

        <p className="font-script text-2xl text-[#9d7537] mt-8 flex items-center justify-center gap-2"><Heart className="w-4 h-4 fill-[#c69a58]" /> {WEDDING_CONFIG.gifts.closing} <Heart className="w-4 h-4 fill-[#c69a58]" /></p>
      </div>
    </section>
  );
}
