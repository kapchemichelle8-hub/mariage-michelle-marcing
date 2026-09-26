import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(cookieHeader = ""): { ctx: TrpcContext; setCookies: string[] } {
  const setCookies: string[] = [];

  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
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
  it("blocks unauthenticated callers from reading private stats or guests list", async () => {
    const { ctx } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow("Mot de passe administrateur requis");
    await expect(caller.admin.listRsvps()).rejects.toThrow("Mot de passe administrateur requis");
  });

  it("authenticates with the correct shared password and drops a session cookie", async () => {
    const { ctx, setCookies } = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const loginResult = await caller.admin.login({ password: "mariage2026" });
    expect(loginResult.success).toBe(true);
    expect(setCookies.some((c) => c.startsWith("wedding_admin_session_v2="))).toBe(true);
  });

  it("does not accept the legacy session cookie", async () => {
    const { ctx } = createMockContext("wedding_admin_session=old-token");
    const caller = appRouter.createCaller(ctx);
    expect((await caller.admin.me()).authenticated).toBe(false);
    await expect(caller.admin.stats()).rejects.toThrow("Mot de passe administrateur requis");
  });
});
