import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { DovesHeart } from "@/components/Ornaments";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { wedding } from "@/weddingConfig";

const COLORS = ["#c6a15b", "#e3cf9f", "#9c7a3c", "#f1dcc6", "#fffaf0"];

/** Simulation du jour J : confettis dorés, séparée de la page publique. */
export default function JourJPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.title = "Le jour J — Michelle & Marcing";
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      vy: 1.2 + Math.random() * 2.2,
      vx: -0.8 + Math.random() * 1.6,
      a: Math.random() * Math.PI,
      va: -0.08 + Math.random() * 0.16,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.va;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.a)));
        ctx.restore();
      }
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-cocoa px-5 text-center text-ivory">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 max-w-lg">
        <p className="eyebrow !text-gold-soft">Simulation du jour J</p>
        <DovesHeart className="mx-auto mt-5 h-12 w-40 text-gold-soft" />
        <h1 className="script mt-4 text-6xl !text-ivory sm:text-7xl">C’est le grand jour !</h1>
        <p className="mt-5 font-serif text-xl italic text-ivory/85">
          {wedding.dateLabel}, à {wedding.city}. Michelle et Marcing se disent oui.
        </p>
        <Link href="/" className="btn-gold mt-10">
          Retourner à l’invitation
        </Link>
      </div>
    </main>
  );
}
