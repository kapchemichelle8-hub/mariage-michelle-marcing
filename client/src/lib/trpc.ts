import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../../server/routers";

export const trpc = createTRPCReact<AppRouter>();

/**
 * Le jeton de l'Espace Mariés vit uniquement en mémoire :
 * il disparaît à la déconnexion, en quittant la page et au rechargement de l'onglet.
 */
let adminToken: string | null = null;
export const setAdminToken = (token: string | null) => {
  adminToken = token;
};

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers: () => (adminToken ? { "x-admin-token": adminToken } : {}),
    }),
  ],
});
