import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import * as db from "./db";
import {
  allowAdminLoginAttempt,
  allowInvitationAttempt,
  allowReceptionLoginAttempt,
  isInvitationCodeFormatValid,
  normalizeInvitationCode,
} from "./invitationCodes";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const ADMIN_SESSION_COOKIE = "wedding_admin_session_v2";
const LEGACY_ADMIN_SESSION_COOKIE = "wedding_admin_session";
const RECEPTION_SESSION_COOKIE = "wedding_reception_session_v1";

function sessionToken(scope: "admin" | "reception") {
  return createHmac("sha256", ENV.cookieSecret)
    .update(`michelle-marcing-${scope}-session`)
    .digest("hex");
}

function isSessionValid(
  req: { headers: { cookie?: string } },
  cookieName: string,
  scope: "admin" | "reception"
) {
  if (!ENV.cookieSecret) return false;
  const token = parseCookie(req.headers.cookie || "")[cookieName];
  if (!token) return false;

  const expected = Buffer.from(sessionToken(scope));
  const received = Buffer.from(token);
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}

function isAdminSessionValid(req: { headers: { cookie?: string } }) {
  return isSessionValid(req, ADMIN_SESSION_COOKIE, "admin");
}

function isReceptionSessionValid(req: { headers: { cookie?: string } }) {
  return isSessionValid(req, RECEPTION_SESSION_COOKIE, "reception");
}

function setAdminSession(res: any, req: any) {
  res.cookie(ADMIN_SESSION_COOKIE, sessionToken("admin"), {
    ...getSessionCookieOptions(req),
  });
}

function setReceptionSession(res: any, req: any) {
  res.cookie(RECEPTION_SESSION_COOKIE, sessionToken("reception"), {
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

function clearReceptionSession(res: any, req: any) {
  res.clearCookie(RECEPTION_SESSION_COOKIE, {
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

const receptionSessionProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!isReceptionSessionValid(ctx.req)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Accès équipe d’accueil requis",
    });
  }
  return next({ ctx });
});

const invitationCodeSchema = z
  .string()
  .transform(normalizeInvitationCode)
  .refine(isInvitationCodeFormatValid, "Code invité invalide.");

function enforceInvitationAttemptLimit(req: {
  ip?: string;
  socket?: { remoteAddress?: string };
}) {
  const clientKey = req.ip || req.socket?.remoteAddress || "unknown-client";
  if (!allowInvitationAttempt(clientKey)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Trop de tentatives. Réessayez dans quelques minutes.",
    });
  }
}

function enforceAdminLoginAttemptLimit(req: {
  ip?: string;
  socket?: { remoteAddress?: string };
}) {
  const clientKey = req.ip || req.socket?.remoteAddress || "unknown-client";
  if (!allowAdminLoginAttempt(clientKey)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
    });
  }
}

function enforceReceptionLoginAttemptLimit(req: {
  ip?: string;
  socket?: { remoteAddress?: string };
}) {
  const clientKey = req.ip || req.socket?.remoteAddress || "unknown-client";
  if (!allowReceptionLoginAttempt(clientKey)) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
    });
  }
}

const rsvpInput = z
  .object({
    code: invitationCodeSchema,
    name: z
      .string()
      .trim()
      .min(2, "Veuillez saisir le nom à afficher sur votre billet")
      .max(160),
    attendance: z.enum(["yes", "no"]),
    events: z.array(z.enum(["civil", "church", "party"])).optional(),
    guestsCount: z.number().int().min(1).max(2).default(1),
    message: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .superRefine((input, ctx) => {
    if (
      input.attendance === "yes" &&
      (!input.events || input.events.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["events"],
        message: "Veuillez sélectionner au moins un moment de la journée.",
      });
    }
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

    lookupInvitationCode: publicProcedure
      .input(z.object({ code: invitationCodeSchema }))
      .mutation(async ({ input, ctx }) => {
        enforceInvitationAttemptLimit(ctx.req);
        const invite = await db.getInvitationByCode(input.code);
        if (!invite) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Code invité non reconnu. Vérifiez le code reçu.",
          });
        }
        // Ne pas renvoyer le nom ni une liste de personnes à l’appelant public.
        return {
          recognized: true as const,
          code: invite.code,
          side: invite.side,
          tableNumber: invite.tableNumber,
          tableVirtue: invite.tableVirtue,
        };
      }),

    getTicket: publicProcedure
      .input(z.object({ code: z.string().trim().min(3).max(32) }))
      .query(async ({ input, ctx }) => {
        enforceInvitationAttemptLimit(ctx.req);
        const ticket = await db.getRsvpByTicketCode(input.code);
        if (
          !ticket ||
          ticket.invitationId == null ||
          ticket.attendance !== "yes"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Billet introuvable ou lien historique désactivé.",
          });
        }

        const invitation = await db.getInvitationById(ticket.invitationId);
        if (!invitation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Billet introuvable ou lien historique désactivé.",
          });
        }
        const assignment =
          invitation.tableNumber && invitation.tableVirtue
            ? {
                tableNumber: invitation.tableNumber,
                tableVirtue: invitation.tableVirtue,
              }
            : null;

        return {
          ticketCode: ticket.ticketCode,
          invitationCode: invitation.code,
          name: ticket.name,
          guestsCount: ticket.guestsCount,
          attendance: ticket.attendance,
          side: invitation.side,
          events: ticket.events,
          seatAssignment: assignment,
        };
      }),

    submitRsvp: publicProcedure.input(rsvpInput).mutation(async ({ input, ctx }) => {
      enforceInvitationAttemptLimit(ctx.req);
      const invite = await db.getInvitationByCode(input.code);
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Code invité non reconnu. Vérifiez le code reçu.",
        });
      }

      const eventsString =
        input.attendance === "yes" && input.events
          ? input.events
              .filter((event, index, values) => values.indexOf(event) === index)
              .join(",")
          : null;
      const displayName = input.name.trim();
      const savedRsvp = await db.upsertInvitationRsvp({
        invitationId: invite.id,
        name: displayName,
        side: invite.side,
        attendance: input.attendance,
        events: eventsString,
        guestsCount: input.attendance === "yes" ? input.guestsCount : 0,
        ticketCode: randomBytes(24).toString("base64url"),
      });
      if (!savedRsvp) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "La réponse n’a pas pu être relue après son enregistrement.",
        });
      }

      const message = input.message?.trim();
      if (message) {
        await db.addGuestbookMessage({
          invitationId: invite.id,
          authorName: displayName,
          message,
          messageHash: createHash("sha256")
            .update(message.normalize("NFKC"))
            .digest("hex"),
        });
      }

      return {
        success: true,
        ticketCode: savedRsvp.ticketCode,
        attendance: input.attendance,
        message:
          input.attendance === "yes"
            ? "Votre réponse a été mise à jour. Voici votre billet d’invitation officiel."
            : "Votre réponse a été mise à jour. Merci de nous avoir prévenus.",
      };
    }),
  }),

  reception: router({
    login: publicProcedure
      .input(
        z.object({
          password: z.string().min(1, "Veuillez entrer le mot de passe"),
        })
      )
      .mutation(({ input, ctx }) => {
        enforceReceptionLoginAttemptLimit(ctx.req);
        const received = Buffer.from(input.password);
        const expected = Buffer.from(ENV.receptionPassword);
        const isValid =
          received.length === expected.length &&
          timingSafeEqual(received, expected);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Mot de passe incorrect",
          });
        }
        setReceptionSession(ctx.res, ctx.req);
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      clearReceptionSession(ctx.res, ctx.req);
      return { success: true } as const;
    }),
    me: publicProcedure.query(({ ctx }) => ({
      authenticated: isReceptionSessionValid(ctx.req),
    })),
    roster: receptionSessionProcedure.query(async () => {
      const entries = await db.getAdminRsvps();
      return entries.map(
        ({
          id,
          name,
          ticketCode,
          invitationCode,
          guestsCount,
          attendance,
          events,
          side,
          tableNumber,
          tableVirtue,
        }) => ({
          id,
          name,
          ticketCode,
          invitationCode,
          guestsCount,
          attendance,
          events,
          side,
          tableNumber: tableNumber ?? null,
          tableVirtue: tableVirtue ?? null,
        })
      );
    }),
  }),

  admin: router({
    login: publicProcedure
      .input(
        z.object({
          password: z.string().min(1, "Veuillez entrer le mot de passe"),
        })
      )
      .mutation(({ input, ctx }) => {
        enforceAdminLoginAttemptLimit(ctx.req);
        const received = Buffer.from(input.password);
        const expected = Buffer.from(ENV.adminPassword);
        const isValid =
          received.length === expected.length &&
          timingSafeEqual(received, expected);
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
    me: publicProcedure.query(({ ctx }) => ({
      authenticated: isAdminSessionValid(ctx.req),
    })),
    listRsvps: adminSessionProcedure.query(async () => db.getAdminRsvps()),
    stats: adminSessionProcedure.query(async () => db.getAdminWeddingStats()),
    listInvitations: adminSessionProcedure.query(async () =>
      db.getAllInvitations().then(rows =>
        rows.map(row => ({
          code: row.code,
          name: row.name,
          side: row.side,
          tableNumber: row.tableNumber,
          tableVirtue: row.tableVirtue,
          sourceSerial: row.sourceSerial,
        }))
      )
    ),
    listWeddingTables: adminSessionProcedure.query(async () =>
      db.getWeddingTables()
    ),
    assignInvitationTable: adminSessionProcedure
      .input(
        z.object({
          code: invitationCodeSchema,
          tableNumber: z.string().trim().min(1).max(12).nullable(),
        })
      )
      .mutation(async ({ input }) => {
        const invite = await db.getInvitationByCode(input.code);
        if (!invite) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invitation introuvable.",
          });
        }
        await db.assignInvitationTable(input.code, input.tableNumber);
        return { success: true } as const;
      }),
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
