import { trpc } from "@/lib/trpc";
import { ArrowLeft, Armchair, Loader2, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function PlanPage() {
  const [, params] = useRoute("/plan/:code");
  const code = (params?.code || "").trim();
  const { data: ticket, isLoading, error } = trpc.wedding.getTicket.useQuery(
    { code },
    { enabled: /^[A-Za-z0-9_-]{32}$/.test(code), retry: false }
  );
  const assignment = ticket?.seatAssignment;

  return (
    <main className="min-h-screen bg-[#faf7f2] text-[#2d241e] px-4 py-12 flex items-center justify-center">
      <section className="card-luxury w-full max-w-md rounded-[2rem] p-7 md:p-10 text-center shadow-xl">
        <Link
          href={`/billet/${code}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#855f24] hover:underline mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retourner à mon billet
        </Link>
        <p className="font-script text-4xl text-[#9d7537]">Michelle &amp; Marcing</p>
        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[#7c6d62]">Votre table</p>
        {isLoading ? (
          <div className="py-12 space-y-3">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-[#9d7537]" />
            <p className="text-sm text-[#7c6d62]">Recherche de votre table…</p>
          </div>
        ) : error || !ticket ? (
          <div className="mt-9 rounded-2xl bg-[#f4ede1] p-5 text-sm leading-relaxed text-[#5a4632]">
            Ce lien de billet n’est pas accessible. Les anciens billets numériques sont privés; utilisez le lien reçu après votre réponse par code.
          </div>
        ) : assignment ? (
          <div className="mt-9 space-y-5">
            <div className="rounded-3xl bg-[#2a1d15] text-[#f7ead4] px-6 py-8">
              <Armchair className="w-8 h-8 mx-auto text-[#e2c27f]" />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#e2c27f]">Numéro de table</p>
              <p className="mt-1 font-serif-luxury text-4xl font-bold">Table {assignment.tableNumber}</p>
              <p className="mt-2 font-script text-3xl text-[#e2c27f]">{assignment.tableVirtue}</p>
            </div>
            <p className="flex items-start gap-2 text-left text-sm leading-relaxed text-[#5a4632]">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#9d7537]" />
              Le repère visuel de la salle sera ajouté dès que le plan 2D sera prêt.
            </p>
          </div>
        ) : (
          <div className="mt-9 rounded-2xl bg-[#f4ede1] p-5 text-sm leading-relaxed text-[#5a4632]">
            Cette invitation n’a pas encore de table attribuée. Le nom de table apparaîtra ici dès l’enregistrement du placement par code.
          </div>
        )}
        <Link
          href="/"
          className="inline-flex mt-8 px-5 py-2.5 rounded-full gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 transition-all"
        >
          Revenir à l’invitation
        </Link>
      </section>
    </main>
  );
}
