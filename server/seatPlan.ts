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

  const partial = assignments.find(assignment => {
    const candidate = normalizeGuestName(assignment.matchedGuestName);
    return candidate.length >= 5 && (wanted.includes(candidate) || candidate.includes(wanted));
  });
  if (partial) return partial;

  const wantedTokens = new Set(wanted.split(" ").filter(token => token.length >= 4));
  return (
    assignments.find(assignment => {
      const candidateTokens = normalizeGuestName(assignment.matchedGuestName)
        .split(" ")
        .filter(token => token.length >= 4);
      return candidateTokens.length > 0 && candidateTokens.some(token => wantedTokens.has(token));
    }) ?? null
  );
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
