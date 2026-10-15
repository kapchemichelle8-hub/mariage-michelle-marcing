import { describe, expect, it } from "vitest";
import { findSeatAssignment, parseSeatPlanCsv } from "./seatPlan";

describe("seat plan parser", () => {
  it("reads table virtues and guest rows from the published CSV", () => {
    const assignments = parseSeatPlanCsv(
      '"PLAN DE TABLE","Vertu","Invités"\n"1","Amour","Tsomeguem Francine","Michelle"\n"2","Sagesse","M alima","Marcing"'
    );
    expect(assignments).toHaveLength(2);
    expect(assignments[0]).toMatchObject({ tableNumber: "1", tableVirtue: "Amour" });
  });

  it("matches accents and harmless naming differences", () => {
    const assignments = parseSeatPlanCsv('"1","Amour","Tata Suzanne Alima","Marcing"');
    expect(findSeatAssignment("tata suzanne alima", assignments)?.tableNumber).toBe("1");
    expect(findSeatAssignment("Tata Suzanne Alima ", assignments)?.tableVirtue).toBe("Amour");
  });

  it("uses the complete name before assigning a table", () => {
    const assignments = parseSeatPlanCsv(
      '"2","Sagesse","Paola","Michelle"\n"20","Douceur","Kengne Paola","Marcing"'
    );
    expect(findSeatAssignment("Kengne Paola", assignments)?.tableNumber).toBe("20");
    expect(findSeatAssignment("Kengne ange paola", assignments)?.tableNumber).toBe("20");
    expect(findSeatAssignment("Paola", assignments)?.tableNumber).toBe("2");
  });

  it("does not guess when a shortened name points to different tables", () => {
    const assignments = parseSeatPlanCsv(
      '"2","Sagesse","Maman Dora","Michelle"\n"20","Douceur","Épouse de Dora","Marcing"'
    );
    expect(findSeatAssignment("Dora", assignments)).toBeNull();
  });
});
