import { trpc } from "@/lib/trpc";
import { Check, Heart, Loader2, Sparkles, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export function RsvpFormSection() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");

  const submitMutation = trpc.wedding.submitRsvp.useMutation({
    onSuccess: (data) => {
      if (data.attendance === "yes") {
        toast.success("Votre présence est confirmée !");
        setLocation(`/billet/${data.ticketCode}`);
      } else {
        toast.info("Votre réponse a bien été enregistrée.");
        setLocation("/indisponible");
      }
    },
    onError: (error) => toast.error(error.message || "Une erreur est survenue lors de l'enregistrement de votre réponse."),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return toast.error("Veuillez saisir votre nom complet.");
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim() || undefined,
      attendance,
      guestsCount: attendance === "yes" ? guestsCount : 1,
      message: message.trim() || undefined,
    });
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-[#faf7f2] relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10"><p className="font-script text-3xl md:text-4xl text-[#9d7537]">Votre présence compte</p><h2 className="font-serif-luxury text-2xl md:text-4xl font-bold tracking-wide text-[#2d241e] mt-1 mb-3">Pourriez-vous vous joindre à nous ?</h2><p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">Une réponse de votre part avant le <strong>{WEDDING_CONFIG.rsvpDeadline}</strong> nous aidera grandement dans l'organisation afin que cette fête soit mémorable pour tous.</p></div>

        <form onSubmit={handleSubmit} className="card-luxury p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[#7c6d62] mb-3">Serez-vous avec nous pour célébrer notre dot ? *</label><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button type="button" onClick={() => setAttendance("yes")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "yes" ? "border-[#c69a58] bg-[#fdf9f3] text-[#855f24] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}><div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "yes" ? "border-[#c69a58] bg-[#c69a58]" : "border-muted-foreground"}`}>{attendance === "yes" && <Check className="w-3 h-3 text-white" />}</div><span>Oui, avec grand plaisir !</span></div><Sparkles className="w-4 h-4 text-[#c69a58]" /></button>
            <button type="button" onClick={() => setAttendance("no")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "no" ? "border-[#7c6d62] bg-[#f5f1eb] text-[#2d241e] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}><div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "no" ? "border-[#7c6d62] bg-[#7c6d62]" : "border-muted-foreground"}`}>{attendance === "no" && <Check className="w-3 h-3 text-white" />}</div><span>Avec regret, je ne pourrai pas venir</span></div><X className="w-4 h-4 text-muted-foreground" /></button>
          </div></div>

          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[#7c6d62] mb-1.5">Votre nom complet ou nom de famille *</label><input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. : M. et Mme Fokou ou Michelle Ngassa" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" /></div>
          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[#7c6d62] mb-1.5">Adresse e-mail (facultative)</label><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Pour recevoir une copie de votre billet PDF" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" /></div>

          {attendance === "yes" && <div className="bg-[#fcfaf7] border border-[#ebdcc8] p-4 rounded-2xl"><label className="block text-xs font-semibold uppercase tracking-wider text-[#7c6d62] mb-2">Nombre total de personnes participantes (vous inclus) *</label><div className="flex items-center gap-3">{[1, 2, 3, 4, 5].map((num) => <button key={num} type="button" onClick={() => setGuestsCount(num)} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${guestsCount === num ? "gold-gradient text-white shadow-sm border-transparent" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]"}`}>{num} {num === 5 ? "+" : ""}</button>)}</div><p className="text-[11px] text-muted-foreground mt-2">Ce décompte précis permet aux mariés et aux traiteurs de prévoir les places assises et le buffet.</p></div>}

          <div><label className="block text-xs font-semibold uppercase tracking-wider text-[#7c6d62] mb-1.5 flex items-center justify-between"><span>Un mot d'amour ou une bénédiction pour le couple</span><Heart className="w-3.5 h-3.5 text-[#9d7537]" /></label><textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Laissez vos vœux de bonheur à Michelle & Marcing…" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" /></div>
          <button type="submit" disabled={submitMutation.isPending} className="w-full py-4 rounded-full gold-gradient text-white font-serif-luxury font-bold tracking-wider uppercase text-sm shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">{submitMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement en cours…</> : attendance === "yes" ? <><UserCheck className="w-4 h-4" /> Confirmer ma présence & obtenir mon billet</> : <>Envoyer ma réponse</>}</button>
        </form>
      </div>
    </section>
  );
}
