import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { DovesHeart } from "@/components/Ornaments";
import { setAdminToken, trpc } from "@/lib/trpc";
import { sideLabel } from "@shared/rsvpConstants";

type Row = {
  id: number;
  name: string;
  attendance: "yes" | "no";
  side: "mariee" | "marie";
  guestsCount: number;
  message: string | null;
  ticketCode: string | null;
  createdAt: Date;
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

function LoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({ onSuccess: (r) => onSuccess(r.token) });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password) login.mutate({ password });
  };

  return (
    <main className="paper grid min-h-[100svh] place-items-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[2rem] border border-sand bg-white/90 p-8 text-center shadow-xl">
        <DovesHeart className="mx-auto h-8 w-28 text-gold" />
        <h1 className="mt-4 text-3xl">Espace Mariés</h1>
        <p className="mt-2 text-sm text-muted">Cet espace est réservé à Michelle et Marcing.</p>
        <label htmlFor="admin-password" className="sr-only">
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          className="field mt-6 text-center"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {login.error && (
          <p role="alert" className="mt-3 text-sm text-red-800">
            {login.error.message}
          </p>
        )}
        <button type="submit" disabled={login.isPending || !password} className="btn-gold mt-5 w-full">
          {login.isPending ? <span className="spinner" aria-hidden="true" /> : null}
          Entrer
        </button>
        <Link href="/" className="mt-5 inline-block text-sm text-gold-deep underline underline-offset-4">
          ← Retourner à l’invitation
        </Link>
      </form>
    </main>
  );
}

function ConfirmDelete({ row, onCancel, onConfirm, pending }: { row: Row; onCancel: () => void; onConfirm: () => void; pending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/60 px-5" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-md rounded-[1.6rem] bg-ivory p-7 shadow-2xl">
        <h2 id="confirm-title" className="text-2xl">Supprimer cette réponse ?</h2>
        <p className="mt-3 text-ink">
          La réponse de <strong className="font-medium">{row.name}</strong> (n° {row.id})
          {row.message ? " et son mot doux seront" : " sera"} définitivement supprimé{row.message ? "s" : "e"}.
          Cette action est irréversible.
        </p>
        <p className="mt-2 text-sm text-muted">Pensez à exporter le CSV avant, par précaution.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="btn-ghost" autoFocus>
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-800 px-5 py-2.5 text-ivory hover:bg-red-900"
          >
            {pending ? <span className="spinner" aria-hidden="true" /> : null}
            Oui, supprimer cette réponse
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const utils = trpc.useUtils();
  const stats = trpc.admin.stats.useQuery();
  const list = trpc.admin.listRsvps.useQuery();
  const [filter, setFilter] = useState<"all" | "yes" | "no">("all");
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [exporting, setExporting] = useState(false);

  const remove = trpc.admin.deleteRsvp.useMutation({
    onSuccess: async () => {
      setToDelete(null);
      await Promise.all([utils.admin.stats.invalidate(), utils.admin.listRsvps.invalidate()]);
    },
  });

  // Session expirée : retour automatique à la demande de mot de passe.
  const unauthorized = [stats.error, list.error, remove.error].some((e) => e?.data?.code === "UNAUTHORIZED");
  useEffect(() => {
    if (unauthorized) onLogout();
  }, [unauthorized, onLogout]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      const { csv, filename } = await utils.admin.exportCsv.fetch();
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const rows = (list.data ?? []).filter((r) => filter === "all" || r.attendance === filter);
  const s = stats.data;
  const cards = s
    ? [
        { label: "Réponses", value: s.responses },
        { label: "Présents", value: s.present },
        { label: "Total convives", value: s.totalGuests },
        { label: "Absents", value: s.absent },
        { label: "Convives côté mariée", value: s.guestsMariee },
        { label: "Convives côté marié", value: s.guestsMarie },
      ]
    : [];

  return (
    <main className="min-h-[100svh] bg-cream/50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Espace privé</p>
            <h1 className="text-3xl sm:text-4xl">Les réponses de nos invités</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={exportCsv} disabled={exporting} className="btn-ghost text-sm">
              {exporting ? "Export…" : "Exporter en CSV"}
            </button>
            <button type="button" onClick={onLogout} className="btn-gold text-sm">
              Se déconnecter
            </button>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" aria-label="Statistiques">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-sand bg-white/90 p-4">
              <p className="font-serif text-4xl text-cocoa tabular-nums">{c.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">{c.label}</p>
            </div>
          ))}
          {stats.isLoading && <p className="col-span-full text-muted">Chargement…</p>}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "yes", "no"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  filter === f ? "border-gold bg-gold/15 text-cocoa" : "border-sand bg-white/70 text-muted"
                }`}
              >
                {f === "all" ? "Toutes" : f === "yes" ? "Présents" : "Absents"}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-3">
            {rows.map((r) => (
              <li key={r.id} className="rounded-2xl border border-sand bg-white/90 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-cocoa">
                      {r.name}{" "}
                      <span
                        className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                          r.attendance === "yes" ? "bg-emerald-50 text-emerald-800" : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {r.attendance === "yes" ? `Présent · ${r.guestsCount} pers.` : "Absent"}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {sideLabel(r.side)} · {dateFormat.format(new Date(r.createdAt))}
                      {r.ticketCode ? ` · ${r.ticketCode}` : ""} · n° {r.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setToDelete(r)}
                    className="text-xs text-red-800/80 underline underline-offset-4 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </div>
                {r.message && <p className="mt-3 whitespace-pre-line font-serif text-lg leading-snug text-ink">« {r.message} »</p>}
              </li>
            ))}
            {list.data && rows.length === 0 && <li className="text-muted">Aucune réponse pour l’instant.</li>}
          </ul>
        </section>
      </div>

      {toDelete && (
        <ConfirmDelete
          row={toDelete}
          pending={remove.isPending}
          onCancel={() => setToDelete(null)}
          onConfirm={() => remove.mutate({ id: toDelete.id, confirm: true })}
        />
      )}
    </main>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    document.title = "Espace Mariés — Michelle & Marcing";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    // En quittant l'espace privé, la session est verrouillée et les données effacées du cache.
    return () => {
      robots.remove();
      setAdminToken(null);
      utils.admin.stats.reset();
      utils.admin.listRsvps.reset();
    };
  }, [utils]);

  const logout = () => {
    setAdminToken(null);
    setToken(null);
    utils.admin.stats.reset();
    utils.admin.listRsvps.reset();
  };

  if (!token) {
    return (
      <LoginForm
        onSuccess={(t) => {
          setAdminToken(t);
          setToken(t);
        }}
      />
    );
  }
  return <Dashboard onLogout={logout} />;
}
