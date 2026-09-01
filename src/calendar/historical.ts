import type {
  GregorianDate,
} from "./types";

/*
 * ==============================
 * Historical / Astronomical Year Numbering
 * ==============================
 *
 * 1 CE  = 1
 * 1 BCE = 0
 * 2 BCE = -1
 * 3 BCE = -2
 */

/*
 * ==============================
 * التحقق من السنة
 * ==============================
 */

export function isValidHistoricalYear(
  year: number
): boolean {
  return Number.isInteger(year);
}

/*
 * ==============================
 * تحويل السنة التاريخية إلى نص
 * ==============================
 */

export function formatHistoricalYear(
  year: number
): string {
  if (!isValidHistoricalYear(year)) {
    throw new Error(
      `Invalid historical year: ${year}`
    );
  }

  if (year > 0) {
    return `${year} CE`;
  }

  return `${Math.abs(year) + 1} BCE`;
}

/*
 * ==============================
 * BCE → Astronomical Year
 * ==============================
 *
 * 1 BCE → 0
 * 2 BCE → -1
 * 3 BCE → -2
 */

export function bceToAstronomicalYear(
  bceYear: number
): number {
  if (
    !Number.isInteger(bceYear) ||
    bceYear < 1
  ) {
    throw new Error(
      `Invalid BCE year: ${bceYear}`
    );
  }

  return 1 - bceYear;
}

/*
 * ==============================
 * Astronomical Year → BCE
 * ==============================
 *
 * 0  → 1 BCE
 * -1 → 2 BCE
 * -2 → 3 BCE
 */

export function astronomicalYearToBce(
  year: number
): number {
  if (
    !Number.isInteger(year) ||
    year > 0
  ) {
    throw new Error(
      `Year ${year} is CE, not BCE.`
    );
  }

  return 1 - year;
}

/*
 * ==============================
 * عدد أيام الشهر
 * ==============================
 */

function daysInGregorianMonth(
  year: number,
  month: number
): number {
  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return 0;
  }

  if (month === 2) {
    const isLeapYear =
      year % 4 === 0 &&
      (
        year % 100 !== 0 ||
        year % 400 === 0
      );

    return isLeapYear ? 29 : 28;
  }

  if (
    month === 4 ||
    month === 6 ||
    month === 9 ||
    month === 11
  ) {
    return 30;
  }

  return 31;
}

/*
 * ==============================
 * إنشاء تاريخ تاريخي
 * ==============================
 */

export function createHistoricalDate(
  year: number,
  month: number,
  day: number
): GregorianDate {
  if (
    !isValidHistoricalYear(year)
  ) {
    throw new Error(
      `Invalid historical year: ${year}`
    );
  }

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(
      `Invalid Gregorian month: ${month}`
    );
  }

  const maxDay =
    daysInGregorianMonth(
      year,
      month
    );

  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day > maxDay
  ) {
    throw new Error(
      `Invalid Gregorian day: ${day}`
    );
  }

  return {
    year,
    month,
    day,
  };
}