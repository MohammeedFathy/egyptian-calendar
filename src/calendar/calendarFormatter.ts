import type {
  GregorianDate,
  EgyptianDate,
} from "./types";

import {
  EGYPTIAN_MONTH_NAMES,
  EGYPTIAN_EPAGOMENAL_DAYS,
  EPAGOMENAL_NAMES,
} from "./egyptianCalendar";

/*
 * ==============================
 * أسماء الفصول المصرية
 * ==============================
 */

const EGYPTIAN_SEASON_NAMES = {
  Akhet: "Akhet",
  Peret: "Peret",
  Shemu: "Shemu",
  Epagomenal: "Epagomenal",
} as const;

/*
 * ==============================
 * Gregorian Date
 * ==============================
 *
 * مثال:
 *
 * 21/8/2026
 *
 * يدعم السنوات الفلكية:
 *
 * 1 CE  → 1
 * 1 BCE → 0
 * 2 BCE → -1
 */

export function formatGregorianDate(
  date: GregorianDate
): string {
  return `${date.day}/${date.month}/${date.year}`;
}

/*
 * ==============================
 * Egyptian Date
 * ==============================
 *
 * الشهر العادي:
 *
 * 7/Tybi/2775
 *
 * اليوم النسئي:
 *
 * 1/Osiris/2775
 */

export function formatEgyptianDate(
  date: EgyptianDate
): string {
  if (date.isEpagomenal) {
    return `${date.epagomenalDay}/${date.monthName}/${date.year}`;
  }

  return `${date.day}/${date.monthName}/${date.year}`;
}

/*
 * ==============================
 * Egyptian Season
 * ==============================
 */

export function formatEgyptianSeason(
  date: EgyptianDate
): string {
  const season =
    EGYPTIAN_SEASON_NAMES[
      date.season
    ];

  if (!season) {
    throw new Error(
      `Invalid Egyptian season: ${date.season}`
    );
  }

  return season;
}

/*
 * ==============================
 * Egyptian Month
 * ==============================
 *
 * month = 5
 * result = Tybi
 */

export function formatEgyptianMonth(
  month: number
): string {
  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month >
      EGYPTIAN_MONTH_NAMES.length
  ) {
    throw new Error(
      `Invalid Egyptian month: ${month}`
    );
  }

  const monthName =
    EGYPTIAN_MONTH_NAMES[
      month - 1
    ];

  if (!monthName) {
    throw new Error(
      `Invalid Egyptian month: ${month}`
    );
  }

  return monthName;
}

/*
 * ==============================
 * Egyptian Month Number
 * ==============================
 *
 * الأيام النسئية ليس لها رقم شهر.
 */

export function formatEgyptianMonthNumber(
  date: EgyptianDate
): string {
  if (date.isEpagomenal) {
    return "";
  }

  return String(
    date.month
  );
}

/*
 * ==============================
 * Egyptian Day
 * ==============================
 *
 * مثال:
 *
 * Day 127 of 365
 *
 * الأيام النسئية:
 *
 * Day 361 of 365
 */

export function formatEgyptianDay(
  date: EgyptianDate
): string {
  return `Day ${date.dayOfYear} of 365`;
}

/*
 * ==============================
 * Epagomenal Day
 * ==============================
 *
 * مثال:
 *
 * Epagomenal Day 1 — Osiris
 */

export function formatEpagomenalDay(
  date: EgyptianDate
): string {
  if (!date.isEpagomenal) {
    return "";
  }

  const day =
    date.epagomenalDay;

  if (
    !day ||
    day < 1 ||
    day >
      EGYPTIAN_EPAGOMENAL_DAYS
  ) {
    throw new Error(
      `Invalid epagomenal day: ${day}`
    );
  }

  const name =
    EPAGOMENAL_NAMES[
      day - 1
    ];

  if (!name) {
    throw new Error(
      `Invalid epagomenal day: ${day}`
    );
  }

  return `Epagomenal Day ${day} — ${name}`;
}

/*
 * ==============================
 * Epagomenal Name
 * ==============================
 *
 * يعيد اسم اليوم فقط.
 *
 * مثال:
 *
 * Osiris
 */

export function formatEpagomenalName(
  date: EgyptianDate
): string {
  if (!date.isEpagomenal) {
    return "";
  }

  const day =
    date.epagomenalDay;

  if (
    !day ||
    day < 1 ||
    day >
      EGYPTIAN_EPAGOMENAL_DAYS
  ) {
    throw new Error(
      `Invalid epagomenal day: ${day}`
    );
  }

  const name =
    EPAGOMENAL_NAMES[
      day - 1
    ];

  if (!name) {
    throw new Error(
      `Invalid epagomenal day: ${day}`
    );
  }

  return name;
}
