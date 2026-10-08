/**
 * Test sur une vraie base MySQL, lancé seulement si RSVP_INTEGRATION_DB est défini.
 * Il insère UNE ligne clairement marquée « TEST » puis supprime cette ligne par son id exact.
 * Aucun nettoyage global.
 */
import { describe, expect, it } from "vitest";
import { createMysqlStore } from "./db";

const url = process.env.RSVP_INTEGRATION_DB;

describe.skipIf(!url)("MySQL (intégration)", () => {
  it("insère puis supprime uniquement la ligne de test", async () => {
    const store = createMysqlStore(url!);
    const before = await store.listAll();
    const row = await store.insert({
      name: `TEST automatique — à supprimer ${Date.now()}`,
      side: "mariee",
      attendance: "yes",
      guestsCount: 1,
      message: null,
      ticketCode: `MM-T${Math.floor(Math.random() * 1e5)}`.slice(0, 9),
    });
    expect((await store.listAll()).length).toBe(before.length + 1);
    expect(await store.deleteById(row.id)).toBe(true);
    const after = await store.listAll();
    expect(after.map((r) => [r.id, r.message])).toEqual(before.map((r) => [r.id, r.message]));
  });
});
