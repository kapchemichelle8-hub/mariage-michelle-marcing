import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/** Core user table backing Manus OAuth. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** A private row from one of the two official guest lists. */
export const invitedGuests = mysqlTable(
  "invited_guests",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 12 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    side: mysqlEnum("side", ["bride", "groom"]).notNull(),
    sourceSheet: varchar("sourceSheet", { length: 40 }).notNull(),
    sourceRow: int("sourceRow").notNull(),
    sourceSerial: int("sourceSerial").notNull(),
    tableNumber: varchar("tableNumber", { length: 12 }),
    tableVirtue: varchar("tableVirtue", { length: 160 }),
    /** Private symmetric link to the other code of a validated couple. */
    partnerInvitationId: int("partnerInvitationId"),
    /** Set on both partner rows when one code confirms the couple together. */
    coupleClaimedAt: timestamp("coupleClaimedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    sourceRowUnique: uniqueIndex("invited_guests_source_row_unique").on(
      table.sourceSheet,
      table.sourceRow
    ),
    sourceSerialUnique: uniqueIndex("invited_guests_source_serial_unique").on(
      table.sourceSheet,
      table.sourceSerial
    ),
    sideIdx: index("invited_guests_side_idx").on(table.side),
    tableIdx: index("invited_guests_table_idx").on(table.tableNumber),
    partnerInvitationUnique: uniqueIndex(
      "invited_guests_partner_invitation_unique"
    ).on(table.partnerInvitationId),
  })
);

export type InvitedGuest = typeof invitedGuests.$inferSelect;

/** Private list of official table names used by the admin assignment control. */
export const weddingTables = mysqlTable("wedding_tables", {
  tableNumber: varchar("tableNumber", { length: 12 }).primaryKey(),
  tableVirtue: varchar("tableVirtue", { length: 160 }).notNull(),
});

/** Private settings for the three public programme times. */
export const weddingEventTimes = mysqlTable("wedding_event_times", {
  eventId: varchar("eventId", { length: 16 }).primaryKey(),
  timeValue: varchar("timeValue", { length: 5 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Private snapshot that keeps legacy numeric tickets usable after sheet privacy changes. */
export const legacySeatPlan = mysqlTable(
  "legacy_seat_plan",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceRow: int("sourceRow").notNull().unique(),
    tableNumber: varchar("tableNumber", { length: 12 }).notNull(),
    tableVirtue: varchar("tableVirtue", { length: 160 }).notNull(),
    guestName: varchar("guestName", { length: 200 }).notNull(),
  },
  table => ({
    guestNameIdx: index("legacy_seat_plan_guest_name_idx").on(table.guestName),
  })
);

/** RSVP rows; invitationId identifies the one-time code registration. */
export const rsvps = mysqlTable(
  "rsvps",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }),
    attendance: mysqlEnum("attendance", ["yes", "no"]).notNull(),
    /** Côté de l'invité. Nul pour certaines anciennes réponses. */
    side: mysqlEnum("side", ["bride", "groom"]),
    /** Moments choisis : ex. "civil,church,party". */
    events: varchar("events", { length: 120 }),
    guestsCount: int("guestsCount").default(1).notNull(),
    /** The old message column stays intact for every historical RSVP. */
    message: text("message"),
    ticketCode: varchar("ticketCode", { length: 32 }).notNull().unique(),
    invitationId: int("invitationId").references(() => invitedGuests.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    invitationUnique: uniqueIndex("rsvps_invitation_id_unique").on(
      table.invitationId
    ),
  })
);

export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = typeof rsvps.$inferInsert;

/** Archived historical messages kept after the RSVP reset. */
export const legacyGuestbookMessages = mysqlTable(
  "legacy_guestbook_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    sourceRsvpId: int("sourceRsvpId").notNull().unique(),
    authorName: varchar("authorName", { length: 160 }).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  table => ({
    createdAtIdx: index("legacy_guestbook_messages_created_at_idx").on(
      table.createdAt
    ),
  })
);

/** New messages are append-only and never replace the historical RSVP.message values. */
export const guestbookMessages = mysqlTable(
  "guestbook_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    invitationId: int("invitationId")
      .notNull()
      .references(() => invitedGuests.id, { onDelete: "restrict" }),
    authorName: varchar("authorName", { length: 160 }).notNull(),
    message: text("message").notNull(),
    messageHash: varchar("messageHash", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    invitationIdIdx: index("guestbook_messages_invitation_id_idx").on(
      table.invitationId
    ),
    createdAtIdx: index("guestbook_messages_created_at_idx").on(
      table.createdAt
    ),
  })
);
