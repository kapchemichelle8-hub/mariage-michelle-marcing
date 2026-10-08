import { describe, expect, it } from "vitest";
import { rsvpsToCsv } from "./routers";
import { makeCaller, TEST_PASSWORD } from "./testUtils";

async function loggedIn() {
  const { caller, store } = makeCaller({ ip: `ip-${Math.random()}` });
  const { token } = await caller.admin.login({ password: TEST_PASSWORD });
  const admin = makeCaller({ store, adminToken: token }).caller.admin;
  return { caller, admin, store };
}

describe("Espace mariés", () => {
  it("toutes les procédures privées exigent le mot de passe", async () => {
    const { caller } = makeCaller();
    await expect(caller.admin.stats()).rejects.toThrow(/Mot de passe requis/);
    await expect(caller.admin.listRsvps()).rejects.toThrow(/Mot de passe requis/);
    await expect(caller.admin.exportCsv()).rejects.toThrow(/Mot de passe requis/);
    await expect(caller.admin.deleteRsvp({ id: 1, confirm: true })).rejects.toThrow(/Mot de passe requis/);
  });

  it("refuse un faux jeton et un mauvais mot de passe", async () => {
    const { caller } = makeCaller({ adminToken: "faux.jeton.signe" });
    await expect(caller.admin.stats()).rejects.toThrow(/Mot de passe requis/);
    await expect(caller.admin.login({ password: "mauvais" })).rejects.toThrow(/incorrect/);
  });

  it("bloque après trop de tentatives", async () => {
    const { caller } = makeCaller({ ip: "10.0.0.99" });
    for (let i = 0; i < 8; i++) {
      await expect(caller.admin.login({ password: "x" })).rejects.toThrow(/incorrect/);
    }
    await expect(caller.admin.login({ password: TEST_PASSWORD })).rejects.toThrow(/Trop de tentatives/);
  });

  it("calcule les statistiques une fois connecté", async () => {
    const { caller, admin } = await loggedIn();
    await caller.rsvp.submit({ name: "Famille A", side: "mariee", attendance: "yes", guestsCount: 2, message: "Bravo" });
    await caller.rsvp.submit({ name: "Famille B", side: "marie", attendance: "yes", guestsCount: 3 });
    await caller.rsvp.submit({ name: "Famille C", side: "marie", attendance: "no", guestsCount: 0, message: "Pensées" });
    expect(await admin.stats()).toEqual({
      responses: 3,
      present: 2,
      absent: 1,
      totalGuests: 5,
      guestsMariee: 2,
      guestsMarie: 3,
      messages: 2,
    });
  });

  it("supprime UNE ligne par identifiant exact, seulement avec confirmation", async () => {
    const { caller, admin, store } = await loggedIn();
    await caller.rsvp.submit({ name: "Garder", side: "mariee", attendance: "yes", guestsCount: 1, message: "Mot doux" });
    await caller.rsvp.submit({ name: "TEST — à supprimer", side: "marie", attendance: "yes", guestsCount: 1 });
    const testRow = store.rows.find((r) => r.name.startsWith("TEST"))!;

    // @ts-expect-error confirmation obligatoire
    await expect(admin.deleteRsvp({ id: testRow.id })).rejects.toThrow();
    await expect(admin.deleteRsvp({ id: 999, confirm: true })).rejects.toThrow(/introuvable/);

    await admin.deleteRsvp({ id: testRow.id, confirm: true });
    expect(store.rows.map((r) => r.name)).toEqual(["Garder"]);
    expect(store.rows[0].message).toBe("Mot doux");
  });

  it("exporte un CSV qui échappe les guillemets", () => {
    const csv = rsvpsToCsv([
      {
        id: 1,
        name: 'Jean "le grand"',
        email: null,
        attendance: "yes",
        side: "marie",
        guestsCount: 2,
        message: "Ligne 1, ligne 2",
        ticketCode: "MM-ABCDEF",
        createdAt: new Date("2026-10-01T10:00:00Z"),
        updatedAt: new Date("2026-10-01T10:00:00Z"),
      },
    ]);
    expect(csv).toContain('"Jean ""le grand"""');
    expect(csv).toContain('"Ligne 1, ligne 2"');
  });
});
