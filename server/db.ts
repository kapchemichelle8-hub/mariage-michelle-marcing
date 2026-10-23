import { asc, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  guestbookMessages,
  invitedGuests,
  InsertUser,
  legacyGuestbookMessages,
  legacySeatPlan,
  Rsvp,
  rsvps,
  users,
  weddingEventTimes,
  weddingTables,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { findSeatAssignment, normalizeGuestName } from "./seatPlan";
import type { SeatAssignment } from "./seatPlan";

let _db: ReturnType<typeof drizzle> | null = null;

const DEFAULT_EVENT_TIMES = {
  civil: "13:00",
  church: "15:00",
  party: "20:00",
} as const;
type WeddingEventId = keyof typeof DEFAULT_EVENT_TIMES;

function formatEventTime(value: string) {
  const [hours, minutes] = value.split(":");
  return `${Number(hours)} h ${minutes}`;
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    values[field] = value ?? null;
    updateSet[field] = value ?? null;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result[0];
}

/** Legacy numeric ticket IDs are kept for all historical responses. */
export async function getNextSequentialTicketCode() {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  const rows = await db.select({ ticketCode: rsvps.ticketCode }).from(rsvps);
  const used = new Set(rows.map(row => row.ticketCode));
  let next = rows.length + 1;
  for (const code of Array.from(used)) {
    if (/^\d{3,}$/.test(code)) next = Math.max(next, Number(code) + 1);
  }
  let candidate = String(next).padStart(3, "0");
  while (used.has(candidate)) {
    next += 1;
    candidate = String(next).padStart(3, "0");
  }
  return candidate;
}

export async function getRsvpByTicketCode(ticketCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.ticketCode, ticketCode))
    .limit(1);
  return rows[0];
}

export async function getRsvpByInvitationId(invitationId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.invitationId, invitationId))
    .limit(1);
  return rows[0];
}

export async function getInvitationByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(invitedGuests)
    .where(eq(invitedGuests.code, code))
    .limit(1);
  return rows[0];
}

export async function getInvitationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(invitedGuests)
    .where(eq(invitedGuests.id, id))
    .limit(1);
  return rows[0];
}

export async function getAllInvitations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(invitedGuests).orderBy(asc(invitedGuests.code));
}

export async function getWeddingTables() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(weddingTables).orderBy(asc(weddingTables.tableNumber));
}

export async function getWeddingSchedule() {
  const db = await getDb();
  const values: Record<WeddingEventId, string> = { ...DEFAULT_EVENT_TIMES };
  if (db) {
    const rows = await db.select().from(weddingEventTimes);
    for (const row of rows) {
      if (row.eventId in values && /^\d{2}:\d{2}$/.test(row.timeValue)) {
        values[row.eventId as WeddingEventId] = row.timeValue;
      }
    }
  }
  return Object.fromEntries(
    Object.entries(values).map(([eventId, value]) => [
      eventId,
      formatEventTime(value),
    ])
  ) as Record<WeddingEventId, string>;
}

export async function getWeddingScheduleForAdmin() {
  const db = await getDb();
  const values: Record<WeddingEventId, string> = { ...DEFAULT_EVENT_TIMES };
  if (db) {
    const rows = await db.select().from(weddingEventTimes);
    for (const row of rows) {
      if (row.eventId in values && /^\d{2}:\d{2}$/.test(row.timeValue)) {
        values[row.eventId as WeddingEventId] = row.timeValue;
      }
    }
  }
  return values;
}

export async function updateWeddingSchedule(
  values: Record<WeddingEventId, string>
) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  for (const eventId of Object.keys(DEFAULT_EVENT_TIMES) as WeddingEventId[]) {
    await db
      .insert(weddingEventTimes)
      .values({ eventId, timeValue: values[eventId] })
      .onDuplicateKeyUpdate({
        set: { timeValue: values[eventId], updatedAt: new Date() },
      });
  }
  return getWeddingScheduleForAdmin();
}

export async function assignInvitationTable(
  code: string,
  tableNumber: string | null
) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");

  if (tableNumber === null) {
    await db
      .update(invitedGuests)
      .set({ tableNumber: null, tableVirtue: null })
      .where(eq(invitedGuests.code, code));
    return;
  }

  const tables = await db
    .select()
    .from(weddingTables)
    .where(eq(weddingTables.tableNumber, tableNumber))
    .limit(1);
  const table = tables[0];
  if (!table) throw new Error("Cette table n’existe pas dans le plan privé.");

  await db
    .update(invitedGuests)
    .set({ tableNumber: table.tableNumber, tableVirtue: table.tableVirtue })
    .where(eq(invitedGuests.code, code));
}

export async function getLegacySeatAssignments(): Promise<SeatAssignment[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(legacySeatPlan);
  return rows.map(row => ({
    tableNumber: row.tableNumber,
    tableVirtue: row.tableVirtue,
    matchedGuestName: row.guestName,
  }));
}

export async function getLegacySeatAssignmentByName(name: string) {
  const assignments = await getLegacySeatAssignments();
  return findSeatAssignment(name, assignments);
}

export class InvitationRsvpClaimError extends Error {
  constructor(
    public readonly reason:
      | "invitation-already-used"
      | "partner-already-used"
      | "couple-not-allowed"
      | "couple-already-consumed"
      | "invalid-couple-link"
      | "invalid-guests-count"
  ) {
    super(reason);
    this.name = "InvitationRsvpClaimError";
  }
}

/**
 * Claims one invitation code. When two places are selected, both validated
 * couple codes are locked in a single transaction before the RSVP is inserted.
 */
export async function claimInvitationRsvp(data: {
  invitationId: number;
  partnerInvitationId: number | null;
  name: string;
  side: "bride" | "groom";
  attendance: "yes" | "no";
  events: string | null;
  guestsCount: number;
  ticketCode: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");

  const isGuestsCountValid =
    (data.attendance === "yes" && (data.guestsCount === 1 || data.guestsCount === 2)) ||
    (data.attendance === "no" && data.guestsCount === 0);
  if (!isGuestsCountValid) {
    throw new InvitationRsvpClaimError("invalid-guests-count");
  }
  if (data.guestsCount === 2 && data.partnerInvitationId === null) {
    throw new InvitationRsvpClaimError("couple-not-allowed");
  }
  if (data.partnerInvitationId === data.invitationId) {
    throw new InvitationRsvpClaimError("invalid-couple-link");
  }

  const invitationIds = [data.invitationId, data.partnerInvitationId]
    .filter((id): id is number => typeof id === "number")
    .sort((left, right) => left - right);

  return db.transaction(async tx => {
    // The identical order prevents two simultaneous partner submissions from
    // taking locks in opposite directions.
    await tx.execute(sql`SELECT id FROM invited_guests WHERE id IN (${sql.join(
      invitationIds.map(id => sql`${id}`),
      sql`, `
    )}) ORDER BY id FOR UPDATE`);

    const lockedInvitations = await tx
      .select({
        id: invitedGuests.id,
        partnerInvitationId: invitedGuests.partnerInvitationId,
        coupleClaimedAt: invitedGuests.coupleClaimedAt,
      })
      .from(invitedGuests)
      .where(inArray(invitedGuests.id, invitationIds));
    const currentInvitation = lockedInvitations.find(
      row => row.id === data.invitationId
    );
    const partnerInvitation = lockedInvitations.find(
      row => row.id === data.partnerInvitationId
    );
    if (!currentInvitation) {
      throw new InvitationRsvpClaimError("invalid-couple-link");
    }
    if (data.partnerInvitationId === null) {
      if (currentInvitation.partnerInvitationId !== null) {
        throw new InvitationRsvpClaimError("invalid-couple-link");
      }
    } else if (
      !partnerInvitation ||
      currentInvitation.partnerInvitationId !== partnerInvitation.id ||
      partnerInvitation.partnerInvitationId !== currentInvitation.id
    ) {
      throw new InvitationRsvpClaimError("invalid-couple-link");
    }
    if (
      currentInvitation.coupleClaimedAt !== null ||
      partnerInvitation?.coupleClaimedAt !== null
    ) {
      throw new InvitationRsvpClaimError("couple-already-consumed");
    }

    const existing = await tx
      .select({
        invitationId: rsvps.invitationId,
        guestsCount: rsvps.guestsCount,
      })
      .from(rsvps)
      .where(inArray(rsvps.invitationId, invitationIds));

    if (existing.some(row => row.invitationId === data.invitationId)) {
      throw new InvitationRsvpClaimError("invitation-already-used");
    }
    const partnerResponse = existing.find(
      row => row.invitationId === data.partnerInvitationId
    );
    if (partnerResponse?.guestsCount === 2) {
      throw new InvitationRsvpClaimError("partner-already-used");
    }
    if (
      data.guestsCount === 2 &&
      data.partnerInvitationId !== null &&
      partnerResponse
    ) {
      throw new InvitationRsvpClaimError("partner-already-used");
    }

    if (data.guestsCount === 2) {
      await tx
        .update(invitedGuests)
        .set({ coupleClaimedAt: new Date() })
        .where(inArray(invitedGuests.id, invitationIds));
    }

    await tx.insert(rsvps).values({
      invitationId: data.invitationId,
      name: data.name,
      side: data.side,
      attendance: data.attendance,
      events: data.events,
      guestsCount: data.guestsCount,
      ticketCode: data.ticketCode,
      message: null,
    });

    const rows = await tx
      .select()
      .from(rsvps)
      .where(eq(rsvps.ticketCode, data.ticketCode))
      .limit(1);
    return rows[0];
  });
}

export async function addGuestbookMessage(data: {
  invitationId: number;
  authorName: string;
  message: string;
  messageHash: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.insert(guestbookMessages).values(data);
}

export async function getAllGuestbookMessages() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(guestbookMessages)
    .orderBy(desc(guestbookMessages.createdAt));
}

export async function getAllRsvps() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
}

export async function getAdminRsvps() {
  const db = await getDb();
  if (!db) return [];

  const [rows, historicalSeats, newMessages] = await Promise.all([
    db
      .select({
        id: rsvps.id,
        name: rsvps.name,
        email: rsvps.email,
        attendance: rsvps.attendance,
        side: rsvps.side,
        events: rsvps.events,
        guestsCount: rsvps.guestsCount,
        legacyMessage: rsvps.message,
        ticketCode: rsvps.ticketCode,
        invitationId: rsvps.invitationId,
        createdAt: rsvps.createdAt,
        updatedAt: rsvps.updatedAt,
        invitationCode: invitedGuests.code,
        assignedTableNumber: invitedGuests.tableNumber,
        assignedTableVirtue: invitedGuests.tableVirtue,
      })
      .from(rsvps)
      .leftJoin(invitedGuests, eq(rsvps.invitationId, invitedGuests.id))
      .orderBy(desc(rsvps.createdAt)),
    getLegacySeatAssignments(),
    getAllGuestbookMessages(),
  ]);

  const latestNewMessage = new Map<
    number,
    { id: number; message: string; name: string; createdAt: Date }
  >();
  for (const message of newMessages) {
    if (!latestNewMessage.has(message.invitationId)) {
      latestNewMessage.set(message.invitationId, {
        id: message.id,
        message: message.message,
        name: message.authorName,
        createdAt: message.createdAt,
      });
    }
  }

  return rows.map(row => {
    if (row.invitationId !== null && row.invitationId !== undefined) {
      const latest = latestNewMessage.get(row.invitationId);
      return {
        ...row,
        responseSource: "code" as const,
        tableNumber: row.assignedTableNumber,
        tableVirtue: row.assignedTableVirtue,
        message: latest?.message ?? null,
        messageId: latest?.id ?? null,
        messageSource: latest ? ("code" as const) : null,
        updatedAt: row.updatedAt,
      };
    }

    const seat = findSeatAssignment(row.name, historicalSeats);
    return {
      ...row,
      responseSource: "historique" as const,
      invitationCode: null,
      tableNumber: seat?.tableNumber ?? null,
      tableVirtue: seat?.tableVirtue ?? null,
      message: row.legacyMessage,
      messageId: row.legacyMessage?.trim() ? row.id : null,
      messageSource: row.legacyMessage?.trim() ? ("historique" as const) : null,
      updatedAt: row.updatedAt,
    };
  });
}

export async function deleteRsvp(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  const rows = await db
    .select({ invitationId: rsvps.invitationId })
    .from(rsvps)
    .where(eq(rsvps.id, id))
    .limit(1);
  if (!rows[0]) throw new Error("Réponse introuvable.");
  if (rows[0].invitationId === null) {
    throw new Error("Les anciennes réponses historiques sont protégées.");
  }
  await db.delete(rsvps).where(eq(rsvps.id, id));
}

/** Only newly added messages can be removed; historical messages stay intact. */
export async function deleteGuestbookMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.delete(guestbookMessages).where(eq(guestbookMessages.id, id));
}

export async function getAdminWeddingStats() {
  const db = await getDb();
  if (!db) {
    return {
      attendingResponses: 0,
      totalGuests: 0,
      declinedResponses: 0,
      totalResponses: 0,
      brideGuests: 0,
      groomGuests: 0,
      historicalResponses: 0,
      historicalMessages: 0,
      invitedCount: 0,
      unassignedInviteCount: 0,
    };
  }

  const [rows, inviteRows, archivedMessages] = await Promise.all([
    db.select().from(rsvps),
    db
      .select({ tableNumber: invitedGuests.tableNumber })
      .from(invitedGuests),
    db.select({ id: legacyGuestbookMessages.id }).from(legacyGuestbookMessages),
  ]);
  const current = rows.filter(row => row.invitationId !== null);
  const historical = rows.filter(row => row.invitationId === null);
  const attending = current.filter(row => row.attendance === "yes");
  const declined = current.filter(row => row.attendance === "no");
  const countGuests = (list: typeof current) =>
    list.reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);
  return {
    attendingResponses: attending.length,
    totalGuests: countGuests(attending),
    brideGuests: countGuests(attending.filter(row => row.side === "bride")),
    groomGuests: countGuests(attending.filter(row => row.side === "groom")),
    declinedResponses: declined.length,
    totalResponses: current.length,
    historicalResponses: historical.length,
    historicalMessages:
      historical.filter(row => Boolean(row.message?.trim())).length +
      archivedMessages.length,
    invitedCount: inviteRows.length,
    unassignedInviteCount: inviteRows.filter(row => !row.tableNumber).length,
  };
}

export async function getApprovedMessages() {
  const db = await getDb();
  if (!db) return [];

  const [historical, archived, current] = await Promise.all([
    db
      .select({
        id: rsvps.id,
        name: rsvps.name,
        message: rsvps.message,
        createdAt: rsvps.createdAt,
      })
      .from(rsvps)
      .where(sql`${rsvps.message} IS NOT NULL AND ${rsvps.message} != ''`),
    db
      .select({
        id: legacyGuestbookMessages.id,
        name: legacyGuestbookMessages.authorName,
        message: legacyGuestbookMessages.message,
        createdAt: legacyGuestbookMessages.createdAt,
      })
      .from(legacyGuestbookMessages),
    db
      .select({
        id: guestbookMessages.id,
        name: guestbookMessages.authorName,
        message: guestbookMessages.message,
        createdAt: guestbookMessages.createdAt,
      })
      .from(guestbookMessages),
  ]);

  return [
    ...historical.map(row => ({
      ...row,
      id: `historique-${row.id}`,
      source: "historique" as const,
    })),
    ...archived.map(row => ({
      ...row,
      id: `historique-archive-${row.id}`,
      source: "historique" as const,
    })),
    ...current.map(row => ({
      ...row,
      id: `code-${row.id}`,
      source: "code" as const,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Kept only for defensive checks during one-time data import, not identity matching. */
export function normalizeImportedName(value: string) {
  return normalizeGuestName(value);
}

export type AdminRsvp = Awaited<ReturnType<typeof getAdminRsvps>>[number];
export type InvitationRow = Awaited<ReturnType<typeof getAllInvitations>>[number];
export type HistoricalRsvp = Rsvp;
