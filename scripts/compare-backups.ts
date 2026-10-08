/**
 * Compare deux exports : chaque ligne de l'export « avant » doit exister à l'identique
 * dans l'export « après » (nom, présence, côté, personnes, message, code billet).
 * Usage : pnpm tsx scripts/compare-backups.ts backups/avant.json backups/apres.json
 */
import fs from "node:fs";

type Row = Record<string, unknown> & { id: number };
const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error("Usage : compare-backups <avant.json> <après.json>");
  process.exit(2);
}
const load = (p: string) => JSON.parse(fs.readFileSync(p, "utf-8")) as Row[];
const before = load(beforePath);
const after = new Map(load(afterPath).map((r) => [r.id, r]));
const fields = ["name", "attendance", "side", "guestsCount", "message", "ticketCode"];

const problems: string[] = [];
for (const row of before) {
  const now = after.get(row.id);
  if (!now) {
    problems.push(`#${row.id} ${row.name} a disparu`);
    continue;
  }
  for (const f of fields) {
    if (JSON.stringify(row[f]) !== JSON.stringify(now[f])) {
      problems.push(`#${row.id} champ « ${f} » modifié`);
    }
  }
}
console.log(`Avant : ${before.length} lignes — Après : ${after.size} lignes`);
if (problems.length) {
  console.error("DIFFÉRENCES :\n" + problems.join("\n"));
  process.exit(1);
}
console.log("Toutes les réponses et tous les mots doux d'avant sont intacts.");
