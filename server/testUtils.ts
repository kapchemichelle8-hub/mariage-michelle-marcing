import { MemoryRsvpStore } from "./db";
import { appRouter } from "./routers";
import type { Context } from "./trpc";

export const TEST_PASSWORD = "mot-de-passe-de-test";
export const TEST_SECRET = "secret-de-test-suffisamment-long-0123456789";

export function makeCaller(overrides: Partial<Context> = {}) {
  const store = (overrides.store as MemoryRsvpStore | undefined) ?? new MemoryRsvpStore();
  const caller = appRouter.createCaller({
    store,
    ip: "127.0.0.1",
    adminPassword: TEST_PASSWORD,
    sessionSecret: TEST_SECRET,
    ...overrides,
  });
  return { caller, store };
}
