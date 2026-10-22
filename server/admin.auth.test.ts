import { beforeEach, describe, expect, it } from "vitest";
import { assertRequiredSecrets, ENV } from "./_core/env";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  ADMIN_LOGIN_ATTEMPT_LIMIT,
  resetAdminLoginAttemptLimitsForTests,
} from "./invitationCodes";

function createMockContext(cookieHeader = ""): {
  ctx: TrpcContext;
  setCookies: string[];
} {
  const setCookies: string[] = [];
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      ip: "admin-test-client",
      headers: { cookie: cookieHeader },
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, val: string) => {
        setCookies.push(`${name}=${val}`);
      },
      clearCookie: (name: string) => {
        setCookies.push(`${name}=deleted`);
      },
    } as any,
  };
  return { ctx, setCookies };
}

describe("admin security & password login", () => {
  beforeEach(() => {
    ENV.adminPassword = "unit-test-admin-password";
    ENV.cookieSecret = "unit-test-signing-key-that-is-at-least-32-characters";
    resetAdminLoginAttemptLimitsForTests();
  });

  it("requires an admin password and a sufficiently long session-signing secret", () => {
    ENV.adminPassword = "";
    expect(assertRequiredSecrets).toThrow(/ADMIN_PASSWORD/);
    ENV.adminPassword = "unit-test-admin-password";
    ENV.cookieSecret = "short";
    expect(assertRequiredSecrets).toThrow(/JWT_SECRET/);
    ENV.cookieSecret = "unit-test-signing-key-that-is-at-least-32-characters";
    expect(assertRequiredSecrets).not.toThrow();
  });

  it("blocks unauthenticated callers from reading private stats or guests list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow(
      "Mot de passe administrateur requis"
    );
    await expect(caller.admin.listRsvps()).rejects.toThrow(
      "Mot de passe administrateur requis"
    );
  });

  it("authenticates with the configured shared password and sets a session cookie", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const loginResult = await caller.admin.login({ password: ENV.adminPassword });
    expect(loginResult.success).toBe(true);
    expect(setCookies.some(cookie => cookie.startsWith("wedding_admin_session_v2="))).toBe(true);
  });

  it("blocks repeated password attempts after five requests in the rolling window", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    for (let attempt = 0; attempt < ADMIN_LOGIN_ATTEMPT_LIMIT; attempt += 1) {
      await expect(caller.admin.login({ password: "invalid-password" })).rejects.toMatchObject({
        code: "UNAUTHORIZED",
      });
    }
    await expect(
      caller.admin.login({ password: ENV.adminPassword })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("does not accept the legacy session cookie", async () => {
    const { ctx } = createMockContext("wedding_admin_session=old-token");
    const caller = appRouter.createCaller(ctx);
    expect((await caller.admin.me()).authenticated).toBe(false);
    await expect(caller.admin.stats()).rejects.toThrow(
      "Mot de passe administrateur requis"
    );
  });
});
