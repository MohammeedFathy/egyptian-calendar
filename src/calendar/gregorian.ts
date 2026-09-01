import type { GregorianDate } from "./types";

export function createGregorianDate(
  year: number,
  month: number,
  day: number
): GregorianDate {
  return {
    year,
    month,
    day,
  };
}

export function isLeapYear(year: number): boolean {
  return (
    year % 4 === 0 &&
    (year % 100 !== 0 || year % 400 === 0)
  );
}

export function daysInMonth(
  year: number,
  month: number
): number {
  const days = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return days[month - 1];
}