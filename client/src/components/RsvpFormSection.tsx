import { trpc } from "@/lib/trpc";
import { Check, Heart, Loader2, Sparkles, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";
import { SectionTitle } from "./Ornaments";

export function RsvpFormSection() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [side, setSide] = useState<"bride" | "groom" | null>(null);
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");

  const submitMutation = trpc.wedding.submitRsvp.useMutation({
    onSuccess: (data) => {
      if (data.attendance === "yes") {
        toast.success("Merci ! Votre présence est confirmée.");
        setLocation(`/billet/${data.ticketCode}`);
      } else {
        toast.info("Merci, votre réponse est bien enregistrée.");
        setLocation("/indisponible");
      }
    },
    onError: (error) => toast.error(error.message || "Une erreur est survenue lors de l'enregistrement de votre réponse."),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Veuillez saisir votre nom complet.");
    if (!side) return toast.error("Dites-nous si vous venez du côté de la mariée ou du marié.");
    submitMutation.mutate({
      name: name.trim(),
      side,
      attendance,
      guestsCount: attendance === "yes" ? guestsCount : 1,
      message: message.trim() || undefined,
    });
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#faf7f2] relative scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <SectionTitle kicker="Votre réponse" title="Serez-vous des nôtres ?">
          <p>Dites-nous avant le <strong>{WEDDING_CONFIG.rsvpDeadline}</strong> si vous pourrez venir : cela nous aide énormément à tout préparer. Votre billet personnel vous attend juste après.</p>
        </SectionTitle>

        <form onSubmit={handleSubmit} className="card-luxury p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
          <div><label className="block text-sm font-semibold text-[#2d241e] mb-3">Serez-vous avec nous ? *</label><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={() => setAttendance("yes")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "yes" ? "border-[#c69a58] bg-[#fdf9f3] text-[#855f24] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}><div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "yes" ? "border-[#c69a58] bg-[#c69a58]" : "border-muted-foreground"}`}>{attendance === "yes" && <Check className="w-3 h-3 text-white" />}</div><span>Oui, je serai là avec joie</span></div><Sparkles className="w-4 h-4 text-[#c69a58]" /></button>
            <button type="button" onClick={() => setAttendance("no")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "no" ? "border-[#7c6d62] bg-[#f5f1eb] text-[#2d241e] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}><div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "no" ? "border-[#7c6d62] bg-[#7c6d62]" : "border-muted-foreground"}`}>{attendance === "no" && <Check className="w-3 h-3 text-white" />}</div><span>Je ne pourrai pas venir</span></div><X className="w-4 h-4 text-muted-foreground" /></button>
          </div></div>

          <div><label className="block text-sm font-semibold text-[#2d241e] mb-1.5">Votre nom complet ou nom de famille *</label><input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. : Famille Fokou" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" /></div>
          <div><label className="block text-sm font-semibold text-[#2d241e] mb-3">Vous venez… *</label><div className="grid grid-cols-2 gap-3 md:gap-4">
            {([["bride", "Côté de la mariée"], ["groom", "Côté du marié"]] as const).map(([value, label]) => <button key={value} type="button" onClick={() => setSide(value)} aria-pressed={side === value} className={`min-h-[56px] px-4 py-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-[15px] font-semibold transition-all cursor-pointer ${side === value ? "border-[#c69a58] bg-[#fdf6ea] text-[#6c4b1a] shadow-md" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]/60"}`}>{side === value && <Check className="w-4 h-4" />}{label}</button>)}
          </div></div>

          {attendance === "yes" && <div className="bg-[#fcfaf7] border border-[#ebdcc8] p-4 rounded-2xl"><label className="block text-sm font-semibold text-[#2d241e] mb-2">Nombre total de personnes participantes (vous inclus) *</label><div className="flex items-center gap-3">{[1, 2, 3, 4, 5].map((num) => <button key={num} type="button" onClick={() => setGuestsCount(num)} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${guestsCount === num ? "gold-gradient text-white shadow-sm border-transparent" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]"}`}>{num} {num === 5 ? "+" : ""}</button>)}</div><p className="text-[11px] text-muted-foreground mt-2">Cela nous permet de prévoir une place à table pour chacun.</p></div>}

          <div><label className="block text-sm font-semibold text-[#2d241e] mb-1.5 flex items-center justify-between"><span>Un mot doux ou une bénédiction (facultatif)</span><Heart className="w-3.5 h-3.5 text-[#9d7537]" /></label><textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Il apparaîtra dans notre livre d’or…" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" /></div>
          <button type="submit" disabled={submitMutation.isPending} className="w-full py-4 min-h-[52px] rounded-full gold-gradient text-white font-semibold tracking-wide text-base shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">{submitMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours…</> : attendance === "yes" ? <><UserCheck className="w-4 h-4" /> Je confirme et je reçois mon billet</> : <>Envoyer ma réponse</>}</button>
        </form>
      </div>
    </section>
  );
}
