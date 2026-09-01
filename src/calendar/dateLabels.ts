export function formatHistoricalYear(
  year: number
): string {
  if (year > 0) {
    return `${year} CE`;
  }

  return `${1 - year} BCE`;
}

export function formatHistoricalDate(
  year: number,
  month: number,
  day: number
): string {
  return `${day}/${month}/${formatHistoricalYear(year)}`;
}