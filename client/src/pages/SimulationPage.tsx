import { Link } from "wouter";
import { CountdownSection } from "../components/CountdownSection";

export default function SimulationPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#855f24] hover:underline mb-5">← Retourner à l'invitation</Link>
        <div className="card-luxury rounded-3xl overflow-hidden">
          <div className="text-center pt-8 px-5"><p className="font-script text-4xl text-[#9d7537]">Le grand jour</p><h1 className="font-serif-luxury text-xl md:text-2xl font-bold text-[#2d241e] mt-2">Simulation du jour J</h1><p className="text-sm text-muted-foreground mt-2">Découvrez l'explosion de confettis qui annoncera notre grand jour.</p></div>
          <CountdownSection standalone autoSimulate />
        </div>
      </div>
    </main>
  );
}
