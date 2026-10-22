import { asc, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  guestbookMessages,
  invitedGuests,
  InsertRsvp,
  InsertUser,
  legacySeatPlan,
  Rsvp,
  rsvps,
  users,
  weddingTables,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { findSeatAssignment, normalizeGuestName } from "./seatPlan";
import type { SeatAssignment } from "./seatPlan";

let _db: ReturnType<typeof drizzle> | null = null;

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

/**
 * Ajoute la colonne `side` si la base n'a pas encore reçu la migration 0002,
 * pour que le formulaire fonctionne même si l'hébergeur n'applique pas les migrations.
 */
export async function ensureRsvpSideColumn() {
  const db = await getDb();
  if (!db) return;
  try {
    const [rows] = (await db.execute(
      sql`SELECT COUNT(*) AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rsvps' AND COLUMN_NAME = 'side'`
    )) as unknown as [Array<{ n: number | string }>];
    if (Number(rows[0]?.n) === 0) {
      await db.execute(
        sql`ALTER TABLE \`rsvps\` ADD \`side\` enum('bride','groom')`
      );
      console.log("[Database] Colonne rsvps.side ajoutée");
    }
  } catch (error) {
    console.warn(
      "[Database] Vérification de la colonne rsvps.side impossible:",
      error
    );
  }
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

/** Retained for the historical RSVP path; the public form no longer calls it. */
export async function createRsvp(data: InsertRsvp) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.insert(rsvps).values(data);
  const rows = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.ticketCode, data.ticketCode))
    .limit(1);
  return rows[0];
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

export async function upsertInvitationRsvp(data: {
  invitationId: number;
  name: string;
  side: "bride" | "groom";
  attendance: "yes" | "no";
  events: string | null;
  guestsCount: number;
  ticketCode: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");

  await db
    .insert(rsvps)
    .values({ ...data, message: null })
    .onDuplicateKeyUpdate({
      set: {
        name: data.name,
        side: data.side,
        attendance: data.attendance,
        events: data.events,
        guestsCount: data.guestsCount,
        updatedAt: new Date(),
      },
    });

  const rows = await db
    .select()
    .from(rsvps)
    .where(eq(rsvps.invitationId, data.invitationId))
    .limit(1);
  return rows[0];
}

export async function addGuestbookMessage(data: {
  invitationId: number;
  authorName: string;
  message: string;
  messageHash: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.insert(guestbookMessages).values(data).onDuplicateKeyUpdate({
    set: { message: data.message },
  });
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

  const [rows, inviteRows] = await Promise.all([
    db.select().from(rsvps),
    db
      .select({ tableNumber: invitedGuests.tableNumber })
      .from(invitedGuests),
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
    historicalMessages: historical.filter(row => Boolean(row.message?.trim()))
      .length,
    invitedCount: inviteRows.length,
    unassignedInviteCount: inviteRows.filter(row => !row.tableNumber).length,
  };
}

export async function getApprovedMessages() {
  const db = await getDb();
  if (!db) return [];

  const [historical, current] = await Promise.all([
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
