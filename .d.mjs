import { chromium } from "playwright-core";
const ok = (c, m) => { console.log(`${c ? "✅" : "❌"} ${m}`); if (!c) process.exitCode = 1; };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true })).newPage();
await page.goto("http://localhost:3100/espace-maries");
await page.fill("#admin-password", "mariage2026");
await page.getByRole("button", { name: "Entrer" }).click();
await page.getByText("Les réponses de nos invités").waitFor();
const dl = page.waitForEvent("download");
await page.getByRole("button", { name: "Exporter en CSV" }).click();
const csv = await (await dl).path();
const text = (await import("node:fs")).readFileSync(csv, "utf-8");
ok(text.split("\r\n").length === 5 && text.includes("TEST Famille Présente"), "export CSV (4 lignes + en-tête)");
// Annuler ne supprime rien
await page.getByRole("button", { name: "Supprimer" }).first().click();
await page.getByRole("dialog").waitFor();
await page.getByRole("button", { name: "Annuler" }).click();
ok((await page.getByRole("button", { name: "Supprimer" }).count()) === 4, "annuler : rien n’est supprimé");
// Suppression des lignes TEST, une à une
for (let i = 0; i < 4; i++) {
  const item = page.locator("li", { hasText: "TEST" }).first();
  const name = (await item.locator("p").first().innerText()).split("\n")[0];
  ok(name.startsWith("TEST"), `ligne de test ciblée : ${name.trim()}`);
  await item.getByRole("button", { name: "Supprimer" }).click();
  await page.getByRole("button", { name: "Oui, supprimer cette réponse" }).click();
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.waitForTimeout(300);
}
ok((await page.getByText("Aucune réponse pour l’instant.").count()) === 1, "toutes les lignes de test supprimées");
await browser.close();
