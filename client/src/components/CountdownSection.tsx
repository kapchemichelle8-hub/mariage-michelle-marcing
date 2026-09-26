import confetti from "canvas-confetti";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { WEDDING_CONFIG } from "../weddingConfig";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isReached: boolean;
}

export function CountdownSection({ standalone = false }: { standalone?: boolean }) {
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
    const end = Date.now() + 3 * 1000;
    const colors = ["#c69a58", "#e3c28b", "#ffffff", "#ff4757", "#2ed573"];

    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  useEffect(() => {
    if (forceReached) return;
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate, forceReached]);

  useEffect(() => {
    if (isDDay) triggerCelebration();
  }, [isDDay]);

  const pad = (n: number, size = 2) => String(n).padStart(size, "0");

  return (
    <section className={`py-10 px-4 text-center ${standalone ? "min-h-[560px] flex items-center justify-center" : ""}`}>
      <div className="max-w-4xl mx-auto">
        {isDDay ? (
          <div className="card-luxury p-8 md:p-10 rounded-3xl max-w-xl mx-auto border-[#c69a58]/50 shadow-2xl animate-fade-in relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c69a58]/20 text-[#855f24] font-semibold text-xs tracking-wider uppercase mb-5">
              <Sparkles className="w-4 h-4" /> Nous y sommes enfin !
            </div>
            <div className="relative w-44 h-44 mx-auto mb-5 rounded-full overflow-hidden border-4 border-[#c69a58] shadow-xl">
              <img src={WEDDING_CONFIG.assets.heroCouple} alt="Michelle et Marcing" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#855f24] mb-2">Le Grand Jour est Arrivé !</h3>
            <p className="text-sm text-[#5a4632] leading-relaxed mb-6">
              Aujourd'hui, sous le regard bienveillant de nos aïeux et entourés de vous tous, Michelle & Marcing scellent leur union pour toujours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={triggerCelebration} className="px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-semibold shadow hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5" /> Lancer les confettis
              </button>
              <button type="button" onClick={() => setForceReached(false)} className="px-4 py-2.5 rounded-full border border-[#c69a58]/40 text-xs text-[#7c6d62] hover:bg-white/60 transition-colors">
                Repasser en compte à rebours
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Ligne épurée identique à l'exemple : 091:16:42:06 */}
            <div className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#1e1511]">
              <span>{pad(timeLeft.days, 3)}</span>
              <span className="text-[#c69a58] mx-1">:</span>
              <span>{pad(timeLeft.hours)}</span>
              <span className="text-[#c69a58] mx-1">:</span>
              <span>{pad(timeLeft.minutes)}</span>
              <span className="text-[#c69a58] mx-1">:</span>
              <span>{pad(timeLeft.seconds)}</span>
            </div>
            <div className="flex items-center justify-center gap-6 sm:gap-12 md:gap-16 text-[10px] sm:text-xs tracking-[0.22em] text-[#857365] uppercase font-semibold mt-2">
              <span>Days</span>
              <span>Hours</span>
              <span>Mins</span>
              <span>Secs</span>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 text-[11px] text-[#8d7c6e]">
              <span>Envie de voir l'effet du jour J ?</span>
              <Link href={standalone ? "#" : "/simulation"} onClick={standalone ? (event) => { event.preventDefault(); setForceReached(true); triggerCelebration(); } : undefined} className="text-[#855f24] font-semibold underline hover:text-[#5d4016] flex items-center gap-1 cursor-pointer">
                <Sparkles className="w-3 h-3" /> Simuler l'explosion
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
