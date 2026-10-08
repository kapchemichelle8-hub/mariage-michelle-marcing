/**
 * Exporte la table rsvps dans backups/ (JSON + CSV horodatés), en lecture seule,
 * puis affiche le nombre de lignes, les noms, les statuts et les messages.
 * Usage : pnpm backup
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { env } from "../server/env";
import { rsvpsToCsv } from "../server/routers";
import type { RsvpRow } from "../drizzle/schema";

const connection = await mysql.createConnection({ uri: env.databaseUrl, timezone: "Z" });
const [tables] = await connection.query("SHOW TABLES LIKE 'rsvps'");
if ((tables as unknown[]).length === 0) {
  console.log("La table rsvps n'existe pas encore : rien à sauvegarder.");
  await connection.end();
  process.exit(0);
}
const [result] = await connection.query("SELECT * FROM rsvps ORDER BY id ASC");
await connection.end();
const rows = result as RsvpRow[];

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dir = path.resolve("backups");
fs.mkdirSync(dir, { recursive: true });
const jsonPath = path.join(dir, `rsvps-${stamp}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2), "utf-8");
fs.writeFileSync(path.join(dir, `rsvps-${stamp}.csv`), rsvpsToCsv(rows), "utf-8");

// Relecture du fichier pour vérifier que la sauvegarde est complète.
const reread = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as unknown[];
if (reread.length !== rows.length) {
  console.error("ÉCHEC : la sauvegarde relue ne contient pas toutes les lignes. Arrêtez toute modification.");
  process.exit(1);
}

console.log(`Sauvegarde : ${jsonPath}`);
console.log(`Nombre de lignes : ${rows.length}`);
for (const r of rows) {
  const statut = r.attendance === "yes" ? `présent (${r.guestsCount})` : "absent";
  console.log(`#${r.id} ${r.name} — ${statut} — ${r.message ? `« ${r.message} »` : "(sans message)"}`);
}
