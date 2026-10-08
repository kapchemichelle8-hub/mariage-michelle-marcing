import "dotenv/config";

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD || "mariage2026",
  // Manus fournit JWT_SECRET automatiquement ; SESSION_SECRET reste possible ailleurs.
  sessionSecret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "mariage-michelle-marcing-secret-key-2026",
  port: Number(process.env.PORT ?? 3000),
  isProduction: process.env.NODE_ENV === "production",
};
