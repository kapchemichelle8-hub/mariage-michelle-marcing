import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="paper grid min-h-[100svh] place-items-center px-5 text-center">
      <div>
        <p className="script text-5xl text-gold-deep">Oups…</p>
        <h1 className="mt-2 text-3xl">Cette page n’existe pas</h1>
        <Link href="/" className="btn-gold mt-8">
          Retourner à l’invitation
        </Link>
      </div>
    </main>
  );
}
