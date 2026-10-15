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
});
