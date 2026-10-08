import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { verifyAdminToken } from "./adminAuth";
import type { RsvpStore } from "./db";

export type Context = {
  store: RsvpStore;
  ip: string;
  adminToken?: string;
  adminPassword: string;
  sessionSecret: string;
};

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

/** Toute procédure de l'Espace Mariés passe par ce garde. */
export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  const ok = await verifyAdminToken(ctx.adminToken, ctx.sessionSecret);
  if (!ok) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Mot de passe requis." });
  }
  return next();
});
