import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle, Download, KeyRound, Loader2, LockKeyhole, Mail, RefreshCw, Search, Ticket, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { WEDDING_CONFIG } from "../weddingConfig";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAttendance, setFilterAttendance] = useState<"all" | "yes" | "no">("all");

  const adminMe = trpc.admin.me.useQuery();
  const isAuthenticated = adminMe.data?.authenticated === true;
  const statsQuery = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const listQuery = trpc.admin.listRsvps.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const stats = statsQuery.data;
  const rsvps = listQuery.data;

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: async () => {
      setPassword("");
      await Promise.all([adminMe.refetch(), statsQuery.refetch(), listQuery.refetch()]);
      toast.success("Bienvenue dans l'espace réservé aux mariés.");
    },
    onError: (error) => toast.error(error.message || "Mot de passe incorrect"),
  });
  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => { adminMe.refetch(); toast.success("Espace mariés verrouillé."); },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    return () => {
      // Toute navigation hors de l’espace privé invalide aussi la session côté serveur.
      logoutMutation.mutate();
    };
    // Le nettoyage doit être lié uniquement à la sortie de cette page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
  const deleteRsvpMutation = trpc.admin.deleteRsvp.useMutation({
    onSuccess: async () => { await Promise.all([statsQuery.refetch(), listQuery.refetch()]); toast.success("Confirmation supprimée."); },
    onError: (error) => toast.error(error.message),
  });
  const deleteMessageMutation = trpc.admin.deleteGuestbookMessage.useMutation({
    onSuccess: async () => { await listQuery.refetch(); toast.success("Mot d'or supprimé."); },
    onError: (error) => toast.error(error.message),
  });

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim()) return toast.error("Veuillez entrer le mot de passe.");
    loginMutation.mutate({ password });
  };

  const handleExportCsv = () => {
    if (!rsvps?.length) return;
    const headers = ["Code Billet", "Nom", "Email", "Présence", "Nombre de personnes", "Message", "Date de réponse"];
    const rows = rsvps.map((r) => [
      `"${r.ticketCode}"`, `"${r.name.replace(/"/g, '""')}"`, `"${(r.email || "").replace(/"/g, '""')}"`,
      r.attendance === "yes" ? "Oui" : "Non", r.guestsCount, `"${(r.message || "").replace(/"/g, '""')}"`, `"${new Date(r.createdAt).toLocaleString("fr-FR")}"`,
    ]);
    const blob = new Blob(["\uFEFF" + [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invites_mariage_michelle_marcing_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteRsvp = (id: number, name: string) => {
    if (window.confirm(`Supprimer définitivement la confirmation de ${name} ?`)) deleteRsvpMutation.mutate({ id });
  };
  const deleteMessage = (id: number, name: string) => {
    if (window.confirm(`Supprimer le mot d'or laissé par ${name} ?`)) deleteMessageMutation.mutate({ id });
  };

  const filtered = (rsvps || []).filter((r) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = r.name.toLowerCase().includes(search) || (r.email || "").toLowerCase().includes(search) || r.ticketCode.toLowerCase().includes(search);
    return matchesSearch && (filterAttendance === "all" || r.attendance === filterAttendance);
  });

  if (adminMe.isLoading) return <div className="min-h-screen bg-[#f7f2eb] flex items-center justify-center"><Loader2 className="w-7 h-7 animate-spin text-[#9d7537]" /></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f2eb] px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-[#855f24] hover:underline mb-8"><ArrowLeft className="w-3.5 h-3.5" /> Retourner à l'invitation</Link>
          <div className="card-luxury rounded-[2rem] p-8 md:p-10 text-center shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#f4ede1] border border-[#c69a58]/40 flex items-center justify-center mx-auto mb-5"><LockKeyhole className="w-7 h-7 text-[#9d7537]" /></div>
            <p className="font-script text-3xl text-[#9d7537]">Michelle & Marcing</p>
            <h1 className="font-serif-luxury text-xl font-bold text-[#2d241e] mt-2">Espace réservé aux mariés</h1>
            <p className="text-xs text-muted-foreground leading-relaxed mt-3 mb-7">Cette partie contient les confirmations, les messages privés et le nombre de convives. Entrez le mot de passe partagé entre les mariés.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><KeyRound className="w-4 h-4 text-[#9d7537] absolute left-3 top-1/2 -translate-y-1/2" /><input type="password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#ebdcc8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c69a58]" /></div>
              <button type="submit" disabled={loginMutation.isPending} className="w-full py-3.5 rounded-full gold-gradient text-white font-serif-luxury text-sm font-bold shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60">{loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Ouvrir l'espace mariés"}</button>
            </form>
            <p className="mt-5 text-[11px] text-[#9a8876]">Accès privé • Les métriques ne sont jamais visibles sur l'invitation publique</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f2eb] py-8 px-4 md:px-8 selection:bg-[#c69a58]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#ebdcc8]">
          <div><Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#855f24] hover:underline mb-2"><ArrowLeft className="w-3.5 h-3.5" /> Voir le site invité</Link><h1 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#2d241e]">Espace Organisation & Réponses</h1><p className="text-xs md:text-sm text-muted-foreground">Suivi privé des présences pour la dot de <strong>{WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}</strong>.</p></div>
          <div className="flex items-center gap-2 flex-wrap"><button type="button" onClick={() => { statsQuery.refetch(); listQuery.refetch(); }} className="px-4 py-2 rounded-xl bg-white border border-[#ebdcc8] text-xs font-semibold text-[#5a4632] hover:bg-muted transition-colors flex items-center gap-1.5 cursor-pointer"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button><button type="button" onClick={handleExportCsv} disabled={!rsvps?.length} className="px-4 py-2 rounded-xl gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"><Download className="w-3.5 h-3.5" /> Exporter CSV</button><button type="button" onClick={() => logoutMutation.mutate()} className="px-4 py-2 rounded-xl border border-[#ebdcc8] bg-white text-xs font-semibold text-[#7c6d62] hover:text-rose-700 cursor-pointer">Verrouiller</button></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total personnes" value={statsQuery.isLoading ? "..." : stats?.totalGuests ?? 0} note="Convives à table" icon={<Users className="w-4 h-4" />} tone="gold" />
          <StatCard label="Présents confirmés" value={statsQuery.isLoading ? "..." : stats?.attendingResponses ?? 0} note="Invitations validées" icon={<UserCheck className="w-4 h-4" />} tone="green" />
          <StatCard label="Absences déclarées" value={statsQuery.isLoading ? "..." : stats?.declinedResponses ?? 0} note="Ne pourront pas être là" icon={<UserX className="w-4 h-4" />} tone="rose" />
          <StatCard label="Total réponses" value={statsQuery.isLoading ? "..." : stats?.totalResponses ?? 0} note="Formulaires reçus" icon={<Ticket className="w-4 h-4" />} tone="gold" />
        </div>

        <div className="card-luxury rounded-3xl p-6 border-[#ebdcc8]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6"><div className="relative flex-1 max-w-md"><Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher par nom, code de billet..." className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ebdcc8] bg-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#c69a58]" /></div><div className="flex items-center gap-2 flex-wrap"><span className="text-xs text-muted-foreground">Filtrer :</span>{(["all", "yes", "no"] as const).map((filter) => <button key={filter} type="button" onClick={() => setFilterAttendance(filter)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${filterAttendance === filter ? "bg-[#2d241e] text-white" : "bg-white border border-[#ebdcc8] text-[#5a4632]"}`}>{filter === "all" ? `Tous (${rsvps?.length || 0})` : filter === "yes" ? `Présents (${stats?.attendingResponses || 0})` : `Absents (${stats?.declinedResponses || 0})`}</button>)}</div></div>
          {listQuery.isLoading ? <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin text-[#9d7537]" /><span className="text-xs">Chargement des invités...</span></div> : filtered.length === 0 ? <div className="py-16 text-center text-muted-foreground text-xs">Aucune réponse ne correspond aux critères.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs md:text-sm"><thead><tr className="border-b border-[#ebdcc8] text-[11px] uppercase tracking-wider text-muted-foreground"><th className="py-3 px-3">Billet</th><th className="py-3 px-3">Nom de l'invité</th><th className="py-3 px-3">Statut</th><th className="py-3 px-3 text-center">Convives</th><th className="py-3 px-3">Message</th><th className="py-3 px-3">Date</th><th className="py-3 px-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#ebdcc8]/60">{filtered.map((item) => <tr key={item.id} className="hover:bg-white/60 transition-colors"><td className="py-3.5 px-3"><Link href={`/billet/${item.ticketCode}`} className="font-mono font-bold text-[#855f24] hover:underline">{item.ticketCode}</Link></td><td className="py-3.5 px-3"><div className="font-medium text-[#2d241e]">{item.name}</div>{item.email && <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {item.email}</span>}</td><td className="py-3.5 px-3">{item.attendance === "yes" ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold"><CheckCircle className="w-3 h-3" /> Présent</span> : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">Absent</span>}</td><td className="py-3.5 px-3 text-center font-bold text-[#2d241e]">{item.attendance === "yes" ? item.guestsCount : 0}</td><td className="py-3.5 px-3 max-w-xs text-xs text-[#5a4632] italic truncate">{item.message || <span className="text-muted-foreground not-italic">—</span>}</td><td className="py-3.5 px-3 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td><td className="py-3.5 px-3"><div className="flex items-center justify-end gap-1"><button type="button" onClick={() => item.message && deleteMessage(item.id, item.name)} disabled={!item.message || deleteMessageMutation.isPending} className="p-2 rounded-lg text-[#9d7537] hover:bg-[#f4ede1] disabled:opacity-30 cursor-pointer" title="Supprimer le mot d'or"><Trash2 className="w-3.5 h-3.5" /></button><button type="button" onClick={() => deleteRsvp(item.id, item.name)} disabled={deleteRsvpMutation.isPending} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer" title="Supprimer la confirmation"><Trash2 className="w-3.5 h-3.5" /></button></div></td></tr>)}</tbody></table></div>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, note, icon, tone }: { label: string; value: string | number; note: string; icon: React.ReactNode; tone: "gold" | "green" | "rose" }) {
  const toneClass = tone === "green" ? "text-emerald-700" : tone === "rose" ? "text-rose-700" : "text-[#855f24]";
  return <div className="card-luxury p-5 rounded-2xl"><div className={`flex items-center justify-between mb-2 ${toneClass}`}><span className="text-xs font-semibold uppercase tracking-wider">{label}</span>{icon}</div><span className={`font-serif-luxury text-3xl md:text-4xl font-bold ${toneClass}`}>{value}</span><span className="block text-[11px] text-muted-foreground mt-1">{note}</span></div>;
}
