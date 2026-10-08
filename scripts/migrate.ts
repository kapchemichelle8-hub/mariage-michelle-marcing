import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import { env } from "../server/env";

// Applique uniquement les migrations versionnées de drizzle/ (aucune remise à zéro).
const connection = await mysql.createConnection({ uri: env.databaseUrl });
await migrate(drizzle(connection), { migrationsFolder: "drizzle" });
await connection.end();
console.log("Migrations appliquées.");
