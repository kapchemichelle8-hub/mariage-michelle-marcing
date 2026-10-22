import { trpc } from "@/lib/trpc";
import {
  Check,
  Heart,
  Loader2,
  MapPin,
  Sparkles,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";
import { SectionTitle } from "./Ornaments";

type EventChoice = "civil" | "church" | "party";
type VerifiedInvite = {
  recognized: true;
  code: string;
  side: "bride" | "groom";
  tableNumber: string | null;
  tableVirtue: string | null;
};

const EVENT_OPTIONS: {
  id: EventChoice;
  label: string;
  time: string;
  sub: string;
}[] = [
  { id: "civil", label: "Mariage civil", time: "13 h 00", sub: "Consentements civils" },
  { id: "church", label: "Bénédiction nuptiale", time: "15 h 00", sub: "Célébration nuptiale" },
  { id: "party", label: "Soirée", time: "20 h 00", sub: "Fête & réception" },
];

export function RsvpFormSection() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [verifiedInvite, setVerifiedInvite] = useState<VerifiedInvite | null>(null);
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [selectedEvents, setSelectedEvents] = useState<EventChoice[]>([]);
  const [guestsCount, setGuestsCount] = useState<1 | 2>(1);
  const [message, setMessage] = useState("");

  const lookupMutation = trpc.wedding.lookupInvitationCode.useMutation({
    onSuccess: data => {
      setVerifiedInvite(data);
      toast.success("Code reconnu. Vous pouvez compléter votre réponse.");
    },
    onError: error => {
      setVerifiedInvite(null);
      toast.error(error.message || "Code non reconnu. Vérifiez votre invitation.");
    },
  });

  const submitMutation = trpc.wedding.submitRsvp.useMutation({
    onSuccess: data => {
      if (data.attendance === "yes") {
        toast.success("Merci ! Votre réponse est confirmée.");
        setLocation(`/billet/${data.ticketCode}`);
      } else {
        toast.info("Merci, votre réponse est bien enregistrée.");
        setLocation("/indisponible");
      }
    },
    onError: error =>
      toast.error(
        error.message ||
          "Une erreur est survenue lors de l'enregistrement de votre réponse."
      ),
  });

  const toggleEvent = (eventId: EventChoice) => {
    setSelectedEvents(previous =>
      previous.includes(eventId)
        ? previous.filter(id => id !== eventId)
        : [...previous, eventId]
    );
  };

  const handleCodeChange = (value: string) => {
    setCode(value.toUpperCase());
    setVerifiedInvite(null);
    setName("");
    setAttendance("yes");
    setSelectedEvents([]);
    setGuestsCount(1);
    setMessage("");
  };

  const handleLookup = () => {
    const normalizedCode = code.trim().toUpperCase();
    if (!/^MM\d{3}$/.test(normalizedCode)) {
      toast.error("Saisissez le code de votre invitation, par exemple MM001.");
      return;
    }
    lookupMutation.mutate({ code: normalizedCode });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!verifiedInvite || verifiedInvite.code !== code.trim().toUpperCase()) {
      toast.error("Vérifiez d’abord votre code invité.");
      return;
    }
    if (!name.trim()) {
      toast.error("Saisissez le nom ou surnom à afficher sur votre billet.");
      return;
    }
    if (attendance === "yes" && selectedEvents.length === 0) {
      toast.error("Veuillez sélectionner au moins un moment : mariage civil, bénédiction nuptiale ou soirée.");
      return;
    }

    submitMutation.mutate({
      code: verifiedInvite.code,
      name: name.trim(),
      attendance,
      events: attendance === "yes" ? selectedEvents : undefined,
      guestsCount: attendance === "yes" ? guestsCount : 1,
      message: message.trim() || undefined,
    });
  };

  const sideName =
    verifiedInvite?.side === "bride" ? WEDDING_CONFIG.bride : WEDDING_CONFIG.groom;

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#faf7f2] relative scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        <SectionTitle kicker="Votre réponse" title="Serez-vous des nôtres ?">
          <p>
            Dites-nous avant <strong>{WEDDING_CONFIG.rsvpDeadline}</strong> si vous pourrez venir.
            Saisissez d’abord le code qui vous a été remis : il permet de retrouver votre invitation,
            même si vous utilisez un surnom ou une orthographe différente.
          </p>
        </SectionTitle>

        <div className="card-luxury p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
          <div className="rounded-2xl border border-[#ebdcc8] bg-[#fcfaf7] p-5 md:p-6">
            <label htmlFor="invitation-code" className="block text-sm font-semibold text-[#2d241e] mb-2">
              Code de votre invitation *
            </label>
            <p className="text-xs text-[#7c6d62] mb-3">
              Entrez le code inscrit sur votre invitation, par exemple <strong>MM001</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="invitation-code"
                type="text"
                required
                autoComplete="off"
                spellCheck={false}
                maxLength={5}
                value={code}
                onChange={event => handleCodeChange(event.target.value)}
                onKeyDown={event => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleLookup();
                  }
                }}
                placeholder="MM001"
                className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white font-mono text-sm uppercase tracking-[0.14em] focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
              />
              <button
                type="button"
                onClick={handleLookup}
                disabled={lookupMutation.isPending}
                className="min-h-[46px] shrink-0 px-5 py-3 rounded-xl gold-gradient text-white text-sm font-semibold shadow hover:brightness-105 disabled:opacity-60"
              >
                {lookupMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Vérifier mon code"
                )}
              </button>
            </div>
            {verifiedInvite && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
                <p className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 shrink-0" /> Invitation reconnue — côté {sideName}.
                </p>
                {verifiedInvite.tableNumber && verifiedInvite.tableVirtue ? (
                  <p className="mt-2 flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    Table {verifiedInvite.tableNumber} · {verifiedInvite.tableVirtue}
                  </p>
                ) : (
                  <p className="mt-2 text-xs">Votre table sera affichée dès qu’elle aura été attribuée.</p>
                )}
              </div>
            )}
          </div>

          {verifiedInvite && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="display-name" className="block text-sm font-semibold text-[#2d241e] mb-1.5">
                  Nom complet ou nom de famille à afficher sur le billet *
                </label>
                <input
                  id="display-name"
                  type="text"
                  required
                  maxLength={160}
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Votre nom complet ou nom de famille"
                  className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm"
                />
                <p className="mt-1.5 text-[11px] text-[#7c6d62]">
                  Ce texte sert à l’affichage. Votre code, et non l’orthographe du nom, identifie votre place.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2d241e] mb-3">
                  Serez-vous avec nous ? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAttendance("yes")}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "yes" ? "border-[#c69a58] bg-[#fdf9f3] text-[#855f24] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "yes" ? "border-[#c69a58] bg-[#c69a58]" : "border-muted-foreground"}`}>
                        {attendance === "yes" && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span>Oui, je serai là avec joie</span>
                    </span>
                    <Sparkles className="w-4 h-4 text-[#c69a58]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance("no")}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all cursor-pointer ${attendance === "no" ? "border-[#7c6d62] bg-[#f5f1eb] text-[#2d241e] shadow-sm font-semibold" : "border-[#ebdcc8] hover:border-[#c69a58]/50 text-[#5a4632]"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${attendance === "no" ? "border-[#7c6d62] bg-[#7c6d62]" : "border-muted-foreground"}`}>
                        {attendance === "no" && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span>Je ne pourrai pas venir</span>
                    </span>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {attendance === "yes" && (
                <div className="bg-[#fcfaf7] border border-[#ebdcc8] p-5 rounded-2xl space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#2d241e] mb-1">
                      À quels moments serons-nous réunis ? *
                    </label>
                    <p className="text-xs text-[#7c6d62] mb-3">
                      Sélectionnez le mariage civil, la bénédiction nuptiale, la soirée, ou plusieurs moments.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {EVENT_OPTIONS.map(eventOption => {
                        const isChecked = selectedEvents.includes(eventOption.id);
                        return (
                          <button
                            key={eventOption.id}
                            type="button"
                            onClick={() => toggleEvent(eventOption.id)}
                            aria-pressed={isChecked}
                            className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${isChecked ? "border-[#c69a58] bg-[#fbf5e9] text-[#6c4b1a] shadow-sm" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]/60"}`}
                          >
                            <span className="flex items-center justify-between mb-1">
                              <span className="font-serif-luxury text-base font-bold">{eventOption.label}</span>
                              <span className={`w-4 h-4 rounded-md border flex items-center justify-center ${isChecked ? "border-[#c69a58] bg-[#c69a58] text-white" : "border-[#ebdcc8]"}`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </span>
                            </span>
                            <span className="text-[11px] font-semibold text-[#9d7537]">{eventOption.time}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">{eventOption.sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ebdcc8]/70">
                    <label className="block text-sm font-semibold text-[#2d241e] mb-2">Vous viendrez… *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 1 as const, label: "Seul(e)", sub: "Une place" },
                        { value: 2 as const, label: "En couple", sub: "Deux places" },
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGuestsCount(option.value)}
                          aria-pressed={guestsCount === option.value}
                          className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${guestsCount === option.value ? "gold-gradient text-white border-transparent shadow-sm" : "border-[#ebdcc8] bg-white text-[#5a4632] hover:border-[#c69a58]"}`}
                        >
                          <span className="flex items-center gap-2 font-semibold"><Users className="w-4 h-4" /> {option.label}</span>
                          <span className={`block text-[11px] mt-1 ${guestsCount === option.value ? "text-white/80" : "text-muted-foreground"}`}>{option.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="guestbook-message" className="flex items-center justify-between text-sm font-semibold text-[#2d241e] mb-1.5">
                  <span>Un mot doux ou une bénédiction (facultatif)</span>
                  <Heart className="w-3.5 h-3.5 text-[#9d7537]" />
                </label>
                <textarea
                  id="guestbook-message"
                  rows={3}
                  maxLength={1000}
                  value={message}
                  onChange={event => setMessage(event.target.value)}
                  placeholder="Il apparaîtra dans notre livre d’or…"
                  className="w-full px-4 py-3 rounded-xl border border-[#ebdcc8] bg-white focus:outline-none focus:ring-2 focus:ring-[#c69a58] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full py-4 min-h-[52px] rounded-full gold-gradient text-white font-semibold tracking-wide text-base shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-center"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin shrink-0" /><span>Envoi en cours…</span></>
                ) : attendance === "yes" ? (
                  <><UserCheck className="w-4 h-4 shrink-0" /><span>Je confirme et je reçois mon billet</span></>
                ) : (
                  <span>Envoyer ma réponse</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
