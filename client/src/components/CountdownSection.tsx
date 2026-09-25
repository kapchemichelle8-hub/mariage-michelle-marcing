import confetti from "canvas-confetti";
import { Sparkles, Trophy, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { WEDDING_CONFIG } from "../weddingConfig";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReached: boolean;
}

export function CountdownSection() {
  const [forceReached, setForceReached] = useState(false);
  const targetDate = useMemo(() => new Date(WEDDING_CONFIG.dateIso).getTime(), []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target: number): TimeLeft {
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isReached: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isReached: false,
    };
  }

  const isDDay = timeLeft.isReached || forceReached;

  const triggerCelebration = () => {
    // Tir de confettis luxueux et dorés
    const end = Date.now() + 3 * 1000;
    const colors = ["#c69a58", "#e3c28b", "#ffffff", "#ff4757", "#2ed573"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    if (forceReached) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, forceReached]);

  useEffect(() => {
    if (isDDay) {
      triggerCelebration();
    }
  }, [isDDay]);

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-[#f5eee3] to-[#faf7f2]">
      {/* Motifs décoratifs de fond */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#c69a58]/30 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="font-script text-3xl md:text-4xl text-[#9d7537] mb-2">
          Le grand décompte
        </p>
        <h2 className="font-serif-luxury text-2xl md:text-4xl font-bold tracking-wide text-[#2d241e] mb-4">
          Nous deviendrons une famille dans
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-10">
          Chaque seconde nous rapproche du moment où nos deux familles et nos deux cœurs ne feront plus qu'un.
        </p>

        {isDDay ? (
          <div className="card-luxury p-8 md:p-12 rounded-3xl max-w-2xl mx-auto border-[#c69a58]/50 shadow-2xl animate-fade-in relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c69a58]/20 text-[#855f24] font-semibold text-xs tracking-wider uppercase mb-6">
              <Sparkles className="w-4 h-4" /> Nous y sommes enfin !
            </div>

            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[#c69a58] shadow-xl">
              <img
                src={WEDDING_CONFIG.assets.heroCouple}
                alt="Michelle et Marcing"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-serif-luxury text-2xl md:text-3xl font-bold text-[#855f24] mb-3">
              Le Grand Jour est Arrivé !
            </h3>
            <p className="text-[#5a4632] leading-relaxed mb-8">
              Aujourd'hui, sous le regard bienveillant de nos aïeux et entourés de vous tous, Michelle & Marcing scellent leur union pour toujours. Merci d'être les témoins privilégiés de cette fête mémorable.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={triggerCelebration}
                className="px-6 py-3 rounded-full gold-gradient text-white font-medium shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Lancer les confettis !
              </button>
              <button
                type="button"
                onClick={() => setForceReached(false)}
                className="px-5 py-3 rounded-full border border-[#c69a58]/40 text-xs text-[#7c6d62] hover:bg-white/60 transition-colors"
              >
                Revenir au compte à rebours normal
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto mb-8">
              {[
                { label: "Jours", value: timeLeft.days },
                { label: "Heures", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Secondes", value: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card-luxury p-5 md:p-8 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#c69a58] transition-all"
                >
                  <span className="font-serif-luxury text-3xl md:text-5xl font-extrabold text-[#855f24]">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mt-2 font-medium">
                    {item.label}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c69a58]/30 group-hover:bg-[#c69a58] transition-colors" />
                </div>
              ))}
            </div>

            {/* Bouton de simulation demandé par l'utilisateur pour tester l'explosion de confettis et la photo */}
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur border border-[#c69a58]/30 px-4 py-2.5 rounded-full text-xs text-[#7c6d62]">
              <span>💡 Tester l'effet du Jour J dès maintenant :</span>
              <button
                type="button"
                onClick={() => {
                  setForceReached(true);
                  triggerCelebration();
                }}
                className="font-semibold text-[#855f24] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Déclencher l'explosion
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
