import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

function generateTicketCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MM-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  wedding: router({
    // Permet d'afficher publiquement quelques messages récents d'amour et de félicitations
    getMessages: publicProcedure.query(async () => {
      return db.getApprovedMessages();
    }),

    // Récupérer un billet électronique via son code unique
    getTicket: publicProcedure
      .input(
        z.object({
          code: z.string().min(3),
        })
      )
      .query(async ({ input }) => {
        const ticket = await db.getRsvpByTicketCode(input.code);
        if (!ticket) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Billet introuvable avec ce code d'invitation",
          });
        }
        return ticket;
      }),

    // Soumission du formulaire d'invitation (RSVP)
    submitRsvp: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2, "Veuillez renseigner votre nom complet"),
          email: z.string().trim().email("Adresse email invalide").optional().or(z.literal("")),
          attendance: z.enum(["yes", "no"]),
          guestsCount: z.number().int().min(1).max(10).default(1),
          message: z.string().trim().max(1000).optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input }) => {
        const ticketCode = generateTicketCode();
        const saved = await db.createRsvp({
          name: input.name,
          email: input.email || null,
          attendance: input.attendance,
          guestsCount: input.attendance === "yes" ? input.guestsCount : 0,
          message: input.message || null,
          ticketCode,
        });

        return {
          success: true,
          rsvp: saved,
          ticketCode,
          attendance: input.attendance,
          message:
            input.attendance === "yes"
              ? "Votre présence a été enregistrée avec succès. Voici votre billet d'invitation officiel !"
              : "Nous avons bien reçu votre message. Merci infiniment pour votre chaleureuse pensée !",
        };
      }),

    // Statistiques générales pour le couple
    getStats: publicProcedure.query(async () => {
      return db.getPublicWeddingStats();
    }),
  }),

  admin: router({
    // Liste complète de toutes les réponses avec détails
    listRsvps: adminProcedure.query(async () => {
      return db.getAllRsvps();
    }),
    stats: adminProcedure.query(async () => {
      return db.getPublicWeddingStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
