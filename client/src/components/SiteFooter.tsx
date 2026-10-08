import { Link } from "wouter";
import { lastTicket } from "@/lib/storage";
import { wedding } from "@/weddingConfig";
import { DovesHeart } from "./Ornaments";

export function SiteFooter() {
  const ticket = lastTicket();
  return (
    <footer className="no-print bg-[#2c1c11] px-5 py-14 text-center text-ivory/80">
      <DovesHeart className="mx-auto h-8 w-28 text-gold" />
      <p className="script mt-4 text-4xl text-ivory">Michelle &amp; Marcing</p>
      <p className="mt-2 text-sm tracking-[0.2em] text-gold-soft">
        {wedding.shortDate} · {wedding.city}
      </p>
      <p className="mx-auto mt-5 max-w-sm font-serif text-lg italic">
        Merci de porter notre union dans vos prières. À très bientôt.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        {ticket && (
          <Link href={`/billet/${ticket}`} className="text-gold-soft underline-offset-4 hover:underline">
            Retrouver mon billet
          </Link>
        )}
        <Link href="/espace-maries" className="text-ivory/50 underline-offset-4 hover:underline">
          Espace Mariés
        </Link>
      </div>
    </footer>
  );
}
