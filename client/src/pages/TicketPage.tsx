import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { DigitalTicket } from "@/components/DigitalTicket";
import { trpc } from "@/lib/trpc";
import { rememberTicket } from "@/lib/storage";

type Busy = "png" | "pdf" | null;

/** Capture du billet en image (bibliothèque chargée seulement au clic). */
async function captureTicket(node: HTMLElement) {
  const { toPng } = await import("html-to-image");
  await document.fonts?.ready;
  return toPng(node, { pixelRatio: 3, cacheBust: true, backgroundColor: "#f3eadb" });
}

export default function TicketPage() {
  const { code = "" } = useParams<{ code: string }>();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  const query = trpc.rsvp.ticket.useQuery({ code }, { retry: 1 });

  useEffect(() => {
    document.title = "Mon billet — Michelle & Marcing";
    if (query.data) rememberTicket(query.data.ticketCode);
  }, [query.data]);

  const fileBase = `billet-michelle-marcing-${code}`;

  const downloadPng = async () => {
    if (!ticketRef.current) return;
    setBusy("png");
    setError(null);
    try {
      const dataUrl = await captureTicket(ticketRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileBase}.png`;
      link.click();
    } catch {
      setError("Le téléchargement a échoué. Vous pouvez faire une capture d’écran de votre billet.");
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    if (!ticketRef.current) return;
    setBusy("pdf");
    setError(null);
    try {
      const node = ticketRef.current;
      const [dataUrl, { jsPDF }] = await Promise.all([captureTicket(node), import("jspdf")]);
      const pdf = new jsPDF({ unit: "mm", format: "a5", orientation: "portrait" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = node.offsetHeight / node.offsetWidth;
      let w = pageW - 20;
      let h = w * ratio;
      if (h > pageH - 20) {
        h = pageH - 20;
        w = h / ratio;
      }
      pdf.setFillColor(243, 234, 219);
      pdf.rect(0, 0, pageW, pageH, "F");
      pdf.addImage(dataUrl, "PNG", (pageW - w) / 2, (pageH - h) / 2, w, h);
      pdf.save(`${fileBase}.pdf`);
    } catch {
      setError("Le PDF n’a pas pu être créé. Essayez le téléchargement en image.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="min-h-[100svh] bg-cream px-4 py-10 sm:py-14">
      {query.isLoading && <p className="mt-20 text-center font-serif text-xl italic text-muted">Préparation de votre billet…</p>}

      {query.isError && (
        <div className="mx-auto mt-16 max-w-md text-center">
          <h1 className="text-3xl">Billet introuvable</h1>
          <p className="mt-3 text-muted">
            Vérifiez le lien reçu ou confirmez à nouveau votre présence depuis l’invitation.
          </p>
          <Link href="/#rsvp" className="btn-gold mt-6">
            Retourner à l’invitation
          </Link>
        </div>
      )}

      {query.data && (
        <>
          <div className="no-print mx-auto mb-8 max-w-md text-center">
            <p className="script text-4xl text-gold-deep">Merci, {query.data.name} !</p>
            <p className="mt-2 text-ink/90">
              Votre présence est confirmée. Voici votre billet : gardez-le précieusement et présentez-le
              le jour J.
            </p>
          </div>

          <DigitalTicket ref={ticketRef} ticket={query.data} />

          <div className="no-print mx-auto mt-8 grid max-w-[420px] grid-cols-3 gap-2">
            <button type="button" onClick={downloadPng} disabled={busy !== null} className="btn-gold !px-2 text-sm">
              {busy === "png" ? <span className="spinner" aria-hidden="true" /> : null}
              PNG
            </button>
            <button type="button" onClick={downloadPdf} disabled={busy !== null} className="btn-gold !px-2 text-sm">
              {busy === "pdf" ? <span className="spinner" aria-hidden="true" /> : null}
              PDF
            </button>
            <button type="button" onClick={() => window.print()} className="btn-ghost !px-2 text-sm">
              Imprimer
            </button>
          </div>
          {error && (
            <p role="alert" className="no-print mx-auto mt-4 max-w-[420px] text-center text-sm text-red-800">
              {error}
            </p>
          )}
          <p className="no-print mt-8 text-center">
            <Link href="/" className="text-gold-deep underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
              ← Retourner à l’invitation
            </Link>
          </p>
        </>
      )}
    </main>
  );
}
