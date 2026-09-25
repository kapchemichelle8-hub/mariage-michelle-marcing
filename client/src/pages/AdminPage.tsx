import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  Heart,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  Search,
  Sparkles,
  Ticket,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { WEDDING_CONFIG } from "../weddingConfig";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttendance, setFilterAttendance] = useState<"all" | "yes" | "no">("all");

  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } =
    trpc.wedding.getStats.useQuery();

  const {
    data: rsvps,
    isLoading: isListLoading,
    refetch: refetchList,
    error,
  } = trpc.admin.listRsvps.useQuery();

  const handleRefresh = () => {
    refetchStats();
    refetchList();
  };

  const handleExportCsv = () => {
    if (!rsvps || rsvps.length === 0) return;

    const headers = [
      "Code Billet",
      "Nom",
      "Email",
      "Présence",
      "Nombre de personnes",
      "Message",
      "Date de réponse",
    ];

    const rows = rsvps.map((r) => [
      `"${r.ticketCode}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      r.attendance === "yes" ? "Oui" : "Non",
      r.guestsCount,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString("fr-FR")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invites_mariage_michelle_marcing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = (rsvps || []).filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.ticketCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterAttendance === "all" || r.attendance === filterAttendance;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f7f2eb] py-8 px-4 md:px-8 selection:bg-[#c69a58]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#ebdcc8]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#855f24] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voir le site invité
            </Link>
            <h1 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#2d241e]">
              Espace Organisation & Réponses
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Suivi en temps réel des présences pour la dote de <strong>{WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-white border border-[#ebdcc8] text-xs font-semibold text-[#5a4632] hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualiser
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!rsvps || rsvps.length === 0}
              className="px-4 py-2 rounded-xl gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Exporter en Excel / CSV
            </button>
          </div>
        </div>

        {/* Cartes de statistiques clés */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-luxury p-5 rounded-2xl">
            <div className="flex items-center justify-between text-[#855f24] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Personnes
              </span>
              <Users className="w-4 h-4" />
            </div>
            <span className="font-serif-luxury text-3xl md:text-4xl font-bold text-[#2d241e]">
              {isStatsLoading ? "..." : stats?.totalGuests ?? 0}
            </span>
            <span className="block text-[11px] text-muted-foreground mt-1">
              Nombre de convives à table
            </span>
          </div>

          <div className="card-luxury p-5 rounded-2xl">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Présents Confirmés
              </span>
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="font-serif-luxury text-3xl md:text-4xl font-bold text-emerald-800">
              {isStatsLoading ? "..." : stats?.attendingResponses ?? 0}
            </span>
            <span className="block text-[11px] text-muted-foreground mt-1">
              Familles ou invitations validées
            </span>
          </div>

          <div className="card-luxury p-5 rounded-2xl">
            <div className="flex items-center justify-between text-rose-700 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Absences Déclarées
              </span>
              <UserX className="w-4 h-4" />
            </div>
            <span className="font-serif-luxury text-3xl md:text-4xl font-bold text-rose-800">
              {isStatsLoading ? "..." : stats?.declinedResponses ?? 0}
            </span>
            <span className="block text-[11px] text-muted-foreground mt-1">
              Ne pourront pas être là
            </span>
          </div>

          <div className="card-luxury p-5 rounded-2xl">
            <div className="flex items-center justify-between text-[#855f24] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Réponses
              </span>
              <Ticket className="w-4 h-4" />
            </div>
            <span className="font-serif-luxury text-3xl md:text-4xl font-bold text-[#2d241e]">
              {isStatsLoading ? "..." : stats?.totalResponses ?? 0}
            </span>
            <span className="block text-[11px] text-muted-foreground mt-1">
              Formulaires complétés
            </span>
          </div>
        </div>

        {/* Tableau des réponses */}
        <div className="card-luxury rounded-3xl p-6 border-[#ebdcc8]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, code de billet..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ebdcc8] bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtrer :</span>
              <button
                type="button"
                onClick={() => setFilterAttendance("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterAttendance === "all"
                    ? "bg-[#2d241e] text-white"
                    : "bg-white border border-[#ebdcc8] text-[#5a4632]"
                }`}
              >
                Tous ({rsvps?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setFilterAttendance("yes")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterAttendance === "yes"
                    ? "bg-emerald-700 text-white"
                    : "bg-white border border-[#ebdcc8] text-emerald-700"
                }`}
              >
                Présents ({stats?.attendingResponses || 0})
              </button>
              <button
                type="button"
                onClick={() => setFilterAttendance("no")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterAttendance === "no"
                    ? "bg-rose-700 text-white"
                    : "bg-white border border-[#ebdcc8] text-rose-700"
                }`}
              >
                Absents ({stats?.declinedResponses || 0})
              </button>
            </div>
          </div>

          {isListLoading ? (
            <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#9d7537]" />
              <span className="text-xs">Chargement de la liste des invités...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200">
              <Lock className="w-8 h-8 text-amber-700 mx-auto mb-2" />
              <h3 className="font-semibold text-amber-900 text-sm">
                Connexion requise pour accéder au tableau de bord complet
              </h3>
              <p className="text-xs text-amber-700 mt-1 max-w-md mx-auto">
                Connectez-vous en tant qu'administrateur avec votre compte pour voir toutes les adresses, messages privés et gérer les invités.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              Aucune réponse ne correspond aux critères de recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#ebdcc8] text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-3">Billet</th>
                    <th className="py-3 px-3">Nom de l'invité</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3 text-center">Convives</th>
                    <th className="py-3 px-3">Message</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdcc8]/60">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <Link
                          href={`/billet/${item.ticketCode}`}
                          className="font-mono font-bold text-[#855f24] hover:underline"
                        >
                          {item.ticketCode}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#2d241e]">{item.name}</div>
                        {item.email && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {item.email}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        {item.attendance === "yes" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                            <CheckCircle className="w-3 h-3" /> Présent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-[#2d241e]">
                        {item.attendance === "yes" ? item.guestsCount : 0}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs text-xs text-[#5a4632] italic truncate">
                        {item.message || <span className="text-muted-foreground not-italic">—</span>}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
