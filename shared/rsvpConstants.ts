// Constantes partagées sans dépendance, pour ne pas alourdir le site public.
export const MAX_GUESTS = 10;

export const TICKET_CODE_PATTERN = /^MM-[A-HJ-NP-Z2-9]{6}$/;

export const sideLabel = (side: "mariee" | "marie") =>
  side === "mariee" ? "Côté de la mariée" : "Côté du marié";
