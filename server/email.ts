import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ENV } from "./_core/env";

export type TicketEmailInput = {
  recipient: string;
  name: string;
  guestsCount: number;
  ticketCode: string;
};

export async function buildTicketPdf(input: Omit<TicketEmailInput, "recipient">): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const script = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const gold = rgb(0.61, 0.42, 0.17);
  const ink = rgb(0.18, 0.14, 0.11);
  const cream = rgb(0.98, 0.97, 0.94);

  page.drawRectangle({ x: 0, y: 0, width: 595, height: 842, color: cream });
  page.drawRectangle({ x: 42, y: 42, width: 511, height: 758, borderColor: gold, borderWidth: 2 });
  page.drawRectangle({ x: 42, y: 790, width: 511, height: 10, color: gold });
  page.drawText("Michelle & Marcing", { x: 170, y: 722, size: 28, font: script, color: gold });
  page.drawText("BILLET D'ACCÈS OFFICIEL", { x: 166, y: 684, size: 16, font: bold, color: ink });
  page.drawText("DOT & UNION TRADITIONNELLE", { x: 186, y: 660, size: 10, font: bold, color: gold });
  page.drawLine({ start: { x: 82, y: 632 }, end: { x: 513, y: 632 }, thickness: 1, color: gold });
  page.drawText("INVITÉ(E) D'HONNEUR", { x: 220, y: 585, size: 10, font: bold, color: gold });
  page.drawText(input.name, { x: 110, y: 548, size: 24, font: bold, color: ink, maxWidth: 375 });
  page.drawText(`Présence confirmée pour ${input.guestsCount} ${input.guestsCount > 1 ? "personnes" : "personne"}`, { x: 190, y: 520, size: 11, font: regular, color: ink });
  page.drawText("DATE", { x: 100, y: 450, size: 10, font: bold, color: gold });
  page.drawText("26 décembre 2026", { x: 100, y: 425, size: 15, font: bold, color: ink });
  page.drawText("Dès 18 h 00", { x: 100, y: 403, size: 11, font: regular, color: ink });
  page.drawText("LIEU", { x: 330, y: 450, size: 10, font: bold, color: gold });
  page.drawText("Mission protestante", { x: 330, y: 425, size: 14, font: bold, color: ink });
  page.drawText("de Nlem, Bandjoun", { x: 330, y: 405, size: 14, font: bold, color: ink });
  page.drawText("Depuis le Centre climatique, prenez une moto et", { x: 100, y: 348, size: 11, font: regular, color: ink });
  page.drawText("demandez la Mission protestante de Nlem.", { x: 100, y: 330, size: 11, font: regular, color: ink });
  page.drawText("Nous sommes infiniment heureux de vous compter parmi nous !", { x: 102, y: 260, size: 13, font: bold, color: gold, maxWidth: 390 });
  page.drawText("N° D'INVITATION", { x: 100, y: 170, size: 9, font: bold, color: gold });
  page.drawText(input.ticketCode, { x: 100, y: 143, size: 19, font: bold, color: ink });
  page.drawText("Conservez ce billet et présentez-le à l'entrée.", { x: 100, y: 103, size: 10, font: regular, color: ink });
  return pdf.save();
}

export async function sendTicketEmail(input: TicketEmailInput): Promise<boolean> {
  if (!ENV.resendApiKey || !ENV.resendFromEmail) return false;
  try {
    const pdf = await buildTicketPdf(input);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${ENV.resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: ENV.resendFromEmail,
        to: [input.recipient],
        subject: "Votre billet officiel — Michelle & Marcing",
        html: `<p>Bonjour ${escapeHtml(input.name)},</p><p>Nous sommes heureux de vous compter parmi nous pour notre dot et notre union traditionnelle.</p><p>Vous trouverez votre billet officiel en pièce jointe.</p><p>À très bientôt à Bandjoun.</p><p>Michelle et Marcing</p>`,
        attachments: [{ filename: `billet-${input.ticketCode}.pdf`, content: Buffer.from(pdf).toString("base64") }],
      }),
    });
    if (!response.ok) {
      console.warn(`[Email] Resend returned ${response.status}: ${await response.text().catch(() => "")}`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Email] Failed to send ticket:", error);
    return false;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
}
