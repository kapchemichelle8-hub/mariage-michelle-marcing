import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const folders = ["server", "scripts", "client/src", "drizzle", "shared"];

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return /\.(ts|tsx|sql)$/.test(entry.name) ? [full] : [];
  });
}

describe("Protection des données", () => {
  const files = folders.flatMap((f) => sourceFiles(path.join(root, f)));

  it("aucune suppression globale de la table rsvps dans le code ni les tests", () => {
    const forbidden = [
      /DELETE\s+FROM\s+`?rsvps`?\s*(;|$|["'`])/im,
      /TRUNCATE\s+(TABLE\s+)?`?rsvps/i,
      /DROP\s+TABLE\s+(IF\s+EXISTS\s+)?`?rsvps/i,
      /\.delete\(rsvps\)\s*;/,
    ];
    for (const file of files) {
      if (file.endsWith("dataSafety.test.ts")) continue;
      const content = fs.readFileSync(file, "utf-8");
      for (const pattern of forbidden) {
        expect(pattern.test(content), `${path.relative(root, file)} : ${pattern}`).toBe(false);
      }
    }
  });

  it("la seule suppression filtre sur un identifiant exact", () => {
    const db = fs.readFileSync(path.join(root, "server/db.ts"), "utf-8");
    const deletes = db.match(/\.delete\(rsvps\)[^;]*/g) ?? [];
    expect(deletes).toHaveLength(1);
    expect(deletes[0]).toContain(".where(eq(rsvps.id, id))");
  });
});
