import { CheckCircle2, Download, FileDown, Heart, ImageDown, MapPin, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export interface TicketData {
  ticketCode: string;
  name: string;
  guestsCount: number;
  attendance: "yes" | "no";
  side?: "bride" | "groom" | null;
  events?: string | null;
  createdAt?: Date | string;
}

const EVENT_LABELS: Record<string, { label: string; time: string }> = {
  civil: { label: "Mairie", time: "13 h 00" },
  church: { label: "Église", time: "15 h 00" },
  party: { label: "Soirée", time: "20 h 00" },
};

export function DigitalTicket({ ticket }: { ticket: TicketData }) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const selectedEventKeys = ticket.events ? ticket.events.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const hasEventDetails = selectedEventKeys.length > 0;
  const qrValue = `wedding-plan://michelle-marcing/${ticket.ticketCode}`;

  const makePng = async () => {
    if (!ticketRef.current) throw new Error("Billet indisponible");
    const { toPng } = await import("html-to-image");
    return toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
  };
  const downloadFile = (href: string, filename: string) => { const link = document.createElement("a"); link.href = href; link.download = filename; link.click(); };
  const handleDownloadPng = async () => { try { setIsExporting(true); downloadFile(await makePng(), `billet-michelle-marcing-${ticket.ticketCode}.png`); toast.success("Votre billet PNG est prêt à être enregistré dans votre galerie."); } catch { toast.error("Impossible de créer l'image du billet. Réessayez dans un instant."); } finally { setIsExporting(false); } };
  const handleDownloadPdf = async () => { try { setIsExporting(true); const dataUrl = await makePng(); const { PDFDocument } = await import("pdf-lib"); const pdf = await PDFDocument.create(); const image = await pdf.embedPng(dataUrl); const page = pdf.addPage([image.width, image.height]); page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height }); const bytes = await pdf.save(); const blobUrl = URL.createObjectURL(new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })); downloadFile(blobUrl, `billet-michelle-marcing-${ticket.ticketCode}.pdf`); URL.revokeObjectURL(blobUrl); toast.success("Votre billet PDF est prêt."); } catch { toast.error("Impossible de créer le PDF du billet. Réessayez dans un instant."); } finally { setIsExporting(false); } };
  const handleShare = async () => { const url = `${window.location.origin}/billet/${ticket.ticketCode}`; if (navigator.share) { try { await navigator.share({ title: "Billet d'invitation — Michelle & Marcing", text: `Billet officiel de ${ticket.name}`, url }); } catch { /* partage fermé */ } } else { await navigator.clipboard.writeText(url); toast.success("Lien de votre billet copié dans le presse-papier !"); } };

  return (
    <div className="ticket-print-area w-full max-w-xl mx-auto my-6 print:m-0 print:max-w-none">
      <div ref={ticketRef} className="relative bg-white text-[#2d241e] rounded-3xl p-6 md:p-8 border-2 border-[#c69a58]/40 shadow-2xl overflow-hidden print:border print:shadow-none print:rounded-none">
        <div className="absolute top-0 left-0 right-0 h-3 gold-gradient" /><div className="absolute -right-12 -top-12 w-48 h-48 bg-[#c69a58]/10 rounded-full blur-2xl pointer-events-none print:hidden" />
        <div className="text-center pb-6 border-b border-dashed border-[#c69a58]/40"><span className="font-script text-3xl text-[#9d7537]">Michelle & Marcing</span><h3 className="font-serif-luxury text-lg md:text-xl font-bold tracking-wider uppercase text-[#2d241e] mt-1">Billet d'Accès Officiel</h3><p className="text-xs uppercase tracking-widest text-[#9d7537] font-semibold mt-1">{WEDDING_CONFIG.title}</p></div>
        <div className="py-6 space-y-5">
          <div className="bg-[#fcfaf7] border border-[#ebdcc8] rounded-2xl p-4 text-center"><p className="font-serif-luxury text-xl md:text-2xl font-bold text-[#855f24]">{ticket.name}</p><div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-[#c69a58]/15 rounded-full text-xs font-semibold text-[#855f24]"><CheckCircle2 className="w-3.5 h-3.5" /><span>Présence confirmée pour {ticket.guestsCount} {ticket.guestsCount > 1 ? "personnes" : "personne"}</span></div></div>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm"><div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcc8]/60"><span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Date</span><strong className="text-[#2d241e] font-semibold block mt-0.5">{WEDDING_CONFIG.dateString}</strong><span className="text-muted-foreground text-[11px]">À partir de 13 h 00</span></div><div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcc8]/60"><span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Lieu de la messe</span><strong className="text-[#2d241e] font-semibold block mt-0.5">Mbangué</strong><span className="text-muted-foreground text-[11px]">Douala, Cameroun</span></div></div>
          <div className="p-3.5 bg-[#fcfaf7] rounded-xl border border-[#c69a58]/35"><span className="text-[11px] uppercase tracking-wider text-[#855f24] font-semibold block mb-2">Moments de célébration choisis</span><div className="flex flex-wrap gap-2">{hasEventDetails ? selectedEventKeys.map((key) => { const info = EVENT_LABELS[key] || { label: key, time: "" }; return <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ede1] border border-[#c69a58]/40 text-xs font-semibold text-[#6c4b1a]"><CheckCircle2 className="w-3 h-3 text-[#c69a58]" /><span>{info.label}</span>{info.time && <span className="text-[10px] text-[#9d7537]">({info.time})</span>}</span>; }) : <span className="text-xs text-[#6c4b1a]">Moments à confirmer avec l’invité.</span>}</div></div>
          <div className="flex gap-2 items-start p-4 rounded-xl bg-gradient-to-r from-[#fbf8f3] via-[#f7f0e3] to-[#fbf8f3] border border-[#c69a58]/30"><MapPin className="w-4 h-4 mt-0.5 text-[#9d7537] shrink-0" /><p className="text-xs text-[#5a4632] leading-relaxed"><strong>Église à 15 h :</strong> Paroisse Christ Sauveur de Mbangué, au carrefour Toiture Rouge.</p></div>
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#fbf8f3] via-[#f7f0e3] to-[#fbf8f3] border border-[#c69a58]/30 text-center"><Heart className="w-5 h-5 mx-auto text-[#9d7537] mb-1.5 fill-[#c69a58]/30" /><p className="font-serif-luxury text-sm md:text-base font-semibold text-[#855f24]">« Merci d’être là pour notre oui. »</p><p className="text-xs text-muted-foreground mt-1">Votre présence rend ce jour encore plus beau.</p></div>
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#c69a58]/40"><div><span className="text-[10px] uppercase tracking-wider text-muted-foreground block">N° d'invitation unique</span><span className="font-mono text-2xl font-bold text-[#2d241e] tracking-[0.18em]">{ticket.ticketCode}</span></div><div className="text-center"><div className="w-20 h-20 rounded-xl border-2 border-[#c69a58]/40 flex items-center justify-center bg-white p-1"><QRCodeSVG value={qrValue} size={66} level="M" bgColor="#ffffff" fgColor="#2d241e" includeMargin={false} aria-label={`QR code de préparation du plan de salle pour le billet ${ticket.ticketCode}`} /></div><span className="text-[8px] font-mono text-muted-foreground block mt-1">PLAN DE SALLE À VENIR</span></div></div>
        </div>
        <div className="hidden md:block absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#faf7f2] border-r-2 border-[#c69a58]/40 print:hidden" /><div className="hidden md:block absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#faf7f2] border-l-2 border-[#c69a58]/40 print:hidden" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3 justify-center print:hidden"><button type="button" onClick={handleDownloadPng} disabled={isExporting} className="px-4 py-2.5 rounded-full gold-gradient text-white font-medium text-xs shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"><ImageDown className="w-4 h-4" /> Télécharger en PNG</button><button type="button" onClick={handleDownloadPdf} disabled={isExporting} className="px-4 py-2.5 rounded-full border border-[#c69a58] text-[#855f24] hover:bg-[#c69a58]/10 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"><FileDown className="w-4 h-4" /> Télécharger en PDF</button><button type="button" onClick={() => window.print()} disabled={isExporting} className="px-4 py-2.5 rounded-full border border-[#c69a58] text-[#855f24] hover:bg-[#c69a58]/10 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"><Download className="w-4 h-4" /> Imprimer uniquement le billet</button><button type="button" onClick={handleShare} className="px-4 py-2.5 rounded-full border border-[#c69a58] text-[#855f24] hover:bg-[#c69a58]/10 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer"><Share2 className="w-4 h-4" /> Partager mon invitation</button></div>
    </div>
  );
}
