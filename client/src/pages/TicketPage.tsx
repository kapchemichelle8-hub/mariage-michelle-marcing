import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useRoute } from "wouter";
import { DigitalTicket } from "../components/DigitalTicket";

export default function TicketPage() {
  const [, params] = useRoute("/billet/:code");
  const code = (params?.code || "").trim();

  const { data: ticket, isLoading, error } = trpc.wedding.getTicket.useQuery(
    { code },
    {
      enabled: Boolean(code && code.length >= 3),
      retry: (failureCount, err) => {
        // Ne pas insister si le serveur confirme que le billet n'existe pas
        if ((err as any)?.data?.code === "NOT_FOUND") return false;
        return failureCount < 2;
      },
    }
  );

  return (
    <div className="min-h-screen bg-[#faf7f2] py-12 px-4 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full mb-6 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#855f24] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retourner sur le site
        </Link>
      </div>

      {isLoading ? (
        <div className="card-luxury p-10 rounded-3xl text-center space-y-4 max-w-md w-full">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#9d7537]" />
          <p className="text-sm text-muted-foreground">Recherche de votre billet officiel...</p>
        </div>
      ) : error || !ticket ? (
        <div className="card-luxury p-10 rounded-3xl text-center space-y-4 max-w-md w-full">
          <h2 className="font-serif-luxury text-xl font-bold text-destructive">Billet introuvable</h2>
          <p className="text-xs text-muted-foreground">
            Aucune invitation active ne correspond au code <strong>{code}</strong>. Si vous avez effectué une nouvelle réponse, veuillez vérifier le lien affiché ou renouveler votre confirmation.
          </p>
          <Link
            href="/#rsvp"
            className="inline-block px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 transition-all"
          >
            Aller au formulaire RSVP
          </Link>
        </div>
      ) : (
        <DigitalTicket
          ticket={{
            ticketCode: ticket.ticketCode,
            name: ticket.name,
            guestsCount: ticket.guestsCount,
            attendance: ticket.attendance,
            side: ticket.side,
            events: (ticket as any).events,
            createdAt: ticket.createdAt,
          }}
        />
      )}
    </div>
  );
}
