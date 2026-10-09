import { Heart } from "lucide-react";
import { Link } from "wouter";

export default function DeclinedPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-12 flex items-center justify-center">
      <section className="card-luxury w-full max-w-2xl rounded-3xl p-8 md:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#f4ede1] border border-[#c69a58]/40 flex items-center justify-center mx-auto mb-6"><Heart className="w-8 h-8 text-[#9d7537] fill-[#c69a58]/30" /></div>
        <p className="font-script text-4xl text-[#9d7537] mb-2">Merci pour votre réponse</p>
        <h1 className="font-serif-luxury text-xl md:text-2xl font-bold text-[#2d241e] mb-5">Vous allez nous manquer, mais nous comprenons.</h1>
        <p className="text-sm text-[#5a4632] leading-relaxed max-w-xl mx-auto">Nous penserons à vous ce jour-là. Votre soutien compte beaucoup pour nous, quelle que soit sa forme : une prière, un message, une petite attention. Merci du fond du cœur pour votre affection.</p>
        <Link href="/" className="inline-flex mt-8 px-6 py-3 rounded-full gold-gradient text-white text-sm font-semibold shadow-lg hover:brightness-105 transition-all">Retourner à l’invitation</Link>
      </section>
    </main>
  );
}
