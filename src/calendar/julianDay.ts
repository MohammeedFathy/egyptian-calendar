import type { GregorianDate } from "./types";

export interface JulianDate {
  jd: number;
}

/*
 * Gregorian → Julian Day
 *
 * يستخدم Proleptic Gregorian Calendar.
 *
 * Astronomical Year Numbering:
 *
 * 1 CE  = 1
 * 1 BCE = 0
 * 2 BCE = -1
 * 3 BCE = -2
 */

export function gregorianToJulianDay(
  year: number,
  month: number,
  day: number
): number {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);

  const B =
    2 -
    A +
    Math.floor(A / 4);

  return (
    Math.floor(
      365.25 * (y + 4716)
    ) +
    Math.floor(
      30.6001 * (m + 1)
    ) +
    day +
    B -
    1524.5
  );
}

/*
 * Julian Day → Proleptic Gregorian
 *
 * يستخدم Astronomical Year Numbering.
 *
 * 1 CE  = 1
 * 1 BCE = 0
 * 2 BCE = -1
 * 3 BCE = -2
 */

export function julianDayToGregorian(
  jd: number
): GregorianDate {
  const Z = Math.floor(jd + 0.5);

  const alpha = Math.floor(
    (Z - 1867216.25) / 36524.25
  );

  const A =
    Z +
    1 +
    alpha -
    Math.floor(alpha / 4);

  const B = A + 1524;

  const C = Math.floor(
    (B - 122.1) / 365.25
  );

  const D = Math.floor(
    365.25 * C
  );

  const E = Math.floor(
    (B - D) / 30.6001
  );

  const day =
    B -
    D -
    Math.floor(
      30.6001 * E
    );

  const month =
    E < 14
      ? E - 1
      : E - 13;

  const year =
    month > 2
      ? C - 4716
      : C - 4715;

  return {
    year,
    month,
    day,
  };
}

/*
 * GregorianDate → Julian Day
 */

export function getJulianDay(
  date: GregorianDate
): number {
  return gregorianToJulianDay(
    date.year,
    date.month,
    date.day
  );
}

/*
 * Julian Day → GregorianDate
 */

export function getGregorianFromJulianDay(
  jd: number
): GregorianDate {
  return julianDayToGregorian(jd);
}