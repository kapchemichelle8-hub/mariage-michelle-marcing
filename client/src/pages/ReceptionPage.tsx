import { Camera, Check, CloudOff, Copy, Download, LockKeyhole, RefreshCw, Search, ShieldCheck, Smartphone, StopCircle, UserRoundCheck, Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

type RosterEntry = {
  id: number;
  name: string;
  ticketCode: string;
  guestsCount: number;
  attendance: "yes" | "no";
  events: string | null;
  side: "bride" | "groom" | null;
};

type CheckIn = { at: string; ticketCode: string };
const ROSTER_KEY = "michelle-marcing-reception-roster-v1";
const CHECKINS_KEY = "michelle-marcing-reception-checkins-v1";
const DEVICE_KEY = "michelle-marcing-reception-device-unlocked-v1";

function readJson<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; } catch { return fallback; }
}

function extractTicketCode(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  try { const url = new URL(value); return url.pathname.split("/").filter(Boolean).pop() || value; } catch { return value.split("/").filter(Boolean).pop() || value; }
}

const eventLabel: Record<string, string> = { civil: "Mairie", church: "Église", party: "Soirée" };

export default function ReceptionPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(DEVICE_KEY) === "1");
  const [roster, setRoster] = useState<RosterEntry[]>(() => readJson(ROSTER_KEY, []));
  const [checkins, setCheckins] = useState<Record<string, CheckIn>>(() => readJson(CHECKINS_KEY, {}));
  const [query, setQuery] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [selected, setSelected] = useState<RosterEntry | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanControlsRef = useRef<{ stop: () => void } | null>(null);

  const login = trpc.admin.login.useMutation({
    onSuccess: async () => { localStorage.setItem(DEVICE_KEY, "1"); setUnlocked(true); setPassword(""); toast.success("Téléphone autorisé pour le mode accueil."); await rosterQuery.refetch(); },
    onError: (error) => toast.error(error.message || "Code incorrect."),
  });
  const rosterQuery = trpc.reception.roster.useQuery(undefined, { enabled: unlocked && isOnline, retry: false, staleTime: 5 * 60 * 1000 });

  useEffect(() => {
    const online = () => setIsOnline(true); const offline = () => setIsOnline(false);
    window.addEventListener("online", online); window.addEventListener("offline", offline);
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
  }, []);

  useEffect(() => {
    if (rosterQuery.data && rosterQuery.data.length) { setRoster(rosterQuery.data as RosterEntry[]); localStorage.setItem(ROSTER_KEY, JSON.stringify(rosterQuery.data)); }
  }, [rosterQuery.data]);

  useEffect(() => () => { scanControlsRef.current?.stop(); }, []);

  const filteredRoster = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return roster;
    return roster.filter((entry) => `${entry.name} ${entry.ticketCode}`.toLowerCase().includes(needle));
  }, [query, roster]);

  const markArrival = (rawCode: string) => {
    const code = extractTicketCode(rawCode).toUpperCase();
    const found = roster.find((entry) => entry.ticketCode.toUpperCase() === code);
    if (!found) { setSelected(null); toast.error(`Billet ${code || "inconnu"} introuvable dans la liste préchargée.`); return; }
    setSelected(found);
    if (found.attendance !== "yes") { toast.warning(`${found.name} avait indiqué ne pas pouvoir venir.`); return; }
    const next = { ...checkins, [found.ticketCode]: { at: new Date().toISOString(), ticketCode: found.ticketCode } };
    setCheckins(next); localStorage.setItem(CHECKINS_KEY, JSON.stringify(next));
    toast.success(`${found.name} est marqué(e) comme arrivé(e).`);
  };

  const startScan = async () => {
    if (!videoRef.current) return;
    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader(); setIsScanning(true);
      scanControlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => { if (result) { markArrival(result.getText()); scanControlsRef.current?.stop(); scanControlsRef.current = null; setIsScanning(false); } });
    } catch { setIsScanning(false); toast.error("La caméra n’a pas pu démarrer. Utilisez la saisie manuelle."); }
  };
  const stopScan = () => { scanControlsRef.current?.stop(); scanControlsRef.current = null; setIsScanning(false); };
  const syncRoster = async () => { if (!isOnline) { toast.info("Connectez ce téléphone à Internet pour synchroniser la liste."); return; } const result = await rosterQuery.refetch(); if (result.data?.length) toast.success(`${result.data.length} billets sont disponibles hors connexion.`); };

  if (!unlocked) return (
    <main className="min-h-screen bg-[#2a1d15] text-[#f7ead4] px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-[2rem] bg-[#fffaf2] text-[#2d241e] p-7 md:p-9 shadow-2xl border border-[#c69a58]/50">
        <div className="w-14 h-14 rounded-full gold-gradient text-white flex items-center justify-center mx-auto"><LockKeyhole className="w-6 h-6" /></div>
        <p className="font-script text-3xl text-[#9d7537] text-center mt-4">Michelle & Marcing</p>
        <h1 className="font-serif-luxury text-3xl text-center font-bold mt-1">Espace Accueil</h1>
        <p className="text-sm text-center text-[#7c6d62] mt-3 leading-relaxed">À ouvrir une première fois avec Internet sur chaque téléphone. La liste sera ensuite conservée pour le scan hors connexion.</p>
        <form onSubmit={(event) => { event.preventDefault(); login.mutate({ password }); }} className="mt-6 space-y-3"><label className="text-sm font-semibold block">Code d’accès</label><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" className="w-full rounded-xl border border-[#e1cfb5] px-4 py-3 outline-none focus:ring-2 focus:ring-[#c69a58]" /><button disabled={login.isPending} className="w-full rounded-full gold-gradient text-white py-3.5 font-semibold cursor-pointer disabled:opacity-60">{login.isPending ? "Ouverture…" : "Préparer ce téléphone"}</button></form>
        <p className="text-xs text-center text-[#7c6d62] mt-5 flex gap-1.5 items-center justify-center"><Wifi className="w-3.5 h-3.5" /> Internet nécessaire uniquement pour la première préparation</p>
        <Link href="/" className="block text-center text-sm text-[#855f24] underline underline-offset-4 mt-5">Retour à l’invitation</Link>
      </section>
    </main>
  );

  return (
    <main className="reception-page min-h-screen bg-[#faf7f2] text-[#2d241e] pb-12">
      <header className="bg-[#2a1d15] text-[#f7ead4] px-4 py-5 shadow-lg"><div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4"><div><p className="font-script text-3xl text-[#e2c27f]">Michelle & Marcing</p><h1 className="font-serif-luxury text-2xl font-bold">Équipe d’accueil</h1></div><div className="flex items-center gap-2"><div className="flex items-center gap-2 text-xs rounded-full px-3 py-2 border border-[#c69a58]/50">{isOnline ? <Wifi className="w-4 h-4 text-[#dcb46e]" /> : <WifiOff className="w-4 h-4 text-[#f6b6a5]" />} {isOnline ? "En ligne" : "Hors connexion — mode local"}</div><button type="button" onClick={() => { stopScan(); localStorage.removeItem(DEVICE_KEY); setUnlocked(false); }} className="rounded-full border border-[#c69a58]/50 p-2 text-[#e2c27f] hover:bg-white/10 cursor-pointer" aria-label="Verrouiller ce téléphone"><LockKeyhole className="w-4 h-4" /></button></div></div></header>
      <div className="max-w-6xl mx-auto px-4 pt-7 space-y-6">
        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
          <div className="card-luxury rounded-[1.6rem] p-5 md:p-7"><div className="flex items-center justify-between gap-3 mb-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">Contrôle rapide</p><h2 className="font-serif-luxury text-2xl font-bold">Scanner un billet</h2></div><ShieldCheck className="w-7 h-7 text-[#9d7537]" /></div><div className="rounded-2xl bg-[#2a1d15] overflow-hidden aspect-video relative"><video ref={videoRef} className={`w-full h-full object-cover ${isScanning ? "" : "hidden"}`} muted playsInline /><div className={`${isScanning ? "hidden" : "flex"} absolute inset-0 items-center justify-center flex-col gap-3 text-[#f7ead4]`}><Camera className="w-10 h-10 text-[#dcb46e]" /><p className="text-sm">La caméra est prête à scanner le QR code</p></div><div className="absolute inset-8 border-2 border-[#e2c27f]/80 rounded-2xl pointer-events-none" /></div><div className="grid grid-cols-2 gap-3 mt-4"><button type="button" onClick={isScanning ? stopScan : startScan} className="rounded-xl gold-gradient text-white py-3 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer">{isScanning ? <><StopCircle className="w-4 h-4" /> Arrêter</> : <><Camera className="w-4 h-4" /> Démarrer le scan</>}</button><button type="button" onClick={() => { const code = window.prompt("Entrez le numéro du billet"); if (code) markArrival(code); }} className="rounded-xl border border-[#c69a58] text-[#855f24] py-3 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"><Copy className="w-4 h-4" /> Saisie manuelle</button></div><p className="text-xs text-[#7c6d62] mt-3 flex items-start gap-1.5"><CloudOff className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Le QR est lu par ce téléphone, sans appel Internet. Les arrivées restent enregistrées localement.</p></div>
          <div className="card-luxury rounded-[1.6rem] p-5 md:p-7"><div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">Préparation du téléphone</p><h2 className="font-serif-luxury text-2xl font-bold">Liste hors connexion</h2></div><button type="button" onClick={syncRoster} className="rounded-full border border-[#c69a58] p-2 text-[#855f24] hover:bg-[#f4ede1] cursor-pointer" aria-label="Synchroniser la liste"><RefreshCw className="w-4 h-4" /></button></div><p className="text-sm text-[#5a4632] leading-relaxed mt-3">Cette liste est copiée dans le téléphone lors de la préparation. Même si le réseau disparaît à la salle, le nom et le billet restent vérifiables.</p><div className="mt-5 rounded-2xl bg-[#f4ede1] p-4"><div className="flex items-center justify-between text-sm"><span>Billets préchargés</span><strong className="text-[#855f24]">{roster.length}</strong></div><div className="flex items-center justify-between text-sm mt-2"><span>Arrivées sur ce téléphone</span><strong className="text-[#855f24]">{Object.keys(checkins).length}</strong></div></div><div className="mt-5 flex items-start gap-2 text-xs text-[#7c6d62]">{isOnline ? <Wifi className="w-4 h-4 text-[#9d7537] shrink-0" /> : <WifiOff className="w-4 h-4 text-[#9d7537] shrink-0" />}<span>{isOnline ? "Vous pouvez actualiser la liste avant de partir vers la salle." : "Le téléphone fonctionne actuellement sur sa copie locale."}</span></div><Link href="/badge-accueil" className="mt-5 inline-flex w-full justify-center items-center gap-2 rounded-xl border border-[#c69a58] text-[#855f24] py-3 font-semibold text-sm hover:bg-[#f4ede1]">Imprimer les badges de l’équipe</Link></div>
        </section>

        {selected && <section className={`rounded-[1.6rem] p-5 border-2 shadow-sm ${selected.attendance === "yes" ? "bg-[#f8f5e9] border-[#c69a58]" : "bg-[#f7e8e3] border-[#d79b8a]"}`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">Résultat du scan</p><h2 className="font-serif-luxury text-3xl font-bold mt-1">{selected.name}</h2><p className="text-sm mt-1">Billet <strong>{selected.ticketCode}</strong> · {selected.guestsCount} {selected.guestsCount > 1 ? "personnes" : "personne"}</p><p className="text-sm mt-2">{selected.events?.split(",").map((event) => eventLabel[event] || event).join(" · ") || "Moment non précisé"}</p></div><div className="rounded-full bg-white/80 p-3">{checkins[selected.ticketCode] ? <UserRoundCheck className="w-7 h-7 text-[#7b8c4b]" /> : <Search className="w-7 h-7 text-[#9d7537]" />}</div></div></section>}

        <section className="card-luxury rounded-[1.6rem] p-5 md:p-7"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"><div><p className="text-xs uppercase tracking-[0.18em] text-[#855f24] font-semibold">Recherche de secours</p><h2 className="font-serif-luxury text-2xl font-bold">Liste des invités</h2></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 w-4 h-4 text-[#9d7537]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom ou numéro de billet" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e1cfb5] bg-white text-sm outline-none focus:ring-2 focus:ring-[#c69a58]" /></div></div><div className="grid md:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">{filteredRoster.map((entry) => <button key={entry.ticketCode} type="button" onClick={() => markArrival(entry.ticketCode)} className={`text-left rounded-xl border px-3.5 py-3 transition-colors cursor-pointer ${checkins[entry.ticketCode] ? "bg-[#eef2dc] border-[#b6c78a]" : "bg-white border-[#ebdcc8] hover:border-[#c69a58]"}`}><div className="flex justify-between gap-3"><span className="font-semibold text-sm truncate">{entry.name}</span><span className="font-mono text-xs text-[#855f24]">{entry.ticketCode}</span></div><div className="flex justify-between gap-3 mt-1 text-xs text-[#7c6d62]"><span>{entry.guestsCount} {entry.guestsCount > 1 ? "personnes" : "personne"} · {entry.events?.split(",").map((event) => eventLabel[event] || event).join(", ") || "—"}</span><span>{checkins[entry.ticketCode] ? <Check className="w-4 h-4 text-[#71863e]" /> : "Marquer arrivée"}</span></div></button>)}{!filteredRoster.length && <p className="text-sm text-[#7c6d62] py-4">Aucun billet ne correspond à cette recherche.</p>}</div></section>
        <p className="text-center text-xs text-[#7c6d62] flex items-center justify-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Pour chaque téléphone : préparer la liste en ligne avant le départ, puis activer le mode avion à la salle pour tester le fonctionnement hors connexion.</p>
      </div>
    </main>
  );
}
