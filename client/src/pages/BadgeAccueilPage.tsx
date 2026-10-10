import { ArrowLeft, Download, Heart, Printer, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const DEFAULT_NAMES = ["Responsable accueil", "Accueil invités", "Contrôle billets", "Orientation"];

export default function BadgeAccueilPage() {
  const [names, setNames] = useState(() => { try { return JSON.parse(localStorage.getItem("michelle-marcing-badge-names-v1") || "null") || DEFAULT_NAMES; } catch { return DEFAULT_NAMES; } });
  const update = (index: number, value: string) => { const next = names.map((name: string, i: number) => i === index ? value : name); setNames(next); localStorage.setItem("michelle-marcing-badge-names-v1", JSON.stringify(next)); };
  return (
    <main className="badge-page min-h-screen bg-[#faf7f2] text-[#2d241e] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 print:hidden"><Link href="/accueil" className="inline-flex items-center gap-2 text-sm text-[#855f24] font-semibold"><ArrowLeft className="w-4 h-4" /> Retour à l’accueil</Link><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full gold-gradient text-white px-5 py-3 font-semibold cursor-pointer"><Printer className="w-4 h-4" /> Imprimer les badges</button></div>
        <section className="card-luxury rounded-[1.8rem] p-5 md:p-7 mb-8 print:hidden"><p className="text-xs uppercase tracking-[0.2em] text-[#855f24] font-semibold">Préparation avant le jour J</p><h1 className="font-serif-luxury text-3xl md:text-4xl font-bold mt-1">Badges de l’équipe d’accueil</h1><p className="text-sm text-[#5a4632] mt-2 max-w-2xl">Modifiez les noms si nécessaire, puis imprimez cette page. Découpez les cartes et glissez-les dans des porte-badges transparents.</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">{names.map((name: string, index: number) => <label key={index} className="text-xs font-semibold text-[#5a4632]">Badge {index + 1}<input value={name} onChange={(event) => update(index, event.target.value)} className="mt-1 w-full rounded-xl border border-[#e1cfb5] bg-white px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-[#c69a58]" /></label>)}</div></section>
        <section className="badge-print-area grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">{names.map((name: string, index: number) => <article key={index} className="reception-badge relative overflow-hidden rounded-[1.5rem] border-2 border-[#c69a58] bg-[#2a1d15] text-[#f7ead4] p-6 min-h-[250px] flex flex-col justify-between shadow-xl"><div className="absolute -right-12 -top-14 w-44 h-44 rounded-full border border-[#c69a58]/30" /><div className="absolute -left-16 -bottom-20 w-48 h-48 rounded-full border border-[#c69a58]/20" /><div className="relative flex items-center justify-between"><span className="font-script text-3xl text-[#e2c27f]">M&M</span><Heart className="w-5 h-5 text-[#e2c27f] fill-[#e2c27f]/20" /></div><div className="relative text-center py-4"><p className="text-[11px] uppercase tracking-[0.26em] text-[#e2c27f] font-semibold">Équipe d’accueil</p><h2 className="font-serif-luxury text-3xl font-bold mt-2 text-white break-words">{name || "Accueil"}</h2><p className="text-xs text-[#e8dccb] mt-2">Michelle & Marcing · 26 décembre 2026</p></div><div className="relative flex items-center justify-between border-t border-[#c69a58]/40 pt-3 text-[10px] uppercase tracking-[0.16em] text-[#e2c27f]"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Accueil officiel</span><span>Badge {String(index + 1).padStart(2, "0")}</span></div></article>)}</section>
        <p className="text-center text-xs text-[#7c6d62] mt-6 print:hidden"><Download className="w-3.5 h-3.5 inline mr-1" /> Conseil : imprimez sur papier épais puis plastifiez ou utilisez un porte-badge.</p>
      </div>
    </main>
  );
}
