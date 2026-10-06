import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
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
      name: "Tantine Marie & Oncle Jean",
      side: "bride",
      attendance: "yes",
      guestsCount: 2,
      message: "Que du bonheur pour cette magnifique célébration !",
    });

    expect(result.success).toBe(true);
    expect(result.attendance).toBe("yes");
    expect(result.ticketCode).toMatch(/^MM-[A-Z0-9]{6}$/);

    const ticket = await caller.wedding.getTicket({ code: result.ticketCode });
    expect(ticket).toBeDefined();
    expect(ticket?.name).toBe("Tantine Marie & Oncle Jean");
    expect(ticket?.guestsCount).toBe(2);
    expect(ticket?.side).toBe("bride");

    if (ticket?.id) {
      const { deleteRsvp } = await import("./db");
      await deleteRsvp(ticket.id);
    }
  });
});
