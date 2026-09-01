import {
  getEgyptianDateFromGregorian,
  getGregorianDateFromEgyptian,
  addEgyptianDays,
  getTodayEgyptian as getTodayEgyptianFromCalendar,
  getEgyptianMonths,
  getEpagomenalDays,
  getEpagomenalName,
  isValidEgyptianDate,
  assertValidEgyptianDate,
  compareEgyptianDates,
  differenceInEgyptianDays,
} from "./egyptianCalendar";

import type {
  GregorianDate,
  EgyptianDate,
  DateConversionResult,
} from "./types";

/*
 * Gregorian → Egyptian
 */

export function convertGregorianDate(
  year: number,
  month: number,
  day: number
): DateConversionResult {
  const gregorian: GregorianDate = {
    year,
    month,
    day,
  };

  const egyptian =
    getEgyptianDateFromGregorian(gregorian);

  return {
    input: {
      gregorian,
    },

    result: {
      egyptian,
    },
  };
}

/*
 * Egyptian → Gregorian
 */

export function convertEgyptianDate(
  date: EgyptianDate
): GregorianDate {
  return getGregorianDateFromEgyptian(date);
}

/*
 * إضافة أو طرح أيام
 */

export function addDays(
  date: EgyptianDate,
  amount: number
): EgyptianDate {
  return addEgyptianDays(
    date,
    amount
  );
}

/*
 * التاريخ المصري الحالي
 */

export function getTodayEgyptian(): EgyptianDate {
  return getTodayEgyptianFromCalendar();
}

/*
 * معلومات الشهور
 */

export {
  getEgyptianMonths,
  getEpagomenalDays,
  getEpagomenalName,
};

/*
 * التحقق من التاريخ
 */

export {
  isValidEgyptianDate,
  assertValidEgyptianDate,
};

/*
 * مقارنة التواريخ
 */

export {
  compareEgyptianDates,
  differenceInEgyptianDays,
};