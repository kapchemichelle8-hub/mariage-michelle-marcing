import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import type { TrpcContext } from "./_core/context";
import { resetInvitationAttemptLimitsForTests } from "./invitationCodes";

type Invitation = NonNullable<
  Awaited<ReturnType<typeof db.getInvitationByCode>>
>;
type Ticket = NonNullable<Awaited<ReturnType<typeof db.getRsvpByTicketCode>>>;
type SavedRsvp = NonNullable<
  Awaited<ReturnType<typeof db.claimInvitationRsvp>>
>;

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getInvitationByCode: vi.fn(),
    getInvitationById: vi.fn(),
    getRsvpByInvitationId: vi.fn(),
    getRsvpByTicketCode: vi.fn(),
    claimInvitationRsvp: vi.fn(),
    addGuestbookMessage: vi.fn(),
  };
});

const invitation = {
  id: 7,
  code: "MM001",
  name: "Nom privé de test",
  side: "bride",
  sourceSheet: "Invités Michelle",
  sourceRow: 5,
  sourceSerial: 1,
  tableNumber: "4",
  tableVirtue: "Sagesse",
  partnerInvitationId: null,
  coupleClaimedAt: null,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
} as Invitation;

const publicTicketToken = "AbCdEf0123456789_-".padEnd(32, "Z");
const savedRsvp = {
  ticketCode: publicTicketToken,
} as SavedRsvp;
const ticketRow = {
  id: 19,
  name: "Nom à afficher",
  email: "private@example.com",
  attendance: "yes",
  side: "bride",
  events: "civil",
  guestsCount: 1,
  message: "Message privé ne pas renvoyer",
  ticketCode: publicTicketToken,
  invitationId: 7,
  createdAt: new Date("2026-10-22T00:00:00.000Z"),
  updatedAt: new Date("2026-10-22T00:00:00.000Z"),
} as Ticket;

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      ip: "unit-test-client",
      headers: {},
    } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("wedding invitation code flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetInvitationAttemptLimitsForTests();
    vi.mocked(db.getInvitationByCode).mockResolvedValue(invitation);
    vi.mocked(db.getInvitationById).mockResolvedValue(invitation);
    vi.mocked(db.getRsvpByTicketCode).mockResolvedValue(ticketRow);
    vi.mocked(db.getRsvpByInvitationId).mockResolvedValue(undefined);
    vi.mocked(db.claimInvitationRsvp).mockResolvedValue(savedRsvp);
    vi.mocked(db.addGuestbookMessage).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("recognizes MM001 and returns side/table without exposing the list name", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.wedding.lookupInvitationCode({ code: "mm001" });

    expect(result).toEqual({
      recognized: true,
      code: "MM001",
      side: "bride",
      tableNumber: "4",
      tableVirtue: "Sagesse",
      isCoupleInvitation: false,
    });
    expect("name" in result).toBe(false);
    expect(db.getInvitationByCode).toHaveBeenCalledWith("MM001");
  });

  it("inserts one RSVP by verified invitation code and appends a separate message", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.wedding.submitRsvp({
      code: "mm001",
      name: "Surnom de test",
      attendance: "yes",
      events: ["civil", "church", "civil"],
      guestsCount: 1,
      message: "Un souhait de test",
    });

    expect(result.success).toBe(true);
    expect(result.attendance).toBe("yes");
    expect(result.ticketCode).toBe(publicTicketToken);
    expect(result.ticketCode).not.toBe("MM001");
    expect(db.claimInvitationRsvp).toHaveBeenCalledWith(
      expect.objectContaining({
        invitationId: 7,
        partnerInvitationId: null,
        ticketCode: expect.stringMatching(/^[A-Za-z0-9_-]{32}$/),
        name: "Surnom de test",
        side: "bride",
        events: "civil,church",
      })
    );
    expect(db.addGuestbookMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        invitationId: 7,
        authorName: "Surnom de test",
        message: "Un souhait de test",
      })
    );
  });

  it("refuses a code that has already been used", async () => {
    vi.mocked(db.getRsvpByInvitationId).mockResolvedValue(ticketRow);
    const caller = appRouter.createCaller(createMockContext());

    await expect(caller.wedding.lookupInvitationCode({ code: "MM001" })).rejects.toMatchObject({
      code: "CONFLICT",
    });
    await expect(
      caller.wedding.submitRsvp({
        code: "MM001",
        name: "Deuxième personne",
        attendance: "no",
      })
    ).rejects.toMatchObject({ code: "CONFLICT" });
    expect(db.claimInvitationRsvp).not.toHaveBeenCalled();
  });

  it("autorise deux personnes seulement pour un code relié à un partenaire", async () => {
    const coupleInvitation = { ...invitation, partnerInvitationId: 8 };
    vi.mocked(db.getInvitationByCode).mockResolvedValue(coupleInvitation);
    const caller = appRouter.createCaller(createMockContext());

    await expect(
      caller.wedding.submitRsvp({
        code: "MM001",
        name: "Premier partenaire",
        attendance: "yes",
        events: ["party"],
        guestsCount: 2,
      })
    ).resolves.toMatchObject({ success: true });

    expect(db.claimInvitationRsvp).toHaveBeenCalledWith(
      expect.objectContaining({ invitationId: 7, partnerInvitationId: 8, guestsCount: 2 })
    );
  });

  it("refuse deux personnes pour une invitation individuelle, même si le navigateur force la valeur", async () => {
    const caller = appRouter.createCaller(createMockContext());

    await expect(
      caller.wedding.submitRsvp({
        code: "MM001",
        name: "Invité individuel",
        attendance: "yes",
        events: ["party"],
        guestsCount: 2,
      })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(db.claimInvitationRsvp).not.toHaveBeenCalled();
  });

  it("n’emploie jamais le verrou couple pour une invitation individuelle", async () => {
    vi.mocked(db.getInvitationByCode).mockResolvedValue({
      ...invitation,
      partnerInvitationId: null,
      coupleClaimedAt: new Date("2026-10-23T10:00:00.000Z"),
    });
    const caller = appRouter.createCaller(createMockContext());

    await expect(caller.wedding.lookupInvitationCode({ code: "MM001" })).resolves.toMatchObject({
      recognized: true,
      isCoupleInvitation: false,
    });
    await expect(
      caller.wedding.submitRsvp({
        code: "MM001",
        name: "Invitation individuelle",
        attendance: "yes",
        events: ["civil"],
        guestsCount: 1,
      })
    ).resolves.toMatchObject({ success: true });
  });

  it("garde le code partenaire bloqué même après une suppression administrative du RSVP", async () => {
    const coupleInvitation = {
      ...invitation,
      partnerInvitationId: 8,
      coupleClaimedAt: new Date("2026-10-23T10:00:00.000Z"),
    };
    vi.mocked(db.getInvitationByCode).mockResolvedValue(coupleInvitation);
    const caller = appRouter.createCaller(createMockContext());

    await expect(caller.wedding.lookupInvitationCode({ code: "MM001" })).rejects.toMatchObject({
      code: "CONFLICT",
      message: expect.stringContaining("invitation de couple déjà confirmée"),
    });
  });

  it("renvoie le conflit atomique si le partenaire vient d’être confirmé à deux", async () => {
    const coupleInvitation = { ...invitation, partnerInvitationId: 8 };
    vi.mocked(db.getInvitationByCode).mockResolvedValue(coupleInvitation);
    vi.mocked(db.claimInvitationRsvp).mockRejectedValue(
      new db.InvitationRsvpClaimError("partner-already-used")
    );
    const caller = appRouter.createCaller(createMockContext());

    await expect(
      caller.wedding.submitRsvp({
        code: "MM001",
        name: "Second partenaire",
        attendance: "yes",
        events: ["party"],
        guestsCount: 1,
      })
    ).rejects.toMatchObject({
      code: "CONFLICT",
      message: expect.stringContaining("invitation de couple déjà confirmée"),
    });
  });

  it("returns an allow-listed ticket payload without email, message, IDs or timestamps", async () => {
    const caller = appRouter.createCaller(createMockContext());
    const result = await caller.wedding.getTicket({ code: publicTicketToken });

    expect(result).toEqual({
      ticketCode: publicTicketToken,
      invitationCode: "MM001",
      name: "Nom à afficher",
      guestsCount: 1,
      attendance: "yes",
      side: "bride",
      events: "civil",
      seatAssignment: { tableNumber: "4", tableVirtue: "Sagesse" },
    });
    if (!result) throw new Error("Le billet de test est absent");
    expect(Object.keys(result).sort()).toEqual(
      [
        "attendance",
        "events",
        "guestsCount",
        "invitationCode",
        "name",
        "seatAssignment",
        "side",
        "ticketCode",
      ].sort()
    );
  });

  it("refuses public access to historical tickets with numeric codes", async () => {
    vi.mocked(db.getRsvpByTicketCode).mockResolvedValue({
      ...ticketRow,
      ticketCode: "001",
      invitationId: null,
    } as Awaited<ReturnType<typeof db.getRsvpByTicketCode>>);
    const caller = appRouter.createCaller(createMockContext());

    await expect(caller.wedding.getTicket({ code: "001" })).resolves.toBeNull();
    expect(db.getInvitationById).not.toHaveBeenCalled();
  });
});
