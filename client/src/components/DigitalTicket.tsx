import { forwardRef } from "react";
import { sideLabel } from "@shared/rsvpConstants";
import { schedule, wedding } from "@/weddingConfig";
import { DovesHeart } from "./Ornaments";

export type TicketData = {
  name: string;
  side: "mariee" | "marie";
  guestsCount: number;
  ticketCode: string;
};

/** Le billet est dessiné avec des styles simples pour s'exporter fidèlement en PNG et en PDF. */
export const DigitalTicket = forwardRef<HTMLDivElement, { ticket: TicketData }>(({ ticket }, ref) => (
  <div
    ref={ref}
    className="print-ticket relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[1.8rem] bg-ivory text-ink shadow-[0_30px_60px_-30px_rgb(59_38_24/0.8)]"
  >
    <div className="relative bg-cocoa px-6 pb-8 pt-7 text-center text-ivory">
      <DovesHeart className="mx-auto h-8 w-28 text-gold-soft" />
      <p className="mt-3 text-[0.65rem] uppercase tracking-[0.35em] text-gold-soft">Billet d’invitation</p>
      <p className="script mt-1 text-5xl leading-tight">Michelle &amp; Marcing</p>
      <p className="mt-1 font-serif text-lg tracking-[0.18em] text-gold-soft">{wedding.shortDate}</p>
      <p className="text-xs uppercase tracking-[0.25em] text-ivory/80">
        {wedding.city} · {wedding.country}
      </p>
    </div>

    {/* Découpe façon billet */}
    <div className="relative h-0">
      <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-cream" />
      <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-cream" />
    </div>

    <div className="px-6 pb-6 pt-7">
      <p className="text-center font-serif text-lg italic text-muted">Avec toute notre joie, nous accueillons</p>
      <p className="mt-1 text-center font-serif text-3xl font-medium leading-tight text-cocoa">{ticket.name}</p>
      <p className="mt-1 text-center text-sm text-muted">
        {ticket.guestsCount} {ticket.guestsCount > 1 ? "personnes" : "personne"} · {sideLabel(ticket.side)}
      </p>

      <ul className="mt-6 space-y-3 border-y border-dashed border-gold/50 py-5">
        {schedule.map((s) => (
          <li key={s.time} className="flex gap-3">
            <span className="w-16 shrink-0 font-serif text-lg font-semibold text-gold-deep">{s.time}</span>
            <span className="text-sm leading-snug">
              <span className="block font-medium text-cocoa">{s.title}</span>
              <span className="text-muted">{s.place}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted">{wedding.itinerary}</p>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-muted">Code personnel</p>
          <p className="font-mono text-2xl font-semibold tracking-[0.12em] text-cocoa">{ticket.ticketCode}</p>
        </div>
        <p className="script text-right text-2xl leading-tight text-gold-deep">Bienvenue&nbsp;!</p>
      </div>
    </div>
  </div>
));
DigitalTicket.displayName = "DigitalTicket";
