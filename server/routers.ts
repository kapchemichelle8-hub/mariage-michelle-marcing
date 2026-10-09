import { createHmac, timingSafeEqual } from "node:crypto";
import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const ADMIN_SESSION_COOKIE = "wedding_admin_session_v2";
const LEGACY_ADMIN_SESSION_COOKIE = "wedding_admin_session";

function generateTicketCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MM-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function adminSessionToken() {
  return createHmac("sha256", ENV.cookieSecret || ENV.adminPassword)
    .update("michelle-marcing-admin-session")
    .digest("hex");
}

function isAdminSessionValid(req: { headers: { cookie?: string } }) {
  const token = parseCookie(req.headers.cookie || "")[ADMIN_SESSION_COOKIE];
  if (!token) return false;

  const expected = Buffer.from(adminSessionToken());
  const received = Buffer.from(token);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

function setAdminSession(res: any, req: any) {
  res.cookie(ADMIN_SESSION_COOKIE, adminSessionToken(), {
    ...getSessionCookieOptions(req),
  });
}

function clearAdminSession(res: any, req: any) {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    ...getSessionCookieOptions(req),
    maxAge: 0,
  });
  res.clearCookie(LEGACY_ADMIN_SESSION_COOKIE, {
    ...getSessionCookieOptions(req),
    maxAge: 0,
  });
}

const adminSessionProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!isAdminSessionValid(ctx.req)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Mot de passe administrateur requis",
    });
  }

  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  wedding: router({
    getMessages: publicProcedure.query(async () => db.getApprovedMessages()),

    getTicket: publicProcedure
      .input(z.object({ code: z.string().min(3) }))
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

    submitRsvp: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2, "Veuillez renseigner votre nom complet"),
          side: z.enum(["bride", "groom"], {
            message: "Veuillez indiquer si vous êtes invité(e) de la mariée ou du marié",
          }),
          attendance: z.enum(["yes", "no"]),
          events: z.array(z.enum(["civil", "church", "party"])).optional(),
          guestsCount: z.number().int().min(1).max(10).default(1),
          message: z.string().trim().max(1000).optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input }) => {
        const ticketCode = generateTicketCode();
        const eventsString =
          input.attendance === "yes" && input.events && input.events.length > 0
            ? input.events.join(",")
            : null;

        const saved = await db.createRsvp({
          name: input.name,
          side: input.side,
          attendance: input.attendance,
          events: eventsString,
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
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string().min(1, "Veuillez entrer le mot de passe") }))
      .mutation(({ input, ctx }) => {
        const received = Buffer.from(input.password);
        const expected = Buffer.from(ENV.adminPassword);
        const isValid = received.length === expected.length && timingSafeEqual(received, expected);

        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Mot de passe incorrect",
          });
        }

        setAdminSession(ctx.res, ctx.req);
        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      clearAdminSession(ctx.res, ctx.req);
      return { success: true } as const;
    }),

    me: publicProcedure.query(({ ctx }) => ({ authenticated: isAdminSessionValid(ctx.req) })),

    listRsvps: adminSessionProcedure.query(async () => db.getAllRsvps()),
    stats: adminSessionProcedure.query(async () => db.getPublicWeddingStats()),
    deleteRsvp: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteRsvp(input.id);
        return { success: true } as const;
      }),
    deleteGuestbookMessage: adminSessionProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await db.deleteGuestbookMessage(input.id);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
