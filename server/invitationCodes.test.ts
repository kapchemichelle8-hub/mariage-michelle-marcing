import { beforeEach, describe, expect, it } from "vitest";
import {
  ADMIN_LOGIN_ATTEMPT_LIMIT,
  ADMIN_LOGIN_WINDOW_MS,
  allowAdminLoginAttempt,
  allowInvitationAttempt,
  allowReceptionLoginAttempt,
  isInvitationCodeFormatValid,
  INVITATION_LOOKUP_LIMIT,
  INVITATION_LOOKUP_WINDOW_MS,
  normalizeInvitationCode,
  resetAdminLoginAttemptLimitsForTests,
  resetInvitationAttemptLimitsForTests,
  resetReceptionLoginAttemptLimitsForTests,
} from "./invitationCodes";

describe("invitation code format", () => {
  it("normalizes surrounding whitespace and letter case", () => {
    expect(normalizeInvitationCode(" mm001 ")).toBe("MM001");
    expect(isInvitationCodeFormatValid(" mm001 ")).toBe(true);
  });

  it("accepts only the sequential wedding-code shape", () => {
    expect(isInvitationCodeFormatValid("MM000")).toBe(true);
    expect(isInvitationCodeFormatValid("MM218")).toBe(true);
    expect(isInvitationCodeFormatValid("MM1000")).toBe(false);
    expect(isInvitationCodeFormatValid("XX001")).toBe(false);
    expect(isInvitationCodeFormatValid("MM-001")).toBe(false);
  });
});

describe("invitation attempt limit", () => {
  beforeEach(() => resetInvitationAttemptLimitsForTests());

  it("limits attempts per client over a rolling window and opens after expiry", () => {
    const start = 1_800_000_000_000;
    for (let i = 0; i < INVITATION_LOOKUP_LIMIT; i += 1) {
      expect(allowInvitationAttempt("test-client", start + i)).toBe(true);
    }
    expect(
      allowInvitationAttempt("test-client", start + INVITATION_LOOKUP_LIMIT)
    ).toBe(false);
    expect(
      allowInvitationAttempt(
        "test-client",
        start + INVITATION_LOOKUP_WINDOW_MS + 1
      )
    ).toBe(true);
  });

  it("keeps separate client limits isolated", () => {
    const start = 1_800_000_000_000;
    for (let i = 0; i < INVITATION_LOOKUP_LIMIT; i += 1) {
      allowInvitationAttempt("client-a", start + i);
    }
    expect(allowInvitationAttempt("client-b", start + 20)).toBe(true);
  });
});

describe("administrator login attempt limit", () => {
  beforeEach(() => resetAdminLoginAttemptLimitsForTests());

  it("blocks the sixth password attempt for 15 minutes per client", () => {
    const start = 1_800_000_000_000;
    for (let i = 0; i < ADMIN_LOGIN_ATTEMPT_LIMIT; i += 1) {
      expect(allowAdminLoginAttempt("admin-test-client", start + i)).toBe(true);
    }
    expect(
      allowAdminLoginAttempt(
        "admin-test-client",
        start + ADMIN_LOGIN_ATTEMPT_LIMIT
      )
    ).toBe(false);
    expect(
      allowAdminLoginAttempt(
        "admin-test-client",
        start + ADMIN_LOGIN_WINDOW_MS + 1
      )
    ).toBe(true);
  });

  it("uses a separate bucket from RSVP and ticket attempts", () => {
    const start = 1_800_000_000_000;
    for (let i = 0; i < ADMIN_LOGIN_ATTEMPT_LIMIT; i += 1) {
      allowAdminLoginAttempt("shared-client", start + i);
    }
    expect(allowInvitationAttempt("shared-client", start + 20)).toBe(true);
  });
});

describe("reception login attempt limit", () => {
  beforeEach(() => {
    resetAdminLoginAttemptLimitsForTests();
    resetReceptionLoginAttemptLimitsForTests();
  });

  it("keeps the reception password counter separate from the married-area counter", () => {
    const start = 1_800_000_000_000;
    for (let i = 0; i < ADMIN_LOGIN_ATTEMPT_LIMIT; i += 1) {
      expect(allowReceptionLoginAttempt("shared-client", start + i)).toBe(true);
    }
    expect(
      allowReceptionLoginAttempt(
        "shared-client",
        start + ADMIN_LOGIN_ATTEMPT_LIMIT
      )
    ).toBe(false);
    expect(allowAdminLoginAttempt("shared-client", start + 20)).toBe(true);
  });
});
