import { trpc } from "@/lib/trpc";
import { Download, Loader2, Save, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  onUpdated: () => Promise<unknown>;
};

function csvCell(value: string | number | null | undefined) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function InviteeRosterAdmin({ onUpdated }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingTables, setPendingTables] = useState<Record<string, string>>({});
  const invitationsQuery = trpc.admin.listInvitations.useQuery(undefined, {
    retry: false,
  });
  const tablesQuery = trpc.admin.listWeddingTables.useQuery(undefined, {
    retry: false,
  });

  const assignMutation = trpc.admin.assignInvitationTable.useMutation({
    onSuccess: async (_result, variables) => {
      setPendingTables(previous => {
        const next = { ...previous };
        delete next[variables.code];
        return next;
      });
      await Promise.all([invitationsQuery.refetch(), onUpdated()]);
      toast.success(`Affectation mise à jour pour ${variables.code}.`);
    },
    onError: error => toast.error(error.message || "Impossible d’enregistrer la table."),
  });

  const invitations = invitationsQuery.data ?? [];
  const tables = tablesQuery.data ?? [];
  const unassigned = invitations.filter(invite => !invite.tableNumber).length;
  const filtered = useMemo(() => {
    const needle = searchTerm.trim().toLocaleLowerCase();
    return invitations
      .filter(invite =>
        !needle ||
        `${invite.code} ${invite.name} ${invite.tableNumber ?? ""} ${invite.tableVirtue ?? ""}`
          .toLocaleLowerCase()
          .includes(needle)
      )
      .sort((a, b) => {
        const unassignedFirst = Number(Boolean(a.tableNumber)) - Number(Boolean(b.tableNumber));
        return unassignedFirst || a.code.localeCompare(b.code);
      });
  }, [invitations, searchTerm]);

  const exportRoster = () => {
    if (!invitations.length) return;
    const headers = ["Code invité", "Nom de la liste", "Côté", "N° de table", "Nom de la table"];
    const rows = [...invitations]
      .sort((a, b) => a.code.localeCompare(b.code))
      .map(invite => [
        invite.code,
        invite.name,
        invite.side === "bride" ? "Michelle" : "Marcing",
        invite.tableNumber ?? "",
        invite.tableVirtue ?? "",
      ]);
    const content = [headers, ...rows]
      .map(row => row.map(csvCell).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codes_invites_michelle_marcing_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveTable = (code: string, currentTable: string | null) => {
    const selected = pendingTables[code] ?? currentTable ?? "";
    if (selected === (currentTable ?? "")) return;
    assignMutation.mutate({ code, tableNumber: selected || null });
  };

  return (
    <section className="card-luxury rounded-3xl p-5 md:p-6 border border-[#ebdcc8]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">
            <Users className="w-4 h-4" /> Répertoire privé par code
          </p>
          <h2 className="font-serif-luxury text-xl md:text-2xl font-bold mt-1 text-[#2d241e]">
            Invitations & tables
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {invitations.length} codes au total · {unassigned} table{unassigned === 1 ? "" : "s"} à attribuer. Recherchez par code ou nom, puis enregistrez le placement.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative min-w-0 sm:w-72">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Code, nom ou table…"
              aria-label="Rechercher un code d’invitation"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#ebdcc8] bg-white text-sm outline-none focus:ring-2 focus:ring-[#c69a58]"
            />
          </div>
          <button
            type="button"
            onClick={exportRoster}
            disabled={!invitations.length}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Exporter les codes
          </button>
        </div>
      </div>

      {invitationsQuery.isLoading || tablesQuery.isLoading ? (
        <div className="py-10 flex justify-center text-[#9d7537]">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : invitationsQuery.error || tablesQuery.error ? (
        <p className="rounded-xl bg-rose-50 text-rose-800 p-4 text-sm">
          Le répertoire privé n’a pas pu être chargé. Vérifiez votre session administrateur et réessayez.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Aucun code ne correspond à cette recherche.</p>
      ) : (
        <div className="max-h-[560px] overflow-auto rounded-xl border border-[#ebdcc8] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#f7f2eb] text-[10px] uppercase tracking-wider text-[#7c6d62]">
              <tr>
                <th className="px-3 py-3">Code</th>
                <th className="px-3 py-3">Nom de la liste</th>
                <th className="px-3 py-3">Côté</th>
                <th className="px-3 py-3 min-w-[260px]">Table attribuée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebdcc8]/70">
              {filtered.map(invite => {
                const current = invite.tableNumber ?? "";
                const selected = pendingTables[invite.code] ?? current;
                const changed = selected !== current;
                return (
                  <tr key={invite.code} className="hover:bg-[#fcfaf7]">
                    <td className="px-3 py-2.5 font-mono font-bold text-[#855f24] whitespace-nowrap">{invite.code}</td>
                    <td className="px-3 py-2.5 text-[#2d241e]">{invite.name}</td>
                    <td className="px-3 py-2.5 text-[#7c6d62] whitespace-nowrap">
                      {invite.side === "bride" ? "Michelle" : "Marcing"}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <select
                          value={selected}
                          onChange={event =>
                            setPendingTables(previous => ({
                              ...previous,
                              [invite.code]: event.target.value,
                            }))
                          }
                          aria-label={`Attribuer une table à ${invite.code}`}
                          className="min-w-0 flex-1 px-2.5 py-2 rounded-lg border border-[#ebdcc8] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
                        >
                          <option value="">Non attribuée</option>
                          {tables.map(table => (
                            <option key={table.tableNumber} value={table.tableNumber}>
                              Table {table.tableNumber} · {table.tableVirtue}
                            </option>
                          ))}
                        </select>
                        {changed && (
                          <button
                            type="button"
                            onClick={() => saveTable(invite.code, invite.tableNumber)}
                            disabled={assignMutation.isPending}
                            aria-label={`Enregistrer la table de ${invite.code}`}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#2d241e] px-2.5 py-2 text-[10px] font-semibold text-white hover:bg-[#5a4632] disabled:opacity-50"
                          >
                            <Save className="w-3 h-3" /> Enregistrer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
