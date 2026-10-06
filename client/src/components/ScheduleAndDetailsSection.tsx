import { Car, Church, Clock, Coffee, Heart, MapPin, Music, Camera, Play, Scale, Wine } from "lucide-react";
import { useState } from "react";
import { WEDDING_CONFIG } from "../weddingConfig";

const SCHEDULE_ICONS = {
  civil: Scale,
  photo: Camera,
  toast: Wine,
  travel: Car,
  church: Church,
  break: Coffee,
  tradition: Heart,
  party: Music,
} as const;

export function ScheduleAndDetailsSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="space-y-24 py-16">
      {/* Section Histoire d'Amour avec portraits préservés */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537]">Deux âmes sœurs</p>
          <h2 className="font-serif-luxury text-2xl md:text-4xl font-bold tracking-wide text-[#2d241e] mt-1 mb-4">
            Notre Histoire d'Amour
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            {WEDDING_CONFIG.story}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {/* Portrait Michelle */}
          <div className="card-luxury p-6 rounded-3xl text-center group hover:border-[#c69a58] transition-all">
            <div className="w-52 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-[#ebdcc8] shadow-md mb-4 bg-muted relative">
              <img
                src={WEDDING_CONFIG.assets.bridePortrait}
                alt="Michelle - La Mariée"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#9d7537] font-semibold">
              La Mariée
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#2d241e] mt-1">
              {WEDDING_CONFIG.bride}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto italic">
              « Dans son regard, j'ai trouvé la sérénité et le foyer où mon cœur désire habiter à jamais. »
            </p>
          </div>

          {/* Portrait Marcing */}
          <div className="card-luxury p-6 rounded-3xl text-center group hover:border-[#c69a58] transition-all">
            <div className="w-52 h-64 mx-auto rounded-2xl overflow-hidden border-2 border-[#ebdcc8] shadow-md mb-4 bg-muted relative">
              <img
                src={WEDDING_CONFIG.assets.groomPortrait}
                alt="Marcing - Le Marié"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <span className="text-xs uppercase tracking-widest text-[#9d7537] font-semibold">
              Le Marié
            </span>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#2d241e] mt-1">
              {WEDDING_CONFIG.groom}
            </h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto italic">
              « Elle est ma boussole, ma plus belle prière exaucée et la complice de tous mes lendemains. »
            </p>
          </div>
        </div>

        {/* Citation romantique centrale */}
        <div className="mt-14 card-luxury max-w-3xl mx-auto p-8 rounded-3xl text-center border-[#c69a58]/40 shadow-sm">
          <Heart className="w-6 h-6 mx-auto text-[#9d7537] fill-[#c69a58]/20 mb-3" />
          <blockquote className="font-serif-luxury text-lg md:text-xl font-medium text-[#855f24] italic mb-2">
            {WEDDING_CONFIG.quote}
          </blockquote>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            — {WEDDING_CONFIG.quoteAuthor}
          </span>
        </div>
      </section>

      {/* Section Quand et Où — Programme avec belles illustrations professionnelles */}
      <section id="programme" className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537]">Moments précieux</p>
          <h2 className="font-serif-luxury text-2xl md:text-4xl font-bold tracking-wide text-[#2d241e] mt-1 mb-4">
            Quand & Où ?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Notre grand jour se déroulera à Bandjoun, entourés de nos familles et de nos proches : mariage civil à la mairie de Pète-Bandjoun (Bandjoun), vin d'honneur à la petite salle de la paroisse de Mboa (Bandjoun), puis messe d'action de grâce et début de la cérémonie traditionnelle à notre domicile de Nlem, à côté de la Mission protestante (Bandjoun). Depuis le Centre climatique de Bandjoun, prenez une moto et demandez la Mission protestante de Nlem : la maison se trouve juste à côté.
          </p>
        </div>

        {/* Cadre paysager de Bandjoun */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-lg border border-[#ebdcc8] max-h-72">
          <img
            src={WEDDING_CONFIG.assets.bandjounLandscape}
            alt="Paysage de l'Ouest Cameroun - Bandjoun"
            loading="lazy"
            decoding="async"
            className="w-full h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 text-white">
            <span className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-[#f8eedd]">
              <MapPin className="w-3.5 h-3.5" /> Bandjoun, Région de l'Ouest Cameroun
            </span>
            <h3 className="font-serif-luxury text-2xl md:text-3xl font-bold mt-1">
              Terre de traditions, de bénédictions et de joie
            </h3>
          </div>
        </div>

        {/* Programme de la journée */}
        <div className="text-center mb-10">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537]">Le déroulé de la journée</p>
          <h3 className="font-serif-luxury text-xl md:text-3xl font-bold tracking-wide text-[#2d241e] mt-1">
            Programme du {WEDDING_CONFIG.dateString}
          </h3>
        </div>

        <ol className="schedule-timeline relative max-w-3xl mx-auto">
          {WEDDING_CONFIG.schedule.map((item, idx) => {
            const Icon = SCHEDULE_ICONS[item.icon as keyof typeof SCHEDULE_ICONS] ?? Heart;
            return (
              <li key={idx} className="schedule-item relative pl-16 md:pl-0 pb-8 last:pb-0">
                <div className="schedule-dot absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white shadow-lg ring-4 ring-[#faf7f2] z-10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`md:w-1/2 ${idx % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14"}`}>
                  <div className="card-luxury rounded-2xl p-5 hover:border-[#c69a58] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ede1] text-[#855f24] text-xs font-bold tracking-wider mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.end ? `${item.start} – ${item.end}` : `Dès ${item.start}`}</span>
                    </div>
                    <h4 className="font-serif-luxury text-base md:text-lg font-bold text-[#2d241e] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-1.5">
                      {item.description}
                    </p>
                    <p className={`mt-3 pt-3 border-t border-[#ebdcc8] flex items-center gap-1.5 text-xs font-medium text-[#5a4632] ${idx % 2 === 0 ? "md:justify-end" : ""}`}>
                      <MapPin className="w-3.5 h-3.5 text-[#9d7537] shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Section Vidéo d'Ambiance */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="card-luxury p-6 md:p-10 rounded-3xl text-center border-[#c69a58]/40 shadow-xl overflow-hidden">
          <p className="font-script text-3xl md:text-4xl text-[#9d7537] mb-1">
            Les doux souvenirs
          </p>
          <h2 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#2d241e] mb-4">
            Notre Amour en Mouvement
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-lg mx-auto mb-8">
            Revivez avec nous les prémices et les sourires complices qui nous mènent tout droit vers notre engagement sacré.
          </p>

          <div className="relative max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-[#c69a58]/40 bg-black aspect-[9/16]">
            {!isVideoPlaying ? (
              <div className="relative w-full h-full">
                <img
                  src={WEDDING_CONFIG.assets.videoPoster}
                  alt="Aperçu vidéo du mariage"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  aria-label="Lire la vidéo"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </button>
                <div className="absolute bottom-3 left-0 right-0 text-center text-white text-xs drop-shadow bg-gradient-to-t from-black/80 to-transparent py-2">
                  Cliquez pour visionner la vidéo avec son
                </div>
              </div>
            ) : (
              <video
                src={WEDDING_CONFIG.assets.videoUrl}
                controls
                autoPlay
                preload="metadata"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
