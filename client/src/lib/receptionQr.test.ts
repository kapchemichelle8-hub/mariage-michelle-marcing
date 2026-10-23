import { describe, expect, it } from "vitest";
import { createReceptionQr, parseReceptionQr, tableLabel } from "./receptionQr";

describe("QR équipe accueil", () => {
  it("encode et relit une table hors connexion", () => {
    const qr = createReceptionQr({
      ticketCode: "AbCdEf0123456789_-".padEnd(32, "Z"),
      tableNumber: "4",
      tableVirtue: "Fidélité",
    });

    expect(parseReceptionQr(qr)).toEqual({
      ticketCode: "AbCdEf0123456789_-".padEnd(32, "Z"),
      tableNumber: "4",
      tableVirtue: "Fidélité",
    });
    expect(tableLabel("4", "Fidélité")).toBe("Table Fidélité");
  });

  it("continue de lire un ancien QR URL", () => {
    expect(parseReceptionQr("https://example.com/plan/abc123")).toEqual({
      ticketCode: "abc123",
      tableNumber: null,
      tableVirtue: null,
    });
  });
});
