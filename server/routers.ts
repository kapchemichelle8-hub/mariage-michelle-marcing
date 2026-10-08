import { randomInt } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { rsvpInputSchema, TICKET_CODE_PATTERN } from "../shared/rsvp";
import type { RsvpRow } from "../drizzle/schema";
import {
  clearAttempts,
  createAdminToken,
  isRateLimited,
  passwordMatches,
  recordFailedAttempt,
} from "./adminAuth";
import type { RsvpStore } from "./db";
import { adminProcedure, publicProcedure, router } from "./trpc";

// Sans I, O, 0 et 1 pour éviter les confusions à la lecture du billet.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function generateTicketCode(store: RsvpStore) {
  for (let attempt = 0; attempt < 20; attempt++) {
    let suffix = "";
    for (let i = 0; i < 6; i++) suffix += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
    const code = `MM-${suffix}`;
    if (!(await store.ticketCodeExists(code))) return code;
  }
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Code billet indisponible." });
}

const csvCell = (value: unknown) => {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
};

export function rsvpsToCsv(rows: RsvpRow[]) {
  const header = [
    "id",
    "nom",
    "email",
    "presence",
    "cote",
    "personnes",
    "message",
    "code_billet",
    "cree_le",
    "modifie_le",
  ];
  const lines = rows.map((r) =>
    [
      r.id,
      r.name,
      r.email,
      r.attendance === "yes" ? "present" : "absent",
      r.side === "mariee" ? "mariee" : "marie",
      r.guestsCount,
      r.message,
      r.ticketCode,
      r.createdAt,
      r.updatedAt,
    ]
      .map(csvCell)
      .join(",")
  );
  // BOM pour qu'Excel affiche correctement les accents.
  return "﻿" + [header.join(","), ...lines].join("\r\n");
}

export const appRouter = router({
  rsvp: router({
    submit: publicProcedure.input(rsvpInputSchema).mutation(async ({ ctx, input }) => {
      const attending = input.attendance === "yes";
      const row = await ctx.store.insert({
        name: input.name,
        email: input.email ?? null,
        side: input.side,
        attendance: input.attendance,
        guestsCount: attending ? input.guestsCount : 0,
        message: input.message ? input.message : null,
        ticketCode: attending ? await generateTicketCode(ctx.store) : null,
      });
      return { attendance: row.attendance, ticketCode: row.ticketCode, name: row.name };
    }),

    ticket: publicProcedure
      .input(z.object({ code: z.string().trim().toUpperCase() }))
      .query(async ({ ctx, input }) => {
        if (!TICKET_CODE_PATTERN.test(input.code)) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Billet introuvable." });
        }
        const row = await ctx.store.findByTicketCode(input.code);
        if (!row || row.attendance !== "yes") {
          throw new TRPCError({ code: "NOT_FOUND", message: "Billet introuvable." });
        }
        return {
          name: row.name,
          side: row.side,
          guestsCount: row.guestsCount,
          ticketCode: row.ticketCode!,
        };
      }),
  }),

  guestbook: router({
    // Public : uniquement le nom, le côté et le mot doux. Aucun compteur.
    list: publicProcedure
      .input(
        z.object({
          offset: z.number().int().min(0).default(0),
          limit: z.number().int().min(1).max(30).default(3),
        })
      )
      .query(({ ctx, input }) => ctx.store.listGuestbook(input.offset, input.limit)),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string().min(1).max(200) }))
      .mutation(async ({ ctx, input }) => {
        if (isRateLimited(ctx.ip)) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Trop de tentatives. Réessayez dans quelques minutes.",
          });
        }
        if (!ctx.sessionSecret || !passwordMatches(input.password, ctx.adminPassword)) {
          recordFailedAttempt(ctx.ip);
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Mot de passe incorrect." });
        }
        clearAttempts(ctx.ip);
        return { token: await createAdminToken(ctx.sessionSecret) };
      }),

    stats: adminProcedure.query(async ({ ctx }) => {
      const rows = await ctx.store.listAll();
      const present = rows.filter((r) => r.attendance === "yes");
      const guests = (side?: "mariee" | "marie") =>
        present
          .filter((r) => !side || r.side === side)
          .reduce((sum, r) => sum + r.guestsCount, 0);
      return {
        responses: rows.length,
        present: present.length,
        absent: rows.length - present.length,
        totalGuests: guests(),
        guestsMariee: guests("mariee"),
        guestsMarie: guests("marie"),
        messages: rows.filter((r) => r.message && r.message.trim() !== "").length,
      };
    }),

    listRsvps: adminProcedure.query(({ ctx }) => ctx.store.listAll()),

    exportCsv: adminProcedure.query(async ({ ctx }) => ({
      filename: `rsvps-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`,
      csv: rsvpsToCsv(await ctx.store.listAll()),
    })),

    // Suppression d'UNE ligne, par identifiant exact, avec confirmation explicite.
    deleteRsvp: adminProcedure
      .input(z.object({ id: z.number().int().positive(), confirm: z.literal(true) }))
      .mutation(async ({ ctx, input }) => {
        const deleted = await ctx.store.deleteById(input.id);
        if (!deleted) throw new TRPCError({ code: "NOT_FOUND", message: "Réponse introuvable." });
        return { deletedId: input.id };
      }),
  }),
});

export type AppRouter = typeof appRouter;
