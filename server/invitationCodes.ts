const INVITATION_CODE_PATTERN = /^MM\d{3}$/;
const LOOKUP_WINDOW_MS = 10 * 60 * 1000;
const LOOKUP_LIMIT = 12;
const ADMIN_LOGIN_WINDOW_MS_VALUE = 15 * 60 * 1000;
const ADMIN_LOGIN_LIMIT = 5;

type AttemptStore = Map<string, number[]>;
const invitationAttemptsByClient: AttemptStore = new Map();
const adminLoginAttemptsByClient: AttemptStore = new Map();
const receptionLoginAttemptsByClient: AttemptStore = new Map();

export function normalizeInvitationCode(value: string) {
  return value.trim().toUpperCase();
}

export function isInvitationCodeFormatValid(value: string) {
  return INVITATION_CODE_PATTERN.test(normalizeInvitationCode(value));
}

function allowAttempt(
  store: AttemptStore,
  clientKey: string,
  now: number,
  windowMs: number,
  limit: number
) {
  const cutoff = now - windowMs;
  const recent = (store.get(clientKey) ?? []).filter(
    timestamp => timestamp > cutoff
  );
  if (recent.length >= limit) {
    store.set(clientKey, recent);
    return false;
  }
  recent.push(now);
  store.set(clientKey, recent);

  if (store.size > 5000) {
    for (const [key, timestamps] of Array.from(store.entries())) {
      if (timestamps.every((timestamp: number) => timestamp <= cutoff)) {
        store.delete(key);
      }
      if (store.size <= 4000) break;
    }
  }
  return true;
}

/**
 * Process-local throttle for public invitation-code lookups/submissions and
 * public ticket reads. Client identifiers are held only in memory.
 */
export function allowInvitationAttempt(clientKey: string, now = Date.now()) {
  return allowAttempt(
    invitationAttemptsByClient,
    clientKey,
    now,
    LOOKUP_WINDOW_MS,
    LOOKUP_LIMIT
  );
}

/** Process-local throttle for administrator password attempts. */
export function allowAdminLoginAttempt(clientKey: string, now = Date.now()) {
  return allowAttempt(
    adminLoginAttemptsByClient,
    clientKey,
    now,
    ADMIN_LOGIN_WINDOW_MS_VALUE,
    ADMIN_LOGIN_LIMIT
  );
}

/** Process-local throttle for reception-team password attempts. */
export function allowReceptionLoginAttempt(clientKey: string, now = Date.now()) {
  return allowAttempt(
    receptionLoginAttemptsByClient,
    clientKey,
    now,
    ADMIN_LOGIN_WINDOW_MS_VALUE,
    ADMIN_LOGIN_LIMIT
  );
}

export function resetInvitationAttemptLimitsForTests() {
  invitationAttemptsByClient.clear();
}

export function resetAdminLoginAttemptLimitsForTests() {
  adminLoginAttemptsByClient.clear();
}

export function resetReceptionLoginAttemptLimitsForTests() {
  receptionLoginAttemptsByClient.clear();
}

export const INVITATION_LOOKUP_LIMIT = LOOKUP_LIMIT;
export const INVITATION_LOOKUP_WINDOW_MS = LOOKUP_WINDOW_MS;
export const ADMIN_LOGIN_ATTEMPT_LIMIT = ADMIN_LOGIN_LIMIT;
export const ADMIN_LOGIN_WINDOW_MS = ADMIN_LOGIN_WINDOW_MS_VALUE;
