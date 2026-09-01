import {
  addDays,
  getEgyptianMonths,
} from "./calendarEngine";

import type {
  EgyptianDate,
} from "./types";

/*
 * ==============================
 * Calendar Day
 * ==============================
 */

export interface CalendarDay {
  date: EgyptianDate;
  isCurrentMonth: boolean;
  isEpagomenal: boolean;
}

/*
 * ==============================
 * إنشاء أول يوم في الشهر المصري
 * ==============================
 */

export function createEgyptianMonthStart(
  year: number,
  month: number
): EgyptianDate {
  if (
    !Number.isInteger(year)
  ) {
    throw new Error(
      `Invalid Egyptian year: ${year}`
    );
  }

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(
      `Invalid Egyptian month: ${month}`
    );
  }

  const months =
    getEgyptianMonths();

  const monthInfo =
    months[month - 1];

  if (!monthInfo) {
    throw new Error(
      `Invalid Egyptian month: ${month}`
    );
  }

  return {
    year,
    season: monthInfo.season,
    month,
    monthName: monthInfo.name,
    day: 1,
    dayOfYear:
      (month - 1) * 30 + 1,
    isEpagomenal: false,
  };
}

/*
 * ==============================
 * إنشاء أيام الشهر المصري
 * ==============================
 *
 * كل شهر مصري يحتوي على 30 يومًا.
 *
 * الأيام النسئية لا تدخل هنا.
 */

export function createEgyptianMonthView(
  year: number,
  month: number
): CalendarDay[] {
  if (
    !Number.isInteger(year)
  ) {
    throw new Error(
      `Invalid Egyptian year: ${year}`
    );
  }

  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return [];
  }

  const firstDay =
    createEgyptianMonthStart(
      year,
      month
    );

  const days: CalendarDay[] = [];

  for (
    let day = 1;
    day <= 30;
    day++
  ) {
    const date =
      addDays(
        firstDay,
        day - 1
      );

    /*
     * حماية إضافية.
     *
     * الأيام النسئية لا يجب أن
     * تظهر داخل Month View.
     */

    if (
      date.isEpagomenal
    ) {
      continue;
    }

    days.push({
      date,
      isCurrentMonth: true,
      isEpagomenal: false,
    });
  }

  return days;
}

/*
 * ==============================
 * إنشاء الأيام النسئية
 * ==============================
 *
 * 1 Osiris
 * 2 Horus
 * 3 Set
 * 4 Isis
 * 5 Nephthys
 *
 * بعد Nephthys يبدأ العام التالي
 * بـ Thoth 1.
 */

export function createEpagomenalView(
  year: number
): CalendarDay[] {
  if (
    !Number.isInteger(year)
  ) {
    throw new Error(
      `Invalid Egyptian year: ${year}`
    );
  }

  const mesori30 =
    addDays(
      createEgyptianMonthStart(
        year,
        12
      ),
      29
    );

  const days: CalendarDay[] = [];

  for (
    let day = 1;
    day <= 5;
    day++
  ) {
    const date =
      addDays(
        mesori30,
        day
      );

    /*
     * حماية من أي خلل في المحرك.
     */

    if (
      !date.isEpagomenal
    ) {
      continue;
    }

    days.push({
      date,
      isCurrentMonth: false,
      isEpagomenal: true,
    });
  }

  return days;
}
