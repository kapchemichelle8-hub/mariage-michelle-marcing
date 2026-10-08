import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Une ligne = une réponse d'invité ou de groupe.
 * Cette table contient les mots doux des invités : aucune suppression globale,
 * aucune réécriture des messages existants.
 */
export const rsvps = mysqlTable("rsvps", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  attendance: mysqlEnum("attendance", ["yes", "no"]).notNull(),
  side: mysqlEnum("side", ["mariee", "marie"]).notNull(),
  guestsCount: int("guestsCount").notNull().default(0),
  message: text("message"),
  ticketCode: varchar("ticketCode", { length: 16 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RsvpRow = typeof rsvps.$inferSelect;
export type NewRsvpRow = typeof rsvps.$inferInsert;
