import { describe, expect, it } from "vitest";
import { TICKET_CODE_PATTERN } from "../shared/rsvp";
import { makeCaller } from "./testUtils";

const base = { side: "mariee" as const, message: "" };

describe("RSVP", () => {
  it("présence : enregistre la réponse et crée un billet MM-XXXXXX", async () => {
    const { caller, store } = makeCaller();
    const res = await caller.rsvp.submit({
      ...base,
      name: "Famille Test",
      attendance: "yes",
      guestsCount: 3,
      message: "Que Dieu bénisse votre union",
    });
    expect(res.attendance).toBe("yes");
    expect(res.ticketCode).toMatch(TICKET_CODE_PATTERN);
    expect(store.rows).toHaveLength(1);
    expect(store.rows[0].guestsCount).toBe(3);

    const ticket = await caller.rsvp.ticket({ code: res.ticketCode! });
    expect(ticket).toEqual({
      name: "Famille Test",
      side: "mariee",
      guestsCount: 3,
      ticketCode: res.ticketCode,
    });
  });

  it("absence : enregistre sans erreur, sans billet et avec 0 personne", async () => {
    const { caller, store } = makeCaller();
    const res = await caller.rsvp.submit({
      ...base,
      name: "Invité absent",
      attendance: "no",
      guestsCount: 4,
      message: "Nous serons avec vous par la prière",
    });
    expect(res).toEqual({ attendance: "no", ticketCode: null, name: "Invité absent" });
    expect(store.rows[0].guestsCount).toBe(0);
    expect(store.rows[0].message).toBe("Nous serons avec vous par la prière");
  });

  it("présence sans aucune personne : refusée", async () => {
    const { caller } = makeCaller();
    await expect(
      caller.rsvp.submit({ ...base, name: "Test", attendance: "yes", guestsCount: 0 })
    ).rejects.toThrow();
  });

  it("billet inconnu ou d'un invité absent : introuvable", async () => {
    const { caller } = makeCaller();
    await expect(caller.rsvp.ticket({ code: "MM-AAAAAA" })).rejects.toThrow(/introuvable/);
    await expect(caller.rsvp.ticket({ code: "n'importe quoi" })).rejects.toThrow(/introuvable/);
  });

  it("enregistre le mot doux tel quel, sans le réécrire", async () => {
    const { caller, store } = makeCaller();
    const message = "Mes chers Michelle & Marcing, « que l'amour vous garde » 💛";
    await caller.rsvp.submit({ ...base, name: "Tante Test", attendance: "yes", guestsCount: 1, message });
    expect(store.rows[0].message).toBe(message);
  });
});

describe("Livre d'or", () => {
  it("affiche 3 messages puis la suite avec « Voir plus », sans compteur public", async () => {
    const { caller } = makeCaller();
    for (let i = 1; i <= 5; i++) {
      await caller.rsvp.submit({ ...base, name: `Invité ${i}`, attendance: "yes", guestsCount: 1, message: `Message ${i}` });
    }
    await caller.rsvp.submit({ ...base, name: "Sans mot", attendance: "yes", guestsCount: 1 });

    const first = await caller.guestbook.list({ offset: 0, limit: 3 });
    expect(first.items.map((m) => m.message)).toEqual(["Message 5", "Message 4", "Message 3"]);
    expect(first.hasMore).toBe(true);
    expect(Object.keys(first)).toEqual(["items", "hasMore"]);
    expect(Object.keys(first.items[0]).sort()).toEqual(["createdAt", "id", "message", "name", "side"]);

    const next = await caller.guestbook.list({ offset: 3, limit: 3 });
    expect(next.items.map((m) => m.message)).toEqual(["Message 2", "Message 1"]);
    expect(next.hasMore).toBe(false);
  });
});
