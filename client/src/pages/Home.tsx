import { Calendar, ChevronDown, Heart, MapPin, Sparkles, UserCheck } from "lucide-react";
import { Link } from "wouter";
import { CountdownSection } from "../components/CountdownSection";
import { GuestbookSection } from "../components/GuestbookSection";
import { RsvpFormSection } from "../components/RsvpFormSection";
import { ScheduleAndDetailsSection } from "../components/ScheduleAndDetailsSection";
import { WEDDING_CONFIG } from "../weddingConfig";

export default function Home() {
  const scrollToRsvp = () => {
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col selection:bg-[#c69a58]/30">
      {/* Barre de navigation discrète */}
      <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur border-b border-[#ebdcc8]/60 px-4 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-script text-2xl md:text-3xl text-[#9d7537] group-hover:scale-105 transition-transform">
              {WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}
            </span>
          </Link>

          <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium">
            <a
              href="#programme"
              className="text-[#5a4632] hover:text-[#9d7537] transition-colors hidden sm:inline-block"
            >
              Quand & Où ?
            </a>
            <button
              type="button"
              onClick={scrollToRsvp}
              className="px-4 py-2 rounded-full gold-gradient text-white font-medium text-xs md:text-sm shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Confirmer ma présence</span>
            </button>
            <Link
              href="/admin"
              className="text-xs text-[#7c6d62] hover:text-[#2d241e] border-l border-[#ebdcc8] pl-3 ml-1"
            >
              Espace Mariés
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section Majestueuse */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 px-4 overflow-hidden text-center bg-gradient-to-b from-[#f8f2e7] via-[#faf7f2] to-[#faf7f2]">
        {/* Cercles de lumière dorée */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 md:w-[600px] h-72 md:h-[600px] bg-[#c69a58]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#ebdcc8] text-xs font-semibold uppercase tracking-widest text-[#855f24] mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Invitation Officielle • Dote & Union Traditionnelle</span>
          </div>

          <h1 className="font-script text-6xl md:text-8xl text-[#9d7537] leading-none mb-2 drop-shadow-sm">
            {WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}
          </h1>

          <p className="font-serif-luxury text-lg md:text-2xl tracking-widest uppercase text-[#2d241e] font-semibold mb-6">
            Rejoignez-nous pour célébrer notre union traditionnelle !
          </p>

          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Nous vous invitons à être à nos côtés pour le début de ce nouveau chapitre, et à partager avec nous chaque instant de cet événement inoubliable !
          </p>

          {/* Photo principale du couple dans un cadre ornementé luxueux */}
          <div className="relative w-64 h-84 md:w-80 md:h-[460px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-[#c69a58]/40 mb-10 group">
            <img
              src={WEDDING_CONFIG.assets.heroCouple}
              alt="Michelle & Marcing"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-center">
              <span className="font-serif-luxury text-sm font-semibold tracking-wider">
                Bafoussam • 26 Décembre 2026
              </span>
            </div>
          </div>

          {/* Boutons d'action hero */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={scrollToRsvp}
              className="px-8 py-4 rounded-full gold-gradient text-white font-serif-luxury font-bold tracking-wider text-sm shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Répondre à l'Invitation (RSVP)</span>
            </button>
            <a
              href="#programme"
              className="px-6 py-4 rounded-full bg-white border border-[#c69a58]/50 text-[#855f24] hover:bg-[#faf7f2] font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#9d7537]" />
              <span>Découvrir le programme</span>
            </a>
          </div>
        </div>
      </section>

      {/* Compte à rebours interactif avec simulation confettis */}
      <CountdownSection />

      {/* Programme & Histoire */}
      <ScheduleAndDetailsSection />

      {/* Livre d'or public */}
      <GuestbookSection />

      {/* Formulaire RSVP & Billet */}
      <RsvpFormSection />

      {/* Pied de page chaleureux */}
      <footer className="mt-auto py-12 px-4 bg-[#231b16] text-[#dfd4c8] text-center border-t border-[#3d2e23]">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-script text-4xl text-[#d8ab66]">
            {WEDDING_CONFIG.bride} & {WEDDING_CONFIG.groom}
          </p>
          <p className="font-serif-luxury text-xs uppercase tracking-widest text-[#a8998a]">
            26 Décembre 2026 • Bafoussam, Cameroun
          </p>
          <p className="text-xs text-[#908275] max-w-md mx-auto">
            Nous avons hâte de vous retrouver pour fêter ce grand amour en famille et entre amis !
          </p>
          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-[11px] text-[#736559]">
            <Link href="/admin" className="hover:text-[#d8ab66] transition-colors">
              Tableau de bord organisateur
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
