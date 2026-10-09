import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";

function createMockContext(user = null): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("wedding.submitRsvp", () => {
  it("creates a rsvp entry and returns a valid ticket code", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.wedding.submitRsvp({
      name: "Test Automatisé Éphémère",
      side: "bride",
      attendance: "yes",
      events: ["civil", "church"],
      guestsCount: 2,
      message: "Message de test éphémère",
    });

    expect(result.success).toBe(true);
    expect(result.attendance).toBe("yes");
    expect(result.ticketCode).toMatch(/^MM-[A-Z0-9]{6}$/);

    try {
      const ticket = await caller.wedding.getTicket({ code: result.ticketCode });
      expect(ticket).toBeDefined();
      expect(ticket?.name).toBe("Test Automatisé Éphémère");
      expect(ticket?.guestsCount).toBe(2);
      expect(ticket?.side).toBe("bride");
      expect(ticket?.events).toBe("civil,church");
    } finally {
      if (result.rsvp?.id) {
        await db.deleteRsvp(result.rsvp.id);
      }
    }
  });
});
