import { ChevronDown, LockKeyhole, UserCheck } from "lucide-react";
import { Link } from "wouter";
import { CountdownSection } from "../components/CountdownSection";
import { GiftsSection } from "../components/GiftsSection";
import { GuestbookSection } from "../components/GuestbookSection";
import { RsvpFormSection } from "../components/RsvpFormSection";
import { ScheduleAndDetailsSection } from "../components/ScheduleAndDetailsSection";
import { DovesHeart, HeartClipDefs, HeartPortrait, ScrollProgress } from "../components/Ornaments";
import { WEDDING_CONFIG } from "../weddingConfig";

const petals = [
  { left: "5%", delay: "0s", duration: "13s", type: "petal" },
  { left: "14%", delay: "3s", duration: "16s", type: "leaf" },
  { left: "25%", delay: "7s", duration: "14s", type: "petal" },
  { left: "38%", delay: "1s", duration: "18s", type: "leaf" },
  { left: "52%", delay: "5s", duration: "15s", type: "petal" },
  { left: "66%", delay: "8s", duration: "17s", type: "leaf" },
  { left: "79%", delay: "2s", duration: "14s", type: "petal" },
  { left: "92%", delay: "6s", duration: "19s", type: "leaf" },
];

function FallingPetals() {
  return (
    <div className="falling-petals" aria-hidden="true">
      {petals.map((item, index) => (
        <span
          key={index}
          className={`falling-petal ${item.type}`}
          style={{ left: item.left, animationDelay: item.delay, animationDuration: item.duration }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const scrollToRsvp = () => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="paper-grain min-h-screen bg-[#faf7f2] flex flex-col selection:bg-[#c69a58]/30">
      <HeartClipDefs />
      <ScrollProgress />
      <div className="bg-[#241a14] text-[#e8dccb] text-[11px] py-1.5 px-4 border-b border-[#3d2e23]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <span className="text-[#c69a58] font-medium hidden sm:inline">Organisation du mariage</span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1 font-medium">
              <LockKeyhole className="w-3 h-3 text-[#dcb46e]" /> Espace Mariés
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/accueil" className="text-[#f7ead4] hover:underline transition-colors flex items-center gap-1 font-semibold">
              <LockKeyhole className="w-3 h-3 text-[#e2c27f]" /> Accès équipe d'accueil
            </Link>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-40 bg-[#faf7f2]/92 backdrop-blur border-b border-[#ebdcc8]/60 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-script text-2xl md:text-3xl text-[#9d7537] group-hover:scale-105 transition-transform whitespace-nowrap">
              M <span className="text-[#c69a58]">&amp;</span> M
            </span>
          </Link>
          <nav className="flex items-center gap-2 md:gap-5 text-xs md:text-sm font-medium">
            <a href="#programme" className="text-[#5a4632] hover:text-[#9d7537] transition-colors hidden sm:inline-block">Le programme</a>
            <a href="#cadeaux" className="text-[#5a4632] hover:text-[#9d7537] transition-colors hidden md:inline-block">Dons</a>
            <button type="button" onClick={scrollToRsvp} className="min-h-[36px] px-3.5 py-1.5 rounded-full gold-gradient text-white font-semibold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /><span>Je réponds</span>
            </button>
            <Link href="/accueil" className="min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#f4ede1] border border-[#c69a58] text-[#855f24] hover:bg-[#ebdcc8] font-semibold text-xs transition-all flex items-center gap-1 shadow-xs" aria-label="Accès équipe d'accueil">
              <LockKeyhole className="w-3.5 h-3.5 text-[#9d7537]" /><span>Équipe accueil</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-reference relative md:min-h-[760px] flex md:items-center justify-center overflow-hidden md:bg-[radial-gradient(ellipse_at_15%_10%,rgba(201,162,74,.22),transparent_55%),radial-gradient(ellipse_at_90%_100%,rgba(201,162,74,.16),transparent_50%)]">
          <div className="absolute inset-x-0 top-0 h-[68svh] overflow-hidden md:inset-auto md:right-[6%] md:top-12 md:bottom-28 md:h-auto md:w-[38%] md:rounded-t-[999px] md:rounded-b-[2rem] md:ring-[3px] md:ring-[#d9b45f] md:shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
            <img src={WEDDING_CONFIG.assets.heroCouple} alt="Michelle et Marcing, enlacés, en tenue de fête ivoire et or" fetchPriority="high" decoding="async" className="hero-photo absolute inset-0 h-full w-full object-cover object-[50%_22%]" />
            <div className="absolute inset-0 md:hidden bg-[linear-gradient(180deg,rgba(25,14,8,.35)_0%,transparent_22%,transparent_52%,#1f1510_99%)]" />
          </div>
          <FallingPetals />

          <div className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-[52svh] pb-28 md:pt-20 md:pb-36 md:pl-12 md:pr-[48%] text-center md:text-left text-white flex flex-col items-center md:items-start [text-shadow:0_2px_14px_rgba(0,0,0,.45)]">
            <DovesHeart className="dove-mark mb-3 h-9 w-32 md:h-12 md:w-40 text-[#f3dfb2]" />
            <p className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[#f3dfb2] font-semibold">Avec la bénédiction de nos familles</p>
            <h1 className="hero-names font-script leading-[0.95] mt-3 [filter:drop-shadow(0_3px_10px_rgba(0,0,0,.55))] [text-shadow:none]">
              <span className="gold-foil text-[4rem] md:text-[6rem] px-2 md:px-0 md:pr-3" style={{ animationDelay: "150ms" }}>{WEDDING_CONFIG.bride}</span>
              <span className="!block text-3xl md:text-4xl text-[#f3dfb2] my-1" style={{ animationDelay: "450ms" }}>&amp;</span>
              <span className="gold-foil text-[4rem] md:text-[6rem] px-2 md:px-0 md:pr-3" style={{ animationDelay: "650ms" }}>{WEDDING_CONFIG.groom}</span>
            </h1>
            <p className="font-serif-luxury text-xl md:text-3xl italic mt-4 max-w-xl leading-snug">
              Nous allons nous dire oui, et notre bonheur ne serait pas complet sans vous.
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#f3dfb2]">
              <span className="h-px w-8 bg-[#f3dfb2]/70" aria-hidden="true" />
              <span className="font-serif-luxury text-lg md:text-2xl font-semibold tracking-[0.12em]">{WEDDING_CONFIG.dateLong}</span>
              <span className="h-px w-8 bg-[#f3dfb2]/70" aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs md:text-sm tracking-[0.32em] uppercase font-semibold">Douala · Cameroun</p>
            <button type="button" onClick={scrollToRsvp} className="mt-7 min-h-[48px] px-7 py-3 rounded-full gold-gradient text-white text-sm md:text-base font-semibold shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer [text-shadow:none]">
              Répondre à l'invitation
            </button>
          </div>
        </section>

        {/* Portraits en cœur, à cheval sur la photo et la suite de la page */}
        <div className="hero-heart-portraits relative z-20 -mt-24 md:-mt-28 flex items-center justify-center">
          <HeartPortrait src={WEDDING_CONFIG.assets.bridePortrait} alt="Michelle, la mariée" className="heart-left" />
          <HeartPortrait src={WEDDING_CONFIG.assets.groomPortrait} alt="Marcing, le marié" className="heart-right" />
        </div>

        <section className="relative pt-8 pb-2 bg-[#faf7f2] text-center px-4">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537]">Le compte à rebours a commencé</p>
          <p className="font-serif-luxury text-xl md:text-3xl italic font-semibold text-[#2d241e] mt-1">Encore un peu de patience avant de devenir une famille</p>
          <div className="mt-2 flex justify-center"><ChevronDown className="w-5 h-5 text-[#c69a58] animate-bounce" /></div>
        </section>

        <CountdownSection />
        <ScheduleAndDetailsSection />
        <GiftsSection />
        <GuestbookSection />
        <RsvpFormSection />
      </main>

      <footer className="mt-auto py-14 px-4 bg-[#231b16] text-[#dfd4c8] text-center border-t border-[#3d2e23]">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-script text-5xl gold-foil pb-1">{WEDDING_CONFIG.bride} &amp; {WEDDING_CONFIG.groom}</p>
          <p className="font-serif-luxury text-sm uppercase tracking-[0.25em] text-[#d9c7ac]">{WEDDING_CONFIG.dateString} · Douala, Cameroun</p>
          <p className="font-serif-luxury italic text-lg text-[#e8dccb] max-w-lg mx-auto">
            Merci de porter notre union dans vos prières et dans vos cœurs. Nous nous réjouissons infiniment de vivre cette journée bénie en votre précieuse compagnie.
          </p>
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#b9a993]">
            <Link href="/admin" className="hover:text-[#d8ab66] transition-colors flex items-center gap-1.5">
              <LockKeyhole className="w-3.5 h-3.5" /> Accès réservé aux mariés
            </Link>
            <Link href="/accueil" className="text-[#f7ead4] bg-white/10 border border-[#c69a58]/60 rounded-full px-4 py-2 hover:bg-white/20 transition-colors flex items-center gap-1.5 font-semibold shadow-sm">
              <LockKeyhole className="w-4 h-4 text-[#e2c27f]" /> Accès équipe d’accueil
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
