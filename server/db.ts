import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { rsvps, type NewRsvpRow, type RsvpRow } from "../drizzle/schema";

export type GuestbookEntry = Pick<RsvpRow, "id" | "name" | "side" | "message" | "createdAt">;

/**
 * Accès aux réponses RSVP.
 * Volontairement, il n'existe AUCUNE méthode de suppression globale :
 * seule une ligne précise peut être supprimée, par son identifiant exact.
 */
export interface RsvpStore {
  insert(data: Omit<NewRsvpRow, "id" | "createdAt" | "updatedAt">): Promise<RsvpRow>;
  findByTicketCode(code: string): Promise<RsvpRow | undefined>;
  ticketCodeExists(code: string): Promise<boolean>;
  listGuestbook(offset: number, limit: number): Promise<{ items: GuestbookEntry[]; hasMore: boolean }>;
  listAll(): Promise<RsvpRow[]>;
  deleteById(id: number): Promise<boolean>;
}

export class MysqlRsvpStore implements RsvpStore {
  constructor(private db: MySql2Database) {}

  async insert(data: Omit<NewRsvpRow, "id" | "createdAt" | "updatedAt">) {
    const [result] = await this.db.insert(rsvps).values(data).$returningId();
    const [row] = await this.db.select().from(rsvps).where(eq(rsvps.id, result.id)).limit(1);
    return row;
  }

  async findByTicketCode(code: string) {
    const [row] = await this.db.select().from(rsvps).where(eq(rsvps.ticketCode, code)).limit(1);
    return row;
  }

  async ticketCodeExists(code: string) {
    return Boolean(await this.findByTicketCode(code));
  }

  async listGuestbook(offset: number, limit: number) {
    const rows = await this.db
      .select({
        id: rsvps.id,
        name: rsvps.name,
        side: rsvps.side,
        message: rsvps.message,
        createdAt: rsvps.createdAt,
      })
      .from(rsvps)
      .where(and(isNotNull(rsvps.message), ne(rsvps.message, "")))
      .orderBy(desc(rsvps.createdAt), desc(rsvps.id))
      .limit(limit + 1)
      .offset(offset);
    return { items: rows.slice(0, limit), hasMore: rows.length > limit };
  }

  async listAll() {
    return this.db.select().from(rsvps).orderBy(desc(rsvps.createdAt), desc(rsvps.id));
  }

  async deleteById(id: number) {
    const [result] = await this.db.delete(rsvps).where(eq(rsvps.id, id));
    return result.affectedRows === 1;
  }
}

/** Implémentation en mémoire, utilisée par les tests : elle ne touche jamais la vraie base. */
export class MemoryRsvpStore implements RsvpStore {
  rows: RsvpRow[] = [];
  private nextId = 1;
  private clock = Date.now();

  async insert(data: Omit<NewRsvpRow, "id" | "createdAt" | "updatedAt">) {
    // Horloge strictement croissante pour un ordre stable dans les tests.
    const now = new Date((this.clock += 1000));
    const row: RsvpRow = {
      id: this.nextId++,
      name: data.name,
      email: data.email ?? null,
      attendance: data.attendance,
      side: data.side,
      guestsCount: data.guestsCount ?? 0,
      message: data.message ?? null,
      ticketCode: data.ticketCode ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.rows.push(row);
    return { ...row };
  }

  async findByTicketCode(code: string) {
    return this.rows.find((r) => r.ticketCode === code);
  }

  async ticketCodeExists(code: string) {
    return this.rows.some((r) => r.ticketCode === code);
  }

  async listGuestbook(offset: number, limit: number) {
    const all = (await this.listAll())
      .filter((r) => r.message && r.message.trim() !== "")
      .map(({ id, name, side, message, createdAt }) => ({ id, name, side, message, createdAt }));
    return { items: all.slice(offset, offset + limit), hasMore: all.length > offset + limit };
  }

  async listAll() {
    return [...this.rows].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id
    );
  }

  async deleteById(id: number) {
    const index = this.rows.findIndex((r) => r.id === id);
    if (index === -1) return false;
    this.rows.splice(index, 1);
    return true;
  }
}

let pool: mysql.Pool | undefined;

export function createMysqlStore(databaseUrl: string): RsvpStore {
  pool ??= mysql.createPool({ uri: databaseUrl, connectionLimit: 5, timezone: "Z" });
  return new MysqlRsvpStore(drizzle(pool));
}
