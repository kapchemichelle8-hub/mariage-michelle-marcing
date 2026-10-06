import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertRsvp, InsertUser, rsvps, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

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
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function createRsvp(data: InsertRsvp) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.insert(rsvps).values(data);
  const rows = await db.select().from(rsvps).where(eq(rsvps.ticketCode, data.ticketCode)).limit(1);
  return rows[0];
}

export async function getRsvpByTicketCode(ticketCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(rsvps).where(eq(rsvps.ticketCode, ticketCode)).limit(1);
  return rows[0];
}

export async function getAllRsvps() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
}

export async function deleteRsvp(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.delete(rsvps).where(eq(rsvps.id, id));
}

export async function deleteGuestbookMessage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Base de données indisponible");
  await db.update(rsvps).set({ message: null }).where(eq(rsvps.id, id));
}

export async function getPublicWeddingStats() {
  const db = await getDb();
  if (!db) return { attendingResponses: 0, totalGuests: 0, declinedResponses: 0, totalResponses: 0, brideGuests: 0, groomGuests: 0 };
  const rows = await db.select().from(rsvps);
  const attending = rows.filter((r) => r.attendance === "yes");
  const declined = rows.filter((r) => r.attendance === "no");
  const countGuests = (list: typeof rows) => list.reduce((acc, curr) => acc + (curr.guestsCount || 1), 0);
  return {
    attendingResponses: attending.length,
    totalGuests: countGuests(attending),
    brideGuests: countGuests(attending.filter((r) => r.side === "bride")),
    groomGuests: countGuests(attending.filter((r) => r.side === "groom")),
    declinedResponses: declined.length,
    totalResponses: rows.length,
  };
}

export async function getApprovedMessages() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ id: rsvps.id, name: rsvps.name, message: rsvps.message, createdAt: rsvps.createdAt })
    .from(rsvps)
    .where(sql`${rsvps.message} IS NOT NULL AND ${rsvps.message} != ''`)
    .orderBy(desc(rsvps.createdAt))
    .limit(20);
}
