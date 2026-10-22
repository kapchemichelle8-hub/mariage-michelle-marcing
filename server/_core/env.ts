const adminPassword = process.env.ADMIN_PASSWORD ?? "";
const cookieSecret = process.env.JWT_SECRET ?? "";

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret,
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  adminPassword,
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

/** Fail closed in production instead of silently using a predictable default. */
export function assertRequiredSecrets() {
  if (!ENV.adminPassword.trim()) {
    throw new Error("Required secret ADMIN_PASSWORD is not configured.");
  }
  if (ENV.cookieSecret.length < 32) {
    throw new Error("Required secret JWT_SECRET must contain at least 32 characters.");
  }
}
