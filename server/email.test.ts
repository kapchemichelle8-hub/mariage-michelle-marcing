import { describe, expect, it } from "vitest";
import { buildTicketPdf } from "./email";

describe("ticket email PDF", () => {
  it("generates a non-empty PDF attachment", async () => {
    const pdf = await buildTicketPdf({ name: "Michelle Ngassa", guestsCount: 2, ticketCode: "MM-ABC234" });
    expect(pdf.byteLength).toBeGreaterThan(500);
    expect(new TextDecoder().decode(pdf.slice(0, 5))).toBe("%PDF-");
  });
});
