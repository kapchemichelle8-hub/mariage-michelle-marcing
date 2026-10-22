import { describe, expect, it } from "vitest";
import { findSeatAssignment, normalizeGuestName } from "./seatPlan";
import type { SeatAssignment } from "./seatPlan";

const assignments: SeatAssignment[] = [
  { tableNumber: "4", tableVirtue: "Sagesse", matchedGuestName: "Élodie Exemple" },
  { tableNumber: "8", tableVirtue: "Paix", matchedGuestName: "Camille Demo" },
  { tableNumber: "12", tableVirtue: "Joie", matchedGuestName: "Alex Test" },
  { tableNumber: "16", tableVirtue: "Amour", matchedGuestName: "Alex Test" },
];

describe("historical seat-plan matching", () => {
  it("normalizes accents, case, punctuation and extra whitespace", () => {
    expect(normalizeGuestName("  ÉLODIE   Exemple! ")).toBe("elodie exemple");
    expect(findSeatAssignment("elodie exemple", assignments)).toMatchObject({
      tableNumber: "4",
      tableVirtue: "Sagesse",
    });
  });

  it("does not use partial-name matching", () => {
    expect(findSeatAssignment("Camille", assignments)).toBeNull();
  });

  it("does not guess when an exact normalized name has conflicting tables", () => {
    expect(findSeatAssignment("Alex Test", assignments)).toBeNull();
  });

  it("returns a unique exact match despite unrelated similar names", () => {
    const rows = [
      { tableNumber: "2", tableVirtue: "Confiance", matchedGuestName: "Alexandra Test" },
      { tableNumber: "20", tableVirtue: "Espérance", matchedGuestName: "Alex Test" },
    ];
    expect(findSeatAssignment("Alex Test", rows)?.tableNumber).toBe("20");
  });
});
