const SPREADSHEET_ID = "1YbJ-ezfIv4g23J1J4T3rcD4YmP525Ce2kpKhDEGXq10";
const SHEET_NAME = "🪑 Plan de table";
const SEAT_PLAN_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

export type SeatAssignment = {
  tableNumber: string;
  tableVirtue: string;
  matchedGuestName: string;
  side: string;
  tableGuests?: string[];
};

function parseCsvLine(line: string) {
  const cells: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const character = line[i];
    const next = line[i + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  cells.push(cell.trim());
  return cells;
}

export function parseSeatPlanCsv(csv: string): SeatAssignment[] {
  const assignments: SeatAssignment[] = [];
  for (const line of csv.split(/\r?\n/)) {
    const cells = parseCsvLine(line);
    const tableNumber = cells[0]?.trim() ?? "";
    const tableVirtue = cells[1]?.trim() ?? "";
    const guestName = cells[2]?.trim() ?? "";
    const side = cells[3]?.trim() ?? "";

    if (!/^\d+$/.test(tableNumber) || !tableVirtue || !guestName) continue;
    if (/^\d+$/.test(guestName) || /^(invités|nom et prénom)$/i.test(guestName)) continue;

    assignments.push({
      tableNumber,
      tableVirtue,
      matchedGuestName: guestName,
      side,
    });
  }
  return assignments;
}

export function normalizeGuestName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function findSeatAssignment(name: string, assignments: SeatAssignment[]) {
  const wanted = normalizeGuestName(name);
  if (!wanted) return null;

  const exact = assignments.find(
    assignment => normalizeGuestName(assignment.matchedGuestName) === wanted
  );
  if (exact) return exact;

  const ignoredTokens = new Set([
    "m",
    "mr",
    "mme",
    "tata",
    "maman",
    "papa",
    "epouse",
    "epoux",
    "de",
    "du",
    "la",
    "le",
  ]);
  const wantedTokens = wanted
    .split(" ")
    .filter(token => token.length >= 3 && !ignoredTokens.has(token));
  if (!wantedTokens.length) return null;

  // Le nom peut contenir un prénom supplémentaire (ex. « Kengne ange paola »),
  // mais on exige au moins deux éléments communs avec le nom du plan. Pour une
  // saisie très courte, une seule correspondance est autorisée uniquement si
  // elle mène à une seule table.
  const candidates = assignments
    .map(assignment => {
      const candidateTokens = normalizeGuestName(assignment.matchedGuestName)
        .split(" ")
        .filter(token => token.length >= 3 && !ignoredTokens.has(token));
      const sharedTokens = wantedTokens.filter(token => candidateTokens.includes(token));
      const candidateFitsWanted = candidateTokens.every(token => wantedTokens.includes(token));
      const wantedFitsCandidate = wantedTokens.every(token => candidateTokens.includes(token));
      const valid =
        (sharedTokens.length >= 2 && (candidateFitsWanted || wantedFitsCandidate)) ||
        (wantedTokens.length === 1 && sharedTokens.length === 1);
      return valid ? { assignment, score: sharedTokens.length } : null;
    })
    .filter((candidate): candidate is { assignment: SeatAssignment; score: number } => candidate !== null);
  if (!candidates.length) return null;

  const bestScore = Math.max(...candidates.map(candidate => candidate.score));
  const bestCandidates = candidates.filter(candidate => candidate.score === bestScore);
  const tableNumbers = new Set(bestCandidates.map(candidate => candidate.assignment.tableNumber));
  return tableNumbers.size === 1 ? bestCandidates[0].assignment : null;
}

export async function getSeatAssignmentByName(name: string) {
  try {
    const assignments = await getCachedSeatPlan();
    const assignment = findSeatAssignment(name, assignments);
    if (!assignment) return null;
    return {
      ...assignment,
      tableGuests: getTableMembers(assignment.tableNumber, assignments),
    };
  } catch (error) {
    console.warn("[SeatPlan] Lecture du plan impossible:", error);
    return null;
  }
}

export function getTableMembers(tableNumber: string, assignments: SeatAssignment[]) {
  return assignments
    .filter(assignment => assignment.tableNumber === tableNumber)
    .map(assignment => assignment.matchedGuestName);
}

let cachedAssignments: SeatAssignment[] | null = null;
let cacheTimestamp = 0;
let pendingSeatPlanRequest: Promise<SeatAssignment[]> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 secondes

export async function getCachedSeatPlan(): Promise<SeatAssignment[]> {
  const now = Date.now();
  if (cachedAssignments && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedAssignments;
  }
  if (pendingSeatPlanRequest) return pendingSeatPlanRequest;
  pendingSeatPlanRequest = (async () => {
    try {
      const response = await fetch(SEAT_PLAN_URL, {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: "text/csv" },
      });
      if (!response.ok) throw new Error(`Plan de table indisponible (${response.status})`);
      cachedAssignments = parseSeatPlanCsv(await response.text());
      cacheTimestamp = Date.now();
      return cachedAssignments;
    } catch (error) {
      if (cachedAssignments) return cachedAssignments;
      throw error;
    } finally {
      pendingSeatPlanRequest = null;
    }
  })();
  return pendingSeatPlanRequest;
}

export { SEAT_PLAN_URL };
