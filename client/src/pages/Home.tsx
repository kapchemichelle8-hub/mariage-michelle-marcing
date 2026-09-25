import { Bird, Calendar, ChevronDown, Heart, LockKeyhole, Sparkles, UserCheck } from "lucide-react";
import { Link } from "wouter";
import { CountdownSection } from "../components/CountdownSection";
import { GuestbookSection } from "../components/GuestbookSection";
import { RsvpFormSection } from "../components/RsvpFormSection";
import { ScheduleAndDetailsSection } from "../components/ScheduleAndDetailsSection";
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
    <div className="min-h-screen bg-[#faf7f2] flex flex-col selection:bg-[#c69a58]/30">
      <header className="sticky top-0 z-40 bg-[#faf7f2]/92 backdrop-blur border-b border-[#ebdcc8]/60 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-script text-2xl md:text-3xl text-[#9d7537] group-hover:scale-105 transition-transform">
              {WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}
            </span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium">
            <a href="#programme" className="text-[#5a4632] hover:text-[#9d7537] transition-colors hidden sm:inline-block">Quand & Où ?</a>
            <button type="button" onClick={scrollToRsvp} className="px-4 py-2 rounded-full gold-gradient text-white font-medium text-xs md:text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /><span>Confirmer ma présence</span>
            </button>
            <Link href="/admin" className="text-xs text-[#7c6d62] hover:text-[#2d241e] border-l border-[#ebdcc8] pl-3 ml-1 flex items-center gap-1.5">
              <LockKeyhole className="w-3 h-3" /><span className="hidden sm:inline">Espace Mariés</span>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-reference relative min-h-[680px] md:min-h-[760px] flex items-center justify-center overflow-visible">
          <img src={WEDDING_CONFIG.assets.heroCouple} alt="Michelle et Marcing" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="hero-reference-overlay absolute inset-0" />
          <FallingPetals />

          <div className="relative z-10 max-w-3xl w-full mx-auto px-6 pt-10 pb-20 text-center text-white flex flex-col items-center">
            <div className="dove-mark mb-5" aria-label="Symbole de l'amour">
              <Bird className="w-12 h-12 md:w-16 md:h-16 fill-white stroke-white" />
              <Heart className="w-7 h-7 md:w-9 md:h-9 fill-white stroke-white -mx-3" />
              <Bird className="w-12 h-12 md:w-16 md:h-16 fill-white stroke-white scale-x-[-1]" />
            </div>
            <p className="font-serif-luxury text-base md:text-xl italic font-semibold leading-relaxed max-w-xl drop-shadow-lg">
              Rejoignez-nous pour célébrer<br className="hidden md:block" /> notre union traditionnelle !
            </p>
            <p className="mt-8 text-sm md:text-lg font-semibold leading-relaxed max-w-xl drop-shadow-lg">
              Nous vous invitons à être à nos côtés pour<br className="hidden md:block" /> le début de ce nouveau chapitre, et à<br className="hidden md:block" /> partager avec nous chaque instant de cet<br className="hidden md:block" /> événement inoubliable !
            </p>
            <button type="button" onClick={scrollToRsvp} className="mt-8 px-6 py-3 rounded-full bg-white/95 text-[#855f24] font-serif-luxury text-xs md:text-sm font-bold shadow-xl hover:bg-white active:scale-95 transition-all cursor-pointer">
              Répondre à l'invitation
            </button>
            <div className="mt-6 text-[10px] md:text-xs tracking-[0.28em] uppercase text-white/90 whitespace-nowrap drop-shadow">
              Bafoussam • 26 Décembre 2026
            </div>
          </div>

          <div className="hero-heart-portraits absolute z-20 bottom-[-52px] left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className="heart-photo heart-photo-left"><img src={WEDDING_CONFIG.assets.bridePortrait} alt="Michelle" /></div>
            <div className="heart-photo heart-photo-right"><img src={WEDDING_CONFIG.assets.groomPortrait} alt="Marcing" /></div>
          </div>
        </section>

        <section className="relative pt-20 pb-2 bg-[#faf7f2] text-center">
          <p className="font-serif-luxury text-xl md:text-3xl italic font-bold text-[#2d241e]">Nous deviendrons une famille dans</p>
          <div className="mt-2 flex justify-center"><ChevronDown className="w-5 h-5 text-[#c69a58] animate-bounce" /></div>
        </section>

        <CountdownSection />
        <ScheduleAndDetailsSection />
        <GuestbookSection />
        <RsvpFormSection />
      </main>

      <footer className="mt-auto py-12 px-4 bg-[#231b16] text-[#dfd4c8] text-center border-t border-[#3d2e23]">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-script text-4xl text-[#d8ab66]">{WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}</p>
          <p className="font-serif-luxury text-xs uppercase tracking-widest text-[#a8998a]">26 Décembre 2026 • Bafoussam, Cameroun</p>
          <p className="text-xs text-[#908275] max-w-md mx-auto">Nous avons hâte de vous retrouver pour fêter ce grand amour en famille et entre amis !</p>
          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-[#736559]"><Link href="/admin" className="hover:text-[#d8ab66] transition-colors flex items-center gap-1.5"><LockKeyhole className="w-3 h-3" /> Accès réservé aux mariés</Link></div>
        </div>
      </footer>
    </div>
  );
}
