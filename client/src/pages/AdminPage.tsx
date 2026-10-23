import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Download,
  Loader2,
  LockKeyhole,
  Heart,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";
import InviteeRosterAdmin from "../components/InviteeRosterAdmin";
import ScheduleTimesAdmin from "../components/ScheduleTimesAdmin";
import PasswordField from "../components/PasswordField";

const EVENT_LABELS: Record<string, string> = {
  civil: "Mariage civil",
  church: "Bénédiction nuptiale",
  party: "Soirée",
};

function formatEvents(events?: string | null) {
  if (!events) return "Tous les moments";
  return events
    .split(",")
    .map(e => EVENT_LABELS[e.trim()] || e.trim())
    .join(", ");
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttendance, setFilterAttendance] = useState<
    "all" | "yes" | "no"
  >("all");
  const [filterSide, setFilterSide] = useState<"all" | "bride" | "groom">(
    "all"
  );
  const [filterSource, setFilterSource] = useState<"all" | "code" | "historique">("all");

  const adminMe = trpc.admin.me.useQuery();
  const isAuthenticated = adminMe.data?.authenticated === true;
  const statsQuery = trpc.admin.stats.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const listQuery = trpc.admin.listRsvps.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const stats = statsQuery.data;
  const rsvps = listQuery.data;
  const unassignedConfirmed = (rsvps || []).filter(
    entry =>
      entry.responseSource === "code" &&
      entry.attendance === "yes" &&
      !entry.tableNumber
  );

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: async () => {
      setPassword("");
      await Promise.all([
        adminMe.refetch(),
        statsQuery.refetch(),
        listQuery.refetch(),
      ]);
      toast.success("Bienvenue dans l'espace réservé aux mariés.");
    },
    onError: error => toast.error(error.message || "Mot de passe incorrect"),
  });
  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      adminMe.refetch();
      toast.success("Espace mariés verrouillé.");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const lock = () => logoutMutation.mutate();
    window.addEventListener("pagehide", lock);
    return () => {
      window.removeEventListener("pagehide", lock);
      lock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const deleteRsvpMutation = trpc.admin.deleteRsvp.useMutation({
    onSuccess: async () => {
      await Promise.all([statsQuery.refetch(), listQuery.refetch()]);
      toast.success("Confirmation supprimée.");
    },
    onError: error => toast.error(error.message),
  });
  const deleteMessageMutation = trpc.admin.deleteGuestbookMessage.useMutation({
    onSuccess: async () => {
      await listQuery.refetch();
      toast.success("Mot d'or supprimé.");
    },
    onError: error => toast.error(error.message),
  });

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim())
      return toast.error("Veuillez entrer le mot de passe.");
    loginMutation.mutate({ password });
  };

  const handleExportCsv = () => {
    if (!rsvps?.length) return;
    const headers = [
      "Code invité",
      "Source",
      "Code Billet",
      "Nom",
      "Invité de",
      "Moments choisis",
      "Table",
      "Présence",
      "Nombre de personnes",
      "Message",
      "Date de réponse",
    ];
    const rows = rsvps.map(r => [
      `"${r.invitationCode || ""}"`,
      `"${r.responseSource === "code" ? "Réponse par code" : "Historique"}"`,
      `"${r.ticketCode}"`,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${sideLabel(r.side)}"`,
      `"${formatEvents(r.events)}"`,
      `"${r.tableNumber ? `Table ${r.tableNumber} — ${r.tableVirtue || ""}` : "Non attribuée"}"`,
      r.attendance === "yes" ? "Oui" : "Non",
      r.guestsCount,
      `"${(r.message || "").replace(/"/g, '""')}"`,
      `"${new Date(r.updatedAt ?? r.createdAt).toLocaleString("fr-FR")}"`,
    ]);
    const blob = new Blob(
      [
        "\uFEFF" +
          [headers.join(";"), ...rows.map(row => row.join(";"))].join("\n"),
      ],
      { type: "text/csv;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invites_mariage_michelle_marcing_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteRsvp = (id: number, name: string) => {
    if (window.confirm(`Supprimer définitivement la confirmation de ${name} ?`))
      deleteRsvpMutation.mutate({ id });
  };
  const deleteMessage = (id: number, name: string) => {
    if (window.confirm(`Supprimer le mot d'or laissé par ${name} ?`))
      deleteMessageMutation.mutate({ id });
  };

  const filtered = (rsvps || []).filter(r => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      r.name.toLowerCase().includes(search) ||
      r.ticketCode.toLowerCase().includes(search) ||
      (r.invitationCode || "").toLowerCase().includes(search);
    return (
      matchesSearch &&
      (filterSource === "all" || r.responseSource === filterSource) &&
      (filterAttendance === "all" || r.attendance === filterAttendance) &&
      (filterSide === "all" || r.side === filterSide)
    );
  });

  if (adminMe.isLoading)
    return (
      <div className="min-h-screen bg-[#f7f2eb] flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#9d7537]" />
      </div>
    );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f2eb] px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#855f24] hover:underline mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retourner à l'invitation
          </Link>
          <div className="card-luxury rounded-[2rem] p-8 md:p-10 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#f4ede1] border border-[#c69a58]/40 flex items-center justify-center mx-auto mb-5">
              <LockKeyhole className="w-7 h-7 text-[#9d7537]" />
            </div>
            <p className="font-script text-3xl text-[#9d7537]">
              Michelle & Marcing
            </p>
            <h1 className="font-serif-luxury text-xl font-bold text-[#2d241e] mt-2">
              Espace réservé aux mariés
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 mb-7">
              Cette partie contient les confirmations, les messages privés et le
              nombre de convives. Entrez le mot de passe partagé entre les
              mariés.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <PasswordField
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                label="Mot de passe de l’espace mariés"
              />
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-3.5 rounded-full gold-gradient text-white font-serif-luxury text-sm font-bold shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Ouvrir l'espace mariés"
                )}
              </button>
            </form>
            <p className="mt-5 text-[11px] text-[#9a8876]">
              Accès privé • Les métriques ne sont jamais visibles sur
              l'invitation publique
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2eb] py-8 px-4 md:px-8 selection:bg-[#c69a58]/30">
      <div className="max-w-6xl mx-auto space-y-8">
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
              Suivi privé des présences pour le mariage de{" "}
              <strong>
                {WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}
              </strong>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                statsQuery.refetch();
                listQuery.refetch();
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#ebdcc8] text-xs font-semibold text-[#5a4632] hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualiser
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!rsvps?.length}
              className="px-4 py-2 rounded-xl gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" /> Exporter CSV
            </button>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              className="px-4 py-2 rounded-xl border border-[#ebdcc8] bg-white text-xs font-semibold text-[#7c6d62] hover:text-rose-700 cursor-pointer"
            >
              Verrouiller
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total personnes"
            value={statsQuery.isLoading ? "..." : (stats?.totalGuests ?? 0)}
            note="Réponses actuelles par code"
            icon={<Users className="w-4 h-4" />}
            tone="gold"
          />
          <StatCard
            label="Présents confirmés par code"
            value={
              statsQuery.isLoading ? "..." : (stats?.attendingResponses ?? 0)
            }
            note="Réponses actuelles liées au code"
            icon={<UserCheck className="w-4 h-4" />}
            tone="green"
          />
          <StatCard
            label="Absences par code"
            value={
              statsQuery.isLoading ? "..." : (stats?.declinedResponses ?? 0)
            }
            note="Réponses actuelles liées au code"
            icon={<UserX className="w-4 h-4" />}
            tone="rose"
          />
          <StatCard
            label="Total réponses"
            value={statsQuery.isLoading ? "..." : (stats?.totalResponses ?? 0)}
            note="Cette campagne de réinscription"
            icon={<Ticket className="w-4 h-4" />}
            tone="gold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label={`Côté ${WEDDING_CONFIG.bride}`}
            value={statsQuery.isLoading ? "..." : (stats?.brideGuests ?? 0)}
            note="Personnes invitées par la mariée"
            icon={<Heart className="w-4 h-4" />}
            tone="gold"
          />
          <StatCard
            label={`Côté ${WEDDING_CONFIG.groom}`}
            value={statsQuery.isLoading ? "..." : (stats?.groomGuests ?? 0)}
            note="Personnes invitées par le marié"
            icon={<Heart className="w-4 h-4" />}
            tone="gold"
          />
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-[#c69a58]/35 bg-[#fcfaf7] px-5 py-4 text-sm text-[#5a4632]">
          <Heart className="w-4 h-4 mt-0.5 shrink-0 text-[#9d7537]" />
          <p>
            Les {stats?.historicalResponses ?? 0} anciennes réponses et les {stats?.historicalMessages ?? 0} anciens mots doux restent conservés et visibles; ils sont séparés des nouvelles réponses par code.
          </p>
        </div>

        <ScheduleTimesAdmin />

        <InviteeRosterAdmin
          onUpdated={async () => {
            await Promise.all([statsQuery.refetch(), listQuery.refetch()]);
          }}
        />

        {unassignedConfirmed.length > 0 && (
          <section className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-amber-950 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold">{unassignedConfirmed.length} invité{unassignedConfirmed.length > 1 ? "s" : ""} confirmé{unassignedConfirmed.length > 1 ? "s" : ""} sans table</p>
                <p className="text-xs mt-1 leading-relaxed">Attribuez leur table par code dans le répertoire privé ci-dessus; le billet correspondant sera actualisé.</p>
                <p className="text-xs mt-2 font-medium">{unassignedConfirmed.slice(0, 5).map(entry => entry.name).join(" · ")}{unassignedConfirmed.length > 5 ? " · …" : ""}</p>
              </div>
            </div>
          </section>
        )}

        <div className="card-luxury rounded-3xl p-6 border-[#ebdcc8]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, code de billet..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ebdcc8] bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Filtrer :</span>
              {(["all", "yes", "no"] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFilterAttendance(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${filterAttendance === filter ? "bg-[#2d241e] text-white" : "bg-white border border-[#ebdcc8] text-[#5a4632]"}`}
                >
                  {filter === "all"
                    ? `Tous (${rsvps?.length || 0})`
                    : filter === "yes"
                      ? `Présents (${stats?.attendingResponses || 0})`
                      : `Absents (${stats?.declinedResponses || 0})`}
                </button>
              ))}
              <span className="w-px h-5 bg-[#ebdcc8] mx-1" />
              {(["all", "code", "historique"] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFilterSource(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${filterSource === filter ? "bg-[#855f24] text-white" : "bg-white border border-[#ebdcc8] text-[#5a4632]"}`}
                >
                  {filter === "all"
                    ? "Toutes les sources"
                    : filter === "code"
                      ? `Par code (${stats?.totalResponses || 0})`
                      : `Historique (${stats?.historicalResponses || 0})`}
                </button>
              ))}
              <span className="w-px h-5 bg-[#ebdcc8] mx-1" />
              {(["all", "bride", "groom"] as const).map(filter => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setFilterSide(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${filterSide === filter ? "bg-[#9d7537] text-white" : "bg-white border border-[#ebdcc8] text-[#5a4632]"}`}
                >
                  {filter === "all" ? "Les deux côtés" : sideLabel(filter)}
                </button>
              ))}
            </div>
          </div>
          {listQuery.isLoading ? (
            <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#9d7537]" />
              <span className="text-xs">Chargement des invités...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              Aucune réponse ne correspond aux critères.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#ebdcc8] text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-3">Billet</th>
                    <th className="py-3 px-3">Nom de l'invité</th>
                    <th className="py-3 px-3">Invité de</th>
                    <th className="py-3 px-3">Moments</th>
                    <th className="py-3 px-3">Table</th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-3 text-center">Convives</th>
                    <th className="py-3 px-3">Message</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebdcc8]/60">
                  {filtered.map(item => (
                    <tr
                      key={`${item.responseSource}-${item.id}`}
                      className="hover:bg-white/60 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        {item.responseSource === "code" ? (
                          <Link
                            href={`/billet/${item.ticketCode}`}
                            className="font-mono font-bold text-[#855f24] hover:underline"
                          >
                            {item.invitationCode || item.ticketCode}
                          </Link>
                        ) : (
                          <span className="font-mono font-bold text-[#7c6d62]">
                            {item.ticketCode}
                          </span>
                        )}
                        <span className="block mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                          {item.responseSource === "code" ? "Réponse par code" : "Historique conservé"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#2d241e]">
                          {item.name}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-xs font-medium text-[#855f24] whitespace-nowrap">
                        {sideLabel(item.side)}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-[#6c4b1a]">
                        {formatEvents(item.events)}
                      </td>
                      <td className="py-3.5 px-3 text-xs whitespace-nowrap">
                        {item.tableNumber ? <span className="font-semibold text-[#855f24]">Table {item.tableNumber} · {item.tableVirtue}</span> : <span className="text-amber-700 font-semibold">À attribuer</span>}
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
                        {item.message || (
                          <span className="text-muted-foreground not-italic">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-muted-foreground">
                        {new Date(item.updatedAt ?? item.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-end gap-1">
                          {item.messageSource === "code" && item.messageId ? (
                            <button
                              type="button"
                              onClick={() => deleteMessage(item.messageId!, item.name)}
                              disabled={deleteMessageMutation.isPending}
                              className="p-2 rounded-lg text-[#9d7537] hover:bg-[#f4ede1] disabled:opacity-30 cursor-pointer"
                              title="Supprimer ce nouveau mot doux"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : item.messageSource === "historique" ? (
                            <span className="px-2 text-[9px] text-[#7c6d62]">Conservé</span>
                          ) : null}
                          {item.responseSource === "code" && (
                            <button
                              type="button"
                              onClick={() => deleteRsvp(item.id, item.name)}
                              disabled={deleteRsvpMutation.isPending}
                              className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Supprimer la réponse par code"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
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

function sideLabel(side: "bride" | "groom" | null) {
  if (side === "bride") return `${WEDDING_CONFIG.bride} (mariée)`;
  if (side === "groom") return `${WEDDING_CONFIG.groom} (marié)`;
  return "—";
}

function StatCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: React.ReactNode;
  tone: "gold" | "green" | "rose";
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-700"
      : tone === "rose"
        ? "text-rose-700"
        : "text-[#855f24]";
  return (
    <div className="card-luxury p-5 rounded-2xl">
      <div className={`flex items-center justify-between mb-2 ${toneClass}`}>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
        {icon}
      </div>
      <span
        className={`font-serif-luxury text-3xl md:text-4xl font-bold ${toneClass}`}
      >
        {value}
      </span>
      <span className="block text-[11px] text-muted-foreground mt-1">
        {note}
      </span>
    </div>
  );
}
