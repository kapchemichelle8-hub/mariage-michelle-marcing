import { CheckCircle2, Download, Heart, MapPin, QrCode, Share2 } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export interface TicketData {
  ticketCode: string;
  name: string;
  guestsCount: number;
  attendance: "yes" | "no";
  createdAt?: Date | string;
}

export function DigitalTicket({ ticket }: { ticket: TicketData }) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url = `${window.location.origin}/billet/${ticket.ticketCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Billet d'invitation — Michelle & Marcing", text: `Billet officiel de ${ticket.name}`, url });
      } catch {
        // L'utilisateur peut fermer la fenêtre de partage sans erreur.
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Lien de votre billet copié dans le presse-papier !");
    }
  };

  return (
    <div className="ticket-print-area w-full max-w-xl mx-auto my-6 print:m-0 print:max-w-none">
      <div ref={ticketRef} className="relative bg-white text-[#2d241e] rounded-3xl p-6 md:p-8 border-2 border-[#c69a58]/40 shadow-2xl overflow-hidden print:border print:shadow-none print:rounded-none">
        <div className="absolute top-0 left-0 right-0 h-3 gold-gradient" />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#c69a58]/10 rounded-full blur-2xl pointer-events-none print:hidden" />

        <div className="text-center pb-6 border-b border-dashed border-[#c69a58]/40">
          <span className="font-script text-3xl text-[#9d7537]">Michelle & Marcing</span>
          <h3 className="font-serif-luxury text-lg md:text-xl font-bold tracking-wider uppercase text-[#2d241e] mt-1">Billet d'Accès Officiel</h3>
          <p className="text-xs uppercase tracking-widest text-[#9d7537] font-semibold mt-1">Dot & union traditionnelle</p>
        </div>

        <div className="py-6 space-y-5">
          <div className="bg-[#fcfaf7] border border-[#ebdcc8] rounded-2xl p-4 text-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Invité(e) d'honneur</span>
            <p className="font-serif-luxury text-xl md:text-2xl font-bold text-[#855f24]">{ticket.name}</p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-[#c69a58]/15 rounded-full text-xs font-semibold text-[#855f24]"><CheckCircle2 className="w-3.5 h-3.5" /><span>Présence confirmée pour {ticket.guestsCount} {ticket.guestsCount > 1 ? "personnes" : "personne"}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcc8]/60"><span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Date</span><strong className="text-[#2d241e] font-semibold block mt-0.5">{WEDDING_CONFIG.dateString}</strong><span className="text-muted-foreground text-[11px]">Dès 18 h 00</span></div>
            <div className="p-3 bg-[#faf7f2] rounded-xl border border-[#ebdcc8]/60"><span className="text-muted-foreground block text-[11px] uppercase tracking-wider">Lieu</span><strong className="text-[#2d241e] font-semibold block mt-0.5">Centre climatique de Bandjoun</strong><span className="text-muted-foreground text-[11px]">Mission protestante de Nlem, juste à côté</span></div>
          </div>

          <div className="flex gap-2 items-start p-4 rounded-xl bg-gradient-to-r from-[#fbf8f3] via-[#f7f0e3] to-[#fbf8f3] border border-[#c69a58]/30"><MapPin className="w-4 h-4 mt-0.5 text-[#9d7537] shrink-0" /><p className="text-xs text-[#5a4632] leading-relaxed">Depuis le Centre climatique de Bandjoun, prenez la moto et dites : « Mission protestante de Nlem ».</p></div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-[#fbf8f3] via-[#f7f0e3] to-[#fbf8f3] border border-[#c69a58]/30 text-center"><Heart className="w-5 h-5 mx-auto text-[#9d7537] mb-1.5 fill-[#c69a58]/30" /><p className="font-serif-luxury text-sm md:text-base font-semibold text-[#855f24]">« Nous sommes infiniment heureux de vous compter parmi nous ! »</p><p className="text-xs text-muted-foreground mt-1">Votre présence apportera une grâce toute particulière à notre grand jour.</p></div>

          <div className="flex items-center justify-between pt-2 border-t border-dashed border-[#c69a58]/40"><div><span className="text-[10px] uppercase tracking-wider text-muted-foreground block">N° d'invitation unique</span><span className="font-mono text-base font-bold text-[#2d241e] tracking-wider">{ticket.ticketCode}</span></div><div className="w-16 h-16 rounded-xl border-2 border-[#c69a58]/40 flex flex-col items-center justify-center bg-[#faf7f2] p-1"><QrCode className="w-10 h-10 text-[#855f24]" /><span className="text-[8px] font-mono text-muted-foreground">VALIDÉ</span></div></div>
        </div>

        <div className="hidden md:block absolute left-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#faf7f2] border-r-2 border-[#c69a58]/40 print:hidden" />
        <div className="hidden md:block absolute right-[-16px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#faf7f2] border-l-2 border-[#c69a58]/40 print:hidden" />
      </div>

      <div className="mt-4 flex flex-wrap gap-3 justify-center print:hidden">
        <button type="button" onClick={handlePrint} className="px-5 py-2.5 rounded-full gold-gradient text-white font-medium text-xs md:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"><Download className="w-4 h-4" /> Télécharger / imprimer uniquement le billet</button>
        <button type="button" onClick={handleShare} className="px-5 py-2.5 rounded-full border border-[#c69a58] text-[#855f24] hover:bg-[#c69a58]/10 text-xs md:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"><Share2 className="w-4 h-4" /> Partager mon invitation</button>
      </div>
    </div>
  );
}
