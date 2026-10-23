const QR_PREFIX = "MMQR1";

export type ReceptionQrData = {
  ticketCode: string;
  tableNumber: string | null;
  tableVirtue: string | null;
};

function decodePart(value: string | undefined) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** QR compact : le billet et la table restent lisibles même sans réseau. */
export function createReceptionQr(data: ReceptionQrData) {
  return [
    QR_PREFIX,
    data.ticketCode,
    data.tableNumber ?? "",
    data.tableVirtue ?? "",
  ]
    .map(encodeURIComponent)
    .join("|");
}

/** Accepte le nouveau QR autonome et les anciens QR URL contenant le billet. */
export function parseReceptionQr(raw: string): ReceptionQrData {
  const value = raw.trim();
  const parts = value.split("|");

  if (decodePart(parts[0]) === QR_PREFIX && parts.length >= 4) {
    return {
      ticketCode: decodePart(parts[1]),
      tableNumber: decodePart(parts[2]) || null,
      tableVirtue: decodePart(parts[3]) || null,
    };
  }

  try {
    const url = new URL(value);
    return {
      ticketCode: url.pathname.split("/").filter(Boolean).pop() || value,
      tableNumber: null,
      tableVirtue: null,
    };
  } catch {
    return {
      ticketCode: value.split("/").filter(Boolean).pop() || value,
      tableNumber: null,
      tableVirtue: null,
    };
  }
}

export function tableLabel(tableNumber: string | null, tableVirtue: string | null) {
  if (tableVirtue) return `Table ${tableVirtue}`;
  if (tableNumber) return `Table ${tableNumber}`;
  return "Table non attribuée";
}
