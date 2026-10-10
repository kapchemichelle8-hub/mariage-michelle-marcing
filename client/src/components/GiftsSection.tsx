import { Check, Copy, Gift, Heart, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";
import { Reveal, SectionTitle } from "./Ornaments";

function CopyRow({ value, label, href, icon }: { value: string; label: string; href: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const isEmail = value.includes("@");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copié`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copie impossible, vous pouvez le recopier à la main.");
    }
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 rounded-2xl bg-white border border-[#e1cfb5] px-3.5 py-3 shadow-sm">
      <a href={href} className="flex min-w-0 flex-1 items-center justify-center sm:justify-start gap-2.5 text-[#2d241e] hover:text-[#855f24] text-center sm:text-left">
        <span className="text-[#9d7537] shrink-0">{icon}</span>
        <span className={`font-sans-clean font-mono text-base sm:text-lg md:text-xl font-bold ${isEmail ? "break-all tracking-normal" : "whitespace-nowrap tracking-[0.06em]"}`}>{value}</span>
      </a>
      <button type="button" onClick={copy} className="min-h-[40px] w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full border border-[#c69a58] px-3 text-xs font-semibold text-[#855f24] hover:bg-[#f4ede1] transition-colors cursor-pointer" aria-label={`Copier ${label}`}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? "Copié" : "Copier"}</span>
      </button>
    </div>
  );
}

export function GiftsSection() {
  const { gifts } = WEDDING_CONFIG;
  return (
    <section id="cadeaux" className="py-24 px-4 bg-[#f4ede1] border-y border-[#ebdcc8]/70 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <SectionTitle kicker="Avec gratitude" title={gifts.title}>
          <p>{gifts.intro}</p>
        </SectionTitle>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="card-luxury rounded-[1.6rem] p-6 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-full bg-[#2a1d15] text-[#f3dfb2] flex items-center justify-center"><Phone className="w-5 h-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#855f24] font-semibold">Transfert d’argent · Cameroun</p>
                <p className="font-serif-luxury text-xl font-semibold text-[#2d241e]">{gifts.recipient}</p>
              </div>
            </div>
            <div className="space-y-3">
              {gifts.numbers.map((n) => <CopyRow key={n} value={n} label={`Le numéro ${n}`} href={`tel:${n}`} icon={<Phone className="w-4 h-4" />} />)}
            </div>
          </Reveal>

          <Reveal delay={120} className="card-luxury rounded-[1.6rem] p-6 md:p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-full bg-[#2a1d15] text-[#f3dfb2] flex items-center justify-center"><Gift className="w-5 h-5" /></span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#855f24] font-semibold">Virement Interac</p>
                <p className="font-serif-luxury text-xl font-semibold text-[#2d241e]">Adresse courriel</p>
              </div>
            </div>
            <CopyRow value={gifts.interac} label="L'adresse Interac" href={`mailto:${gifts.interac}`} icon={<Mail className="w-4 h-4" />} />
          </Reveal>
        </div>

        <Reveal className="text-center mt-10">
          <p className="font-script text-3xl text-[#9d7537] inline-flex items-center gap-2"><Heart className="w-4 h-4 fill-[#c69a58] text-[#c69a58]" /> {gifts.closing} <Heart className="w-4 h-4 fill-[#c69a58] text-[#c69a58]" /></p>
        </Reveal>
      </div>
    </section>
  );
}
