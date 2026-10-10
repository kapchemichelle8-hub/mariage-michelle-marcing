import { trpc } from "@/lib/trpc";
import { Check, Heart, Loader2, Sparkles, UserCheck, Users, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";
import { SectionTitle } from "./Ornaments";

type EventChoice = "civil" | "church" | "party";

const EVENT_OPTIONS: { id: EventChoice; label: string; time: string; sub: string }[] = [
  { id: "civil", label: "Mairie", time: "13 h 00", sub: "Consentements civils" },
  { id: "church", label: "Église", time: "15 h 00", sub: "Messe d’action de grâce" },
  { id: "party", label: "Soirée", time: "20 h 00", sub: "Fête & réception" },
];

export function RsvpFormSection() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [side, setSide] = useState<"bride" | "groom" | null>(null);
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [selectedEvents, setSelectedEvents] = useState<EventChoice[]>([]);
  const [guestsCount, setGuestsCount] = useState<1 | 2>(1);
  const [message, setMessage] = useState("");

  const toggleEvent = (eventId: EventChoice) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

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
    if (attendance === "yes" && selectedEvents.length === 0) {
      return toast.error("Veuillez sélectionner au moins un moment : mairie, église ou soirée.");
    }

    submitMutation.mutate({
      name: name.trim(),
      side,
      attendance,
      events: attendance === "yes" ? selectedEvents : undefined,
      guestsCount: attendance === "yes" ? guestsCount : 1,
      message: message.trim() || undefined,
    });
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#faf7f2] relative scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <SectionTitle kicker="Votre réponse" title="Serez-vous des nôtres ?">
          <p>
            Dites-nous avant le <strong>{WEDDING_CONFIG.rsvpDeadline}</strong> si vous pourrez venir : cela nous aide énormément à tout préparer. Votre billet personnel vous attend juste après.
          </p>
        </SectionTitle>

        <form onSubmit={handleSubmit} className="card-luxury p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#2d241e] mb-3">Serez-vous avec nous ? *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button type="button" onClick={() => setAttendance("yes")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "yes" ? "border-[#c69a58] bg-[#fdf9f3] text-[#855f24] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}>
                <div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "yes" ? "border-[#c69a58] bg-[#c69a58]" : "border-muted-foreground"}`}>{attendance === "yes" && <Check className="w-3 h-3 text-white" />}</div><span>Oui, je serai là avec joie</span></div>
                <Sparkles className="w-4 h-4 text-[#c69a58]" />
              </button>
              <button type="button" onClick={() => setAttendance("no")} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "no" ? "border-[#7c6d62] bg-[#f5f1eb] text-[#2d241e] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}>
                <div className="flex items-center gap-3"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "no" ? "border-[#7c6d62] bg-[#7c6d62]" : "border-muted-foreground"}`}>{attendance === "no" && <Check className="w-3 h-3 text-white" />}</div><span>Je ne pourrai pas venir</span></div>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2d241e] mb-1.5">Votre nom complet ou nom de famille *</label>
            <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. : Famille Fokou" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2d241e] mb-3">Vous venez… *</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {([['bride', 'Côté de la mariée'], ['groom', 'Côté du marié']] as const).map(([value, label]) => (
                <button key={value} type="button" onClick={() => setSide(value)} aria-pressed={side === value} className={`min-h-[56px] px-4 py-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-[15px] font-semibold transition-all cursor-pointer ${side === value ? "border-[#c69a58] bg-[#fdf6ea] text-[#6c4b1a] shadow-md" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]/60"}`}>
                  {side === value && <Check className="w-4 h-4" />}{label}
                </button>
              ))}
            </div>
          </div>

          {attendance === "yes" && (
            <div className="bg-[#fcfaf7] border border-[#ebdcc8] p-5 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2d241e] mb-1">À quels moments serons-nous réunis ? *</label>
                <p className="text-xs text-[#7c6d62] mb-3">Sélectionnez vous-même la mairie, l’église, la soirée, ou plusieurs moments.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EVENT_OPTIONS.map((evt) => {
                    const isChecked = selectedEvents.includes(evt.id);
                    return <button key={evt.id} type="button" onClick={() => toggleEvent(evt.id)} aria-pressed={isChecked} className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${isChecked ? "border-[#c69a58] bg-[#fbf5e9] text-[#6c4b1a] shadow-sm" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]/60"}`}>
                      <div className="flex items-center justify-between mb-1"><span className="font-serif-luxury text-base font-bold">{evt.label}</span><div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isChecked ? "border-[#c69a58] bg-[#c69a58] text-white" : "border-[#ebdcc8]"}`}>{isChecked && <Check className="w-3 h-3" />}</div></div>
                      <span className="text-[11px] font-semibold text-[#9d7537]">{evt.time}</span><span className="text-[10px] text-muted-foreground mt-0.5">{evt.sub}</span>
                    </button>;
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#ebdcc8]/70">
                <label className="block text-sm font-semibold text-[#2d241e] mb-2">Vous viendrez… *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 1 as const, label: "Seul(e)", sub: "Une place" }, { value: 2 as const, label: "En couple", sub: "Deux places" }].map((option) => (
                    <button key={option.value} type="button" onClick={() => setGuestsCount(option.value)} aria-pressed={guestsCount === option.value} className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${guestsCount === option.value ? "gold-gradient text-white border-transparent shadow-sm" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]"}`}>
                      <span className="flex items-center gap-2 font-semibold"><Users className="w-4 h-4" /> {option.label}</span><span className={`block text-[11px] mt-1 ${guestsCount === option.value ? "text-white/80" : "text-muted-foreground"}`}>{option.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#2d241e] mb-1.5 flex items-center justify-between"><span>Un mot doux ou une bénédiction (facultatif)</span><Heart className="w-3.5 h-3.5 text-[#9d7537]" /></label>
            <textarea rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Il apparaîtra dans notre livre d’or…" className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm" />
          </div>

          <button type="submit" disabled={submitMutation.isPending} className="w-full py-4 min-h-[52px] rounded-full gold-gradient text-white font-semibold tracking-wide text-base shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-center">
            {submitMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin shrink-0" /><span>Envoi en cours…</span></> : attendance === "yes" ? <><UserCheck className="w-4 h-4 shrink-0" /><span>Je confirme et je reçois mon billet</span></> : <span>Envoyer ma réponse</span>}
          </button>
        </form>
      </div>
    </section>
  );
}
