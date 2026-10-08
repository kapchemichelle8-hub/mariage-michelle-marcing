import { useEffect, useState } from "react";
import { Link } from "wouter";
import { wedding } from "@/weddingConfig";
import { Reveal } from "./Reveal";

const target = new Date(wedding.dateISO).getTime();

function remaining(now: number) {
  const diff = Math.max(0, target - now);
  return {
    done: diff === 0,
    units: [
      { label: "jours", value: Math.floor(diff / 86_400_000) },
      { label: "heures", value: Math.floor(diff / 3_600_000) % 24 },
      { label: "minutes", value: Math.floor(diff / 60_000) % 60 },
      { label: "secondes", value: Math.floor(diff / 1000) % 60 },
    ],
  };
}

export function CountdownSection() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const { done, units } = remaining(now);

  return (
    <section className="paper px-5 pb-16 pt-12 text-center sm:pt-16" aria-labelledby="countdown-title">
      <Reveal>
        <p className="eyebrow">Encore un peu de patience</p>
        <h2 id="countdown-title" className="mt-2 text-3xl sm:text-4xl">
          {done ? "C’est aujourd’hui !" : "Le grand jour approche"}
        </h2>
      </Reveal>
      {!done && (
        <Reveal delay={120} className="mx-auto mt-8 grid max-w-xl grid-cols-4 gap-2 sm:gap-4">
          {units.map((u, i) => (
            <div
              key={u.label}
              className={`rounded-2xl border border-sand bg-white/70 px-1 py-4 shadow-[0_10px_30px_-22px_rgb(59_38_24/0.6)] ${
                i % 2 ? "sm:translate-y-2" : ""
              }`}
            >
              <span className="block font-serif text-3xl tabular-nums text-cocoa sm:text-5xl" aria-live={u.label === "jours" ? "polite" : "off"}>
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
                {u.label}
              </span>
            </div>
          ))}
        </Reveal>
      )}
      <Reveal delay={200}>
        <p className="mx-auto mt-8 max-w-md font-serif text-lg italic text-muted">
          {wedding.dateLabel}, à {wedding.city}. Chaque seconde nous rapproche de vous.
        </p>
        <Link href="/jour-j" className="mt-3 inline-block text-sm text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
          Imaginer le jour J ✨
        </Link>
      </Reveal>
    </section>
  );
}
