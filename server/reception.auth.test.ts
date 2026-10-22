import { beforeEach, describe, expect, it } from "vitest";
import { ENV } from "./_core/env";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { resetReceptionLoginAttemptLimitsForTests } from "./invitationCodes";

function createMockContext(cookieHeader = ""): {
  ctx: TrpcContext;
  setCookies: string[];
} {
  const setCookies: string[] = [];
  return {
    ctx: {
      user: null,
      req: {
        protocol: "https",
        ip: "reception-test-client",
        headers: { cookie: cookieHeader },
      } as TrpcContext["req"],
      res: {
        cookie: (name: string, value: string) => setCookies.push(`${name}=${value}`),
        clearCookie: (name: string) => setCookies.push(`${name}=deleted`),
      } as any,
    },
    setCookies,
  };
}

describe("reception access", () => {
  beforeEach(() => {
    ENV.adminPassword = "unit-test-married-password";
    ENV.receptionPassword = "unit-test-reception-password";
    ENV.cookieSecret = "unit-test-signing-key-that-is-at-least-32-characters";
    resetReceptionLoginAttemptLimitsForTests();
  });

  it("refuses the roster without a reception session", async () => {
    const caller = appRouter.createCaller(createMockContext().ctx);
    await expect(caller.reception.roster()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  it("uses a separate reception password and cookie that cannot enter the married area", async () => {
    const receptionLogin = createMockContext();
    const receptionCaller = appRouter.createCaller(receptionLogin.ctx);

    await expect(
      receptionCaller.reception.login({ password: ENV.adminPassword })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });

    await expect(
      receptionCaller.reception.login({ password: ENV.receptionPassword })
    ).resolves.toEqual({ success: true });
    const cookieHeader = receptionLogin.setCookies[0];
    expect(cookieHeader).toMatch(/^wedding_reception_session_v1=/);

    const cookieCaller = appRouter.createCaller(createMockContext(cookieHeader).ctx);
    expect(await cookieCaller.reception.me()).toEqual({ authenticated: true });
    expect(await cookieCaller.admin.me()).toEqual({ authenticated: false });
  });
});
