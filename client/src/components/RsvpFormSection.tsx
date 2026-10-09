import { useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { rememberTicket } from "@/lib/storage";
import { MAX_GUESTS } from "@shared/rsvpConstants";
import { wedding } from "@/weddingConfig";
import { Reveal } from "./Reveal";

type Side = "mariee" | "marie";
type Attendance = "yes" | "no";

function Choice<T extends string>({
  name,
  value,
  current,
  onChange,
  children,
}: {
  name: string;
  value: T;
  current: T | "";
  onChange: (v: T) => void;
  children: React.ReactNode;
}) {
  const checked = current === value;
  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-center text-[0.95rem] transition-all duration-200 ${
        checked
          ? "border-gold bg-gold/10 text-cocoa shadow-[0_0_0_3px_rgb(198_161_91/0.18)]"
          : "border-sand bg-white/80 text-ink hover:border-gold/60"
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      {children}
    </label>
  );
}

export function RsvpFormSection() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [side, setSide] = useState<Side | "">("");
  const [attendance, setAttendance] = useState<Attendance | "">("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = trpc.rsvp.submit.useMutation({
    onSuccess: (res) => {
      if (res.attendance === "yes" && res.ticketCode) {
        rememberTicket(res.ticketCode);
        navigate(`/billet/${res.ticketCode}`);
      } else {
        navigate(`/merci?nom=${encodeURIComponent(res.name)}`);
      }
    },
    onError: () => setError("L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez, s’il vous plaît."),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!side) return setError("Dites-nous de quel côté de la famille vous venez.");
    if (!attendance) return setError("Dites-nous si vous serez présent ou non.");
    const trimmedName = name.trim();
    if (trimmedName.length < 2) return setError("Merci d’indiquer votre nom.");
    // Le serveur revalide tout : ici, on guide simplement l’invité.
    submit.mutate({
      name: trimmedName,
      side,
      attendance,
      guestsCount: attendance === "yes" ? guestsCount : 0,
      message: message.trim() || undefined,
    });
  };

  return (
    <section id="rsvp" className="night scroll-mt-16 px-5 py-20 sm:py-28" aria-labelledby="rsvp-title">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center text-ivory">
          <p className="eyebrow !text-gold-soft">Votre réponse</p>
          <h2 id="rsvp-title" className="mt-2 text-4xl !text-ivory sm:text-5xl">
            Serez-vous des nôtres ?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-display text-lg italic text-ivory/90">
            Merci de nous répondre avant le {wedding.rsvpDeadline}. Votre billet personnel vous
            attend juste après.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-6 rounded-[2rem] border border-gold/60 bg-ivory p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] sm:p-9">
            <div>
              <label htmlFor="rsvp-name" className="mb-2 block text-sm font-medium text-cocoa">
                Nom complet ou nom de famille
              </label>
              <input
                id="rsvp-name"
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Ex. : Famille Kamga"
                maxLength={160}
                required
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-cocoa">Vous êtes invité(e)…</legend>
              <div className="grid grid-cols-2 gap-3">
                <Choice name="side" value="mariee" current={side} onChange={setSide}>
                  côté de la mariée
                </Choice>
                <Choice name="side" value="marie" current={side} onChange={setSide}>
                  côté du marié
                </Choice>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-cocoa">Serez-vous présent(e) ?</legend>
              <div className="grid grid-cols-2 gap-3">
                <Choice name="attendance" value="yes" current={attendance} onChange={setAttendance}>
                  Oui, avec joie
                </Choice>
                <Choice name="attendance" value="no" current={attendance} onChange={setAttendance}>
                  Je ne pourrai pas
                </Choice>
              </div>
            </fieldset>

            {attendance === "yes" && (
              <div>
                <label htmlFor="rsvp-count" className="mb-2 block text-sm font-medium text-cocoa">
                  Nombre de personnes (vous compris)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-full border border-sand text-xl text-cocoa hover:border-gold"
                    onClick={() => setGuestsCount((c) => Math.max(1, c - 1))}
                    aria-label="Une personne de moins"
                  >
                    −
                  </button>
                  <input
                    id="rsvp-count"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={MAX_GUESTS}
                    value={guestsCount}
                    onChange={(e) =>
                      setGuestsCount(Math.min(MAX_GUESTS, Math.max(1, Number(e.target.value) || 1)))
                    }
                    className="field !w-20 text-center text-lg"
                  />
                  <button
                    type="button"
                    className="grid h-11 w-11 place-items-center rounded-full border border-sand text-xl text-cocoa hover:border-gold"
                    onClick={() => setGuestsCount((c) => Math.min(MAX_GUESTS, c + 1))}
                    aria-label="Une personne de plus"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="rsvp-message" className="mb-2 block text-sm font-medium text-cocoa">
                Un mot d’amour ou une bénédiction <span className="font-normal text-muted">(facultatif)</span>
              </label>
              <textarea
                id="rsvp-message"
                className="field min-h-28 resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1500}
                placeholder="Il apparaîtra dans notre livre d’or…"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button type="submit" disabled={submit.isPending} className="btn-gold w-full !py-4 text-base">
              {submit.isPending ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  Envoyer ma réponse
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M12 21s-7.5-4.6-10-9.2C.4 8.6 2.3 4.5 6.2 4.5c2.3 0 3.6 1.2 4.3 2.4.4.7 1.6.7 2 0 .7-1.2 2-2.4 4.3-2.4 3.9 0 5.8 4.1 4.2 7.3C19.5 16.4 12 21 12 21z" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
