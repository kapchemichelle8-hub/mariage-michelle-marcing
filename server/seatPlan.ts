export type SeatAssignment = {
  tableNumber: string;
  tableVirtue: string;
  matchedGuestName: string;
  side?: string | null;
};

/** Normalisation réservée à la compatibilité des anciens billets historiques. */
export function normalizeGuestName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Les nouvelles invitations utilisent l’identifiant stable du code. Pour les
 * anciens billets, ne retourner une table que si le nom exact normalisé mène à
 * une seule affectation; aucune comparaison partielle ou floue n’est autorisée.
 */
export function findSeatAssignment(name: string, assignments: SeatAssignment[]) {
  const wanted = normalizeGuestName(name);
  if (!wanted) return null;

  const exact = assignments.filter(
    assignment => normalizeGuestName(assignment.matchedGuestName) === wanted
  );
  if (!exact.length) return null;

  const distinctSeats = new Set(
    exact.map(assignment => `${assignment.tableNumber}\u0000${assignment.tableVirtue}`)
  );
  if (distinctSeats.size !== 1) return null;

  const assignment = exact[0];
  return {
    tableNumber: assignment.tableNumber,
    tableVirtue: assignment.tableVirtue,
    matchedGuestName: assignment.matchedGuestName,
    side: assignment.side ?? null,
  };
}
