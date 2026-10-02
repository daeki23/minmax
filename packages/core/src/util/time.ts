export const DAY_MS = 86_400_000;

export function parseIso(iso: string): number {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) throw new Error(`Invalid ISO timestamp: ${iso}`);
  return t;
}

export function daysBetween(fromIso: string, toIso: string): number {
  return (parseIso(toIso) - parseIso(fromIso)) / DAY_MS;
}

export function addDays(iso: string, days: number): string {
  return new Date(parseIso(iso) + days * DAY_MS).toISOString();
}

/** Truncate to a calendar date (UTC) for claims; claims never carry finer time. */
export function toDateOnly(iso: string): string {
  return new Date(parseIso(iso)).toISOString().slice(0, 10);
}

export function startOfIsoWeek(iso: string): string {
  const d = new Date(parseIso(iso));
  const day = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString();
}
