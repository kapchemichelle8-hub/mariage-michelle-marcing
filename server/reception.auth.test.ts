import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reception.roster", () => {
  it("refuse la liste des invités sans session administrateur", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.reception.roster()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
