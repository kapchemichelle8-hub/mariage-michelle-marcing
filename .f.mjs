import { chromium } from "playwright-core";
import fs from "node:fs";
const S = process.argv[2];
const BASE = "http://localhost:3100";
const ok = (c, m) => { console.log(`${c ? "✅" : "❌"} ${m}`); if (!c) process.exitCode = 1; };
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, acceptDownloads: true });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

// 1. Programme
await page.goto(BASE, { waitUntil: "networkidle" });
const prog = await page.locator('ol[aria-label="Programme de la journée"]').innerText();
ok(prog.includes("13 h 00") && prog.includes("15 h 00") && prog.includes("20 h 00"), "programme 13 h / 15 h / 20 h");
ok(!/Pause|Réjouissances|Vin d’honneur|Déplacement|eucharistique/i.test(await page.locator("body").innerText()), "aucune étape non demandée");
ok((prog.match(/Bandjoun/g) || []).length >= 3, "Bandjoun dans chaque lieu");
ok((await page.locator("#quand-ou").innerText()).includes("Centre climatique de Bandjoun"), "itinéraire présent");

// 2. Vidéo non chargée avant clic
ok((await page.locator("video").count()) === 0, "vidéo absente avant le clic");
await page.getByRole("button", { name: /Lire la vidéo/ }).click();
ok((await page.locator("video").count()) === 1, "vidéo chargée après le clic");

// 3. RSVP positif
await page.locator("#rsvp").scrollIntoViewIfNeeded();
await page.fill("#rsvp-name", "TEST Famille Présente");
await page.getByText("côté de la mariée", { exact: true }).click();
await page.getByText("Oui, avec joie").click();
await page.getByRole("button", { name: "Une personne de plus" }).click();
await page.fill("#rsvp-message", "TEST — message de bénédiction à supprimer après les tests");
await page.screenshot({ path: `${S}/shots/flow-rsvp-form.png` });
await page.getByRole("button", { name: /Envoyer ma réponse/ }).click();
await page.waitForURL(/\/billet\/MM-/);
const code = page.url().split("/billet/")[1];
ok(/^MM-[A-Z2-9]{6}$/.test(code), `redirection vers le billet ${code}`);
await page.getByText(code).waitFor();
const ticketText = await page.locator(".print-ticket").innerText();
ok(ticketText.includes("TEST Famille Présente") && ticketText.includes("2 personnes") && ticketText.includes("Bandjoun"), "billet : nom, 2 personnes, Bandjoun");
ok((await page.locator("section, #rsvp, header").count()) === 0, "page billet : uniquement le billet");
await page.waitForTimeout(400);
await page.screenshot({ path: `${S}/shots/flow-ticket.png`, fullPage: true });

let dl = page.waitForEvent("download");
await page.getByRole("button", { name: "PNG" }).click();
let d = await dl; await d.saveAs(`${S}/shots/billet.png`);
ok(d.suggestedFilename().endsWith(".png") && fs.statSync(`${S}/shots/billet.png`).size > 50000, `PNG téléchargé (${fs.statSync(`${S}/shots/billet.png`).size} octets)`);
dl = page.waitForEvent("download");
await page.getByRole("button", { name: "PDF" }).click();
d = await dl; await d.saveAs(`${S}/shots/billet.pdf`);
ok(fs.readFileSync(`${S}/shots/billet.pdf`).subarray(0, 4).toString() === "%PDF", "PDF téléchargé");

await page.emulateMedia({ media: "print" });
const printVisible = await page.evaluate(() =>
  [...document.querySelectorAll(".no-print")].every((el) => getComputedStyle(el).display === "none"));
ok(printVisible, "impression : boutons et textes masqués, billet seul");
await page.pdf({ path: `${S}/shots/impression.pdf`, format: "A5", printBackground: true }).catch(() => {});
await page.emulateMedia({ media: "screen" });
await page.getByRole("link", { name: /Retourner à l’invitation/ }).click();
await page.waitForURL(BASE + "/");
ok(true, "retour vers l’invitation");

// 4. RSVP négatif
await page.goto(BASE + "/#rsvp", { waitUntil: "networkidle" });
await page.fill("#rsvp-name", "TEST Invité Absent");
await page.getByText("côté du marié", { exact: true }).click();
await page.getByText("Je ne pourrai pas").click();
await page.fill("#rsvp-message", "TEST — nous prierons pour vous");
await page.getByRole("button", { name: /Envoyer ma réponse/ }).click();
await page.waitForURL(/\/merci/);
const merci = await page.locator("main").innerText();
ok(merci.includes("prière") && merci.includes("contribution"), "page d’absence humaine");
await page.screenshot({ path: `${S}/shots/flow-absence.png`, fullPage: true });
ok((await page.getByRole("link", { name: "Retourner à l’invitation" }).count()) === 1, "bouton retour présent");

// 5. Livre d'or : 2 messages de plus via l'API pour dépasser 3
for (const n of [1, 2]) {
  await page.request.post(`${BASE}/api/trpc/rsvp.submit`, { data: { json: { name: `TEST Livre ${n}`, side: "mariee", attendance: "yes", guestsCount: 1, message: `TEST — mot doux numéro ${n} pour vérifier « Voir plus »` } } });
}
await page.goto(BASE, { waitUntil: "networkidle" });
await page.locator("#livre-dor").scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
ok((await page.locator("#livre-dor li").count()) === 3, "livre d’or : 3 messages au chargement");
await page.getByRole("button", { name: "Voir plus" }).click();
await page.waitForTimeout(800);
ok((await page.locator("#livre-dor li").count()) === 4, "livre d’or : la suite après « Voir plus »");
ok((await page.getByRole("button", { name: "Voir plus" }).count()) === 0, "bouton masqué quand tout est affiché");
await page.locator("#livre-dor").screenshot({ path: `${S}/shots/flow-guestbook.png` });
const pub = await page.locator("body").innerText();
ok(!/Total convives|Réponses\s*\d|Présents\s*\d/.test(pub), "aucune statistique sur la page publique");

// 6. Espace mariés
await page.goto(BASE + "/espace-maries", { waitUntil: "networkidle" });
ok(await page.locator("#admin-password").isVisible(), "mot de passe demandé dès le premier accès");
await page.fill("#admin-password", "mauvais");
await page.getByRole("button", { name: "Entrer" }).click();
await page.getByText("Mot de passe incorrect.").waitFor();
ok(true, "mauvais mot de passe refusé");
await page.fill("#admin-password", "mariage2026");
await page.getByRole("button", { name: "Entrer" }).click();
await page.getByText("Les réponses de nos invités").waitFor();
await page.waitForTimeout(500);
const dash = await page.locator("main").innerText();
ok(/5\s*RÉPONSES/i.test(dash) && /4\s*PRÉSENTS/i.test(dash) && /5\s*TOTAL CONVIVES/i.test(dash) && /1\s*ABSENTS/i.test(dash), "statistiques correctes (5 réponses, 4 présents, 5 convives, 1 absent)");
await page.screenshot({ path: `${S}/shots/flow-admin.png`, fullPage: true });
await page.getByRole("button", { name: "Se déconnecter" }).click();
ok(await page.locator("#admin-password").isVisible(), "verrouillé après « Se déconnecter »");
await page.fill("#admin-password", "mariage2026");
await page.getByRole("button", { name: "Entrer" }).click();
await page.getByText("Les réponses de nos invités").waitFor();
await page.reload({ waitUntil: "networkidle" });
ok(await page.locator("#admin-password").isVisible(), "verrouillé après rechargement");
await page.fill("#admin-password", "mariage2026");
await page.getByRole("button", { name: "Entrer" }).click();
await page.getByText("Les réponses de nos invités").waitFor();
await page.evaluate(() => { history.pushState({}, "", "/"); dispatchEvent(new PopStateEvent("popstate")); });
await page.waitForTimeout(400);
await page.evaluate(() => { history.pushState({}, "", "/espace-maries"); dispatchEvent(new PopStateEvent("popstate")); });
await page.locator("#admin-password").waitFor();
ok(true, "verrouillé après avoir quitté l’espace privé");

console.log("TICKET", code);
console.log("ERREURS JS:", errors.length ? errors.join(" | ") : "aucune");
await browser.close();
