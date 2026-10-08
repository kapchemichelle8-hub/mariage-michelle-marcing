import { useEffect } from "react";
import { Link } from "wouter";
import { DovesHeart, FloralDivider } from "@/components/Ornaments";
import { wedding } from "@/weddingConfig";

export default function AbsencePage() {
  const name = new URLSearchParams(window.location.search).get("nom")?.slice(0, 160);
  useEffect(() => {
    document.title = "Merci pour votre réponse — Michelle & Marcing";
  }, []);

  return (
    <main className="paper grid min-h-[100svh] place-items-center px-5 py-16">
      <div className="max-w-lg text-center">
        <DovesHeart className="mx-auto h-10 w-32 text-gold" />
        <p className="eyebrow mt-6">Votre réponse est bien enregistrée</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">
          Merci{name ? `, ${name}` : ""}
        </h1>
        <p className="mt-5 font-serif text-xl leading-relaxed text-ink">
          Nous comprenons tout à fait que vous ne puissiez pas être parmi nous le {wedding.dateLabel.toLowerCase()}.
          Vous nous manquerez, et nous penserons à vous.
        </p>
        <p className="mt-4 leading-relaxed text-ink/90">
          Nous partagerons avec vous la joie de cette journée. Votre soutien compte énormément pour
          nous, sous toutes ses formes : une prière, un mot d’encouragement ou une contribution selon
          vos possibilités.
        </p>
        <FloralDivider className="my-8" />
        <p className="script text-3xl text-gold-deep">Avec toute notre affection, Michelle &amp; Marcing</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-gold">
            Retourner à l’invitation
          </Link>
          <Link href="/#cadeaux" className="btn-ghost">
            Dons &amp; cadeaux
          </Link>
        </div>
      </div>
    </main>
  );
}
