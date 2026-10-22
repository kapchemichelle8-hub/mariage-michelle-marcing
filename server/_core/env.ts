const adminPassword = process.env.ADMIN_PASSWORD ?? "";
const receptionPassword = process.env.RECEPTION_PASSWORD ?? "";
// MANUS_JWT_SECRET est injectée au runtime par WebDev et gérée par la plateforme.
const cookieSecret = process.env.MANUS_JWT_SECRET ?? "";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret,
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  adminPassword,
  receptionPassword,
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

/** Fail closed in production instead of silently using a predictable default. */
export function assertRequiredSecrets() {
  if (!ENV.adminPassword.trim()) {
    throw new Error("Required secret ADMIN_PASSWORD is not configured.");
  }
  if (!ENV.receptionPassword.trim()) {
    throw new Error("Required secret RECEPTION_PASSWORD is not configured.");
  }
  if (!ENV.cookieSecret) {
    throw new Error("A platform session-signing secret is required.");
  }
}
