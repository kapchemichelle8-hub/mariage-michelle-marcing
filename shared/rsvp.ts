import { z } from "zod";
import { MAX_GUESTS } from "./rsvpConstants";

export { MAX_GUESTS, sideLabel, TICKET_CODE_PATTERN } from "./rsvpConstants";

export const rsvpInputSchema = z
  .object({
    name: z.string().trim().min(2, "Merci d'indiquer votre nom.").max(160),
    email: z
      .string()
      .trim()
      .max(320)
      .email("Adresse e-mail invalide.")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    side: z.enum(["mariee", "marie"]),
    attendance: z.enum(["yes", "no"]),
    guestsCount: z.number().int().min(0).max(MAX_GUESTS),
    message: z.string().trim().max(1500).optional(),
  })
  .refine((v) => v.attendance === "no" || v.guestsCount >= 1, {
    message: "Indiquez au moins une personne.",
    path: ["guestsCount"],
  });

export type RsvpInput = z.infer<typeof rsvpInputSchema>;
