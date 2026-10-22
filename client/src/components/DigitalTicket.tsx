import {
  CheckCircle2,
  Download,
  FileDown,
  Heart,
  ImageDown,
  MapPin,
  Share2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export interface TicketData {
  ticketCode: string;
  invitationCode: string;
  name: string;
  guestsCount: number;
  attendance: "yes" | "no";
  side?: "bride" | "groom" | null;
  events?: string | null;
  createdAt?: Date | string;
  seatAssignment?: {
    tableNumber: string;
    tableVirtue: string;
    tableGuests?: string[];
  } | null;
}

const EVENT_LABELS: Record<string, { label: string; time: string }> = {
  civil: { label: "Mairie", time: "13 h 00" },
  church: { label: "Église", time: "15 h 00" },
  party: { label: "Soirée", time: "20 h 00" },
};

const A4_PAGE = { width: 595.28, height: 841.89 };

export function DigitalTicket({ ticket }: { ticket: TicketData }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const selectedEventKeys = ticket.events
    ? ticket.events
        .split(",")
        .map(value => value.trim())
        .filter(Boolean)
    : [];
  const qrValue = `${window.location.origin}/plan/${ticket.ticketCode}`;

  const makePng = async () => {
    if (!ticketRef.current) throw new Error("Billet indisponible");
    const { toPng } = await import("html-to-image");
    return toPng(ticketRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#ffffff",
    });
  };

  const downloadFile = (href: string, filename: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.click();
  };

  const handleDownloadPng = async () => {
    try {
      setIsExporting(true);
      downloadFile(
        await makePng(),
        `billet-michelle-marcing-${ticket.ticketCode}.png`
      );
      toast.success("Votre billet PNG est prêt à être enregistré dans votre galerie.");
    } catch {
      toast.error("Impossible de créer l'image du billet. Réessayez dans un instant.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await makePng();
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.create();
      const image = await pdf.embedPng(dataUrl);
      const page = pdf.addPage([A4_PAGE.width, A4_PAGE.height]);
      const margin = 24;
      const scale = Math.min(
        (page.getWidth() - margin * 2) / image.width,
        (page.getHeight() - margin * 2) / image.height
      );
      const width = image.width * scale;
      const height = image.height * scale;
      page.drawImage(image, {
        x: (page.getWidth() - width) / 2,
        y: (page.getHeight() - height) / 2,
        width,
        height,
      });
      const bytes = await pdf.save();
      const blobUrl = URL.createObjectURL(
        new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })
      );
      downloadFile(blobUrl, `billet-michelle-marcing-${ticket.ticketCode}.pdf`);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      toast.success("Votre billet PDF A4 (1 page) est prêt.");
    } catch {
      toast.error("Impossible de créer le PDF du billet. Réessayez dans un instant.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/billet/${ticket.ticketCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Billet d'invitation — Michelle & Marcing",
          text: `Billet officiel de ${ticket.name}`,
          url,
        });
      } catch {
        /* Le partage a été fermé par l’invité. */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Lien de votre billet copié dans le presse-papier !");
    }
  };

  return (
    <div className="ticket-print-area w-full max-w-xl mx-auto my-6">
      <article
        ref={ticketRef}
        className="ticket-card relative isolate overflow-hidden rounded-3xl border-2 border-[#c69a58]/50 bg-white p-6 text-[#2d241e] shadow-2xl md:p-8"
      >
        <div className="absolute inset-x-0 top-0 h-2 gold-gradient" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#c69a58]/10 blur-2xl print:hidden"
          aria-hidden="true"
        />

        <header className="ticket-header relative border-b border-dashed border-[#c69a58]/50 pb-4 text-center">
          <p className="font-script text-3xl text-[#9d7537]">Michelle &amp; Marcing</p>
          <h1 className="mt-1 font-serif-luxury text-lg font-bold uppercase tracking-[0.14em] text-[#2d241e] md:text-xl">
            Billet d’accès officiel
          </h1>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d7537]">
            {WEDDING_CONFIG.dateLong}
          </p>
        </header>

        <div className="ticket-main space-y-3.5 py-4">
          <section className="ticket-content-block rounded-2xl border border-[#ebdcc8] bg-[#fcfaf7] p-4 text-center">
            <p className="break-words font-serif-luxury text-xl font-bold text-[#855f24] md:text-2xl">
              {ticket.name}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#c69a58]/15 px-3 py-1 text-xs font-semibold text-[#855f24]">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                Présence confirmée pour {ticket.guestsCount}{" "}
                {ticket.guestsCount > 1 ? "personnes" : "personne"}
              </span>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 text-xs md:text-sm">
            <div className="ticket-content-block rounded-xl border border-[#ebdcc8]/70 bg-[#faf7f2] p-3">
              <span className="block text-[10px] uppercase tracking-wider text-[#7c6d62]">Date et heure</span>
              <strong className="mt-0.5 block font-semibold text-[#2d241e]">{WEDDING_CONFIG.dateString}</strong>
              <span className="text-[11px] text-[#7c6d62]">À partir de 13 h 00</span>
            </div>
            <div className="ticket-content-block rounded-xl border border-[#ebdcc8]/70 bg-[#faf7f2] p-3">
              <span className="block text-[10px] uppercase tracking-wider text-[#7c6d62]">Lieux du mariage</span>
              <strong className="mt-0.5 block font-semibold text-[#2d241e]">Douala, Cameroun</strong>
              <span className="text-[11px] text-[#7c6d62]">Mairie · Église · Soirée</span>
            </div>
          </section>

          <section className="ticket-content-block rounded-xl border border-[#c69a58]/35 bg-[#fcfaf7] p-3.5">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#855f24]">
              Moments choisis
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedEventKeys.length ? (
                selectedEventKeys.map(key => {
                  const event = EVENT_LABELS[key] || { label: key, time: "" };
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 rounded-full border border-[#c69a58]/40 bg-[#f4ede1] px-2.5 py-1 text-[11px] font-semibold text-[#6c4b1a]"
                    >
                      <CheckCircle2 className="h-3 w-3 text-[#c69a58]" aria-hidden="true" />
                      <span>{event.label}</span>
                      {event.time && <span className="text-[10px] text-[#9d7537]">· {event.time}</span>}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs text-[#6c4b1a]">Moments à confirmer avec l’invité.</span>
              )}
            </div>
          </section>

          <section className="ticket-content-block rounded-xl border border-[#c69a58]/30 bg-[#fbf8f3] p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#855f24]">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Lieux de la journée</span>
            </div>
            <div className="space-y-1.5">
              {WEDDING_CONFIG.schedule.map(item => {
                const label = EVENT_LABELS[item.id]?.label ?? item.title;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.mapQuery ?? item.location)}`;
                return (
                  <a
                    key={item.id}
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir l’itinéraire Google Maps vers ${label} : ${item.location}`}
                    className="grid grid-cols-[92px_1fr] gap-2 border-t border-[#e1cfb5]/70 pt-1.5 text-inherit no-underline first:border-t-0 first:pt-0 hover:text-[#855f24] focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c69a58]"
                  >
                    <span className="text-[10px] font-semibold text-[#855f24]">
                      {label} · {item.start}
                    </span>
                    <span className="text-[10px] leading-relaxed text-[#5a4632] underline decoration-[#c69a58]/50 underline-offset-2">
                      {item.location}
                    </span>
                  </a>
                );
              })}
            </div>
          </section>
        </div>

        <footer className="ticket-footer flex items-end justify-between gap-3 border-t border-dashed border-[#c69a58]/50 pt-3">
          <div className="min-w-0">
            <span className="block text-[9px] uppercase tracking-wider text-[#7c6d62]">Code invité</span>
            <span className="mt-0.5 block break-all font-mono text-xl font-bold tracking-[0.14em] text-[#2d241e]">
              {ticket.invitationCode}
            </span>
            <p className="mt-2 flex items-center gap-1.5 font-serif-luxury text-xs font-semibold text-[#855f24]">
              <Heart className="h-3.5 w-3.5 fill-[#c69a58]/30" aria-hidden="true" />
              Merci d’être là pour notre oui.
            </p>
          </div>
          <div className="shrink-0 text-center">
            <div className="rounded-xl border border-[#c69a58]/50 bg-white p-1.5">
              <QRCodeSVG
                value={qrValue}
                size={88}
                level="M"
                bgColor="#ffffff"
                fgColor="#2d241e"
                includeMargin={false}
                aria-label={`QR code privé du billet ${ticket.ticketCode}`}
              />
            </div>
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-wider text-[#855f24]">
              QR équipe accueil
            </span>
          </div>
        </footer>
      </article>

      <div className="ticket-actions mt-4 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="flex cursor-pointer items-center gap-2 rounded-full gold-gradient px-4 py-2.5 text-xs font-medium text-white shadow-md transition-all hover:brightness-105 active:scale-95 disabled:opacity-60"
        >
          <ImageDown className="h-4 w-4" /> Télécharger en PNG
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isExporting}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-[#c69a58] px-4 py-2.5 text-xs font-medium text-[#855f24] transition-colors hover:bg-[#c69a58]/10 disabled:opacity-60"
        >
          <FileDown className="h-4 w-4" /> Télécharger en PDF A4 (1 page)
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          disabled={isExporting}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-[#c69a58] px-4 py-2.5 text-xs font-medium text-[#855f24] transition-colors hover:bg-[#c69a58]/10 disabled:opacity-60"
        >
          <Download className="h-4 w-4" /> Imprimer en une page
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-[#c69a58] px-4 py-2.5 text-xs font-medium text-[#855f24] transition-colors hover:bg-[#c69a58]/10"
        >
          <Share2 className="h-4 w-4" /> Partager mon invitation
        </button>
      </div>
    </div>
  );
}
