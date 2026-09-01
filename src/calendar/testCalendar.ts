import {
  convertGregorianDate,
  convertEgyptianDate,
  addDays,
  isValidEgyptianDate,
  compareEgyptianDates,
  differenceInEgyptianDays,
} from "./calendarEngine";

import {
  previousMonth,
  nextMonth,
  previousYear,
  nextYear,
} from "./calendarState";

import {
  formatGregorianDate,
  formatEgyptianDate,
} from "./calendarFormatter";

import type {
  EgyptianDate,
} from "./types";

/*
 * ==============================
 * Test Helper
 * ==============================
 */

function assert(
  condition: boolean,
  message: string
): void {
  if (!condition) {
    throw new Error(
      `Test failed: ${message}`
    );
  }
}

/*
 * ==============================
 * Calendar Tests
 * ==============================
 */

export function runCalendarTests(): void {

  /*
   * ==============================
   * Gregorian → Egyptian
   * ==============================
   */

  const referenceResult =
    convertGregorianDate(
      2026,
      8,
      21
    );

  const reference =
    referenceResult.result.egyptian;

  assert(
    !!reference,
    "Gregorian to Egyptian conversion"
  );

  if (!reference) {
    throw new Error(
      "Gregorian to Egyptian conversion returned no Egyptian date."
    );
  }

  assert(
    reference.year === 2775,
    "Egyptian year should be 2775"
  );

  assert(
    reference.month === 5,
    "Egyptian month should be 5"
  );

  assert(
    reference.day === 7,
    "Egyptian day should be 7"
  );

  assert(
    reference.monthName === "Tybi",
    "Egyptian month should be Tybi"
  );

  assert(
    reference.season === "Peret",
    "Egyptian season should be Peret"
  );

  assert(
    reference.dayOfYear === 127,
    "Day of year should be 127"
  );

  assert(
    formatEgyptianDate(reference) ===
      "7/Tybi/2775",
    "Egyptian date formatting"
  );

  /*
   * ==============================
   * addDays
   * ==============================
   */

  const previous =
    addDays(
      reference,
      -1
    );

  const next =
    addDays(
      reference,
      1
    );

  assert(
    previous.day === 6,
    "Previous day should be 6"
  );

  assert(
    next.day === 8,
    "Next day should be 8"
  );

  /*
   * ==============================
   * Month Boundary
   * ==============================
   */

  const mesori30: EgyptianDate = {
    year: 2775,
    season: "Shemu",
    month: 12,
    monthName: "Mesori",
    day: 30,
    dayOfYear: 360,
    isEpagomenal: false,
  };

  assert(
    isValidEgyptianDate(
      mesori30
    ),
    "Mesori 30 should be valid"
  );

  const epagomenal1 =
    addDays(
      mesori30,
      1
    );

  assert(
    epagomenal1.isEpagomenal,
    "Day after Mesori 30 should be epagomenal"
  );

  assert(
    epagomenal1.epagomenalDay === 1,
    "First epagomenal day should be 1"
  );

  assert(
    epagomenal1.monthName === "Osiris",
    "First epagomenal day should be Osiris"
  );

  assert(
    epagomenal1.dayOfYear === 361,
    "Osiris should be day 361"
  );

  /*
   * ==============================
   * Epagomenal Boundary
   * ==============================
   */

  const epagomenal5 =
    addDays(
      mesori30,
      5
    );

  assert(
    epagomenal5.isEpagomenal,
    "Fifth epagomenal day should be epagomenal"
  );

  assert(
    epagomenal5.epagomenalDay === 5,
    "Fifth epagomenal day should be 5"
  );

  assert(
    epagomenal5.monthName === "Nephthys",
    "Fifth epagomenal day should be Nephthys"
  );

  assert(
    epagomenal5.dayOfYear === 365,
    "Nephthys should be day 365"
  );

  /*
   * ==============================
   * New Year Boundary
   * ==============================
   */

  const newYear =
    addDays(
      mesori30,
      6
    );

  assert(
    newYear.year === 2776,
    "New Year should advance to 2776"
  );

  assert(
    newYear.month === 1,
    "New Year month should be Thoth"
  );

  assert(
    newYear.monthName === "Thoth",
    "New Year month should be Thoth"
  );

  assert(
    newYear.day === 1,
    "New Year day should be 1"
  );

  assert(
    newYear.dayOfYear === 1,
    "New Year day of year should be 1"
  );

  assert(
    !newYear.isEpagomenal,
    "New Year should not be epagomenal"
  );

  /*
   * ==============================
   * previousMonth
   * ==============================
   */

  const tybi7State = {
    selectedDate: reference,
  };

  const previousMonthDate =
    previousMonth(
      tybi7State
    ).selectedDate;

  assert(
    previousMonthDate.year === 2775,
    "Previous month from Tybi should stay in the same year"
  );

  assert(
    previousMonthDate.month === 4,
    "Previous month from Tybi should be Choiak"
  );

  assert(
    previousMonthDate.monthName === "Choiak",
    "Previous month should be Choiak"
  );

  assert(
    previousMonthDate.day === 7,
    "Previous month should preserve the day"
  );

  /*
   * ==============================
   * nextMonth
   * ==============================
   */

  const nextMonthDate =
    nextMonth(
      tybi7State
    ).selectedDate;

  assert(
    nextMonthDate.year === 2775,
    "Next month from Tybi should stay in the same year"
  );

  assert(
    nextMonthDate.month === 6,
    "Next month from Tybi should be Mechir"
  );

  assert(
    nextMonthDate.monthName === "Mechir",
    "Next month should be Mechir"
  );

  assert(
    nextMonthDate.day === 7,
    "Next month should preserve the day"
  );

  /*
   * ==============================
   * previousMonth from Thoth
   * ==============================
   */

  const thoth1: EgyptianDate = {
    year: 2775,
    season: "Akhet",
    month: 1,
    monthName: "Thoth",
    day: 1,
    dayOfYear: 1,
    isEpagomenal: false,
  };

  const previousFromThoth =
    previousMonth({
      selectedDate: thoth1,
    }).selectedDate;

  assert(
    previousFromThoth.year === 2774,
    "Previous month from Thoth should move to previous year"
  );

  assert(
    previousFromThoth.month === 12,
    "Previous month from Thoth should be Mesori"
  );

  assert(
    previousFromThoth.monthName === "Mesori",
    "Previous month from Thoth should be Mesori"
  );

  assert(
    previousFromThoth.day === 1,
    "Previous month from Thoth should preserve day 1"
  );

  /*
   * ==============================
   * nextMonth from Mesori
   * ==============================
   */

  const mesori15: EgyptianDate = {
    year: 2775,
    season: "Shemu",
    month: 12,
    monthName: "Mesori",
    day: 15,
    dayOfYear: 345,
    isEpagomenal: false,
  };

  const nextFromMesori =
    nextMonth({
      selectedDate: mesori15,
    }).selectedDate;

  assert(
    nextFromMesori.year === 2775,
    "Next month from Mesori should stay in the same year"
  );

  assert(
    nextFromMesori.isEpagomenal,
    "Next month from Mesori should enter epagomenal days"
  );

  assert(
    nextFromMesori.epagomenalDay === 1,
    "Next month from Mesori should reach epagomenal day 1"
  );

  assert(
    nextFromMesori.monthName === "Osiris",
    "First epagomenal day should be Osiris"
  );

  /*
   * ==============================
   * previousMonth from Epagomenal
   * ==============================
   */

  const epagomenal3 =
    addDays(
      mesori30,
      3
    );

  const previousFromEpagomenal =
    previousMonth({
      selectedDate: epagomenal3,
    }).selectedDate;

  assert(
    previousFromEpagomenal.year === 2775,
    "Previous month from epagomenal should stay in the same year"
  );

  assert(
    previousFromEpagomenal.month === 12,
    "Previous month from epagomenal should return to Mesori"
  );

  assert(
    previousFromEpagomenal.monthName === "Mesori",
    "Previous month from epagomenal should return to Mesori"
  );

  assert(
    previousFromEpagomenal.day === 30,
    "Previous month from epagomenal should return to Mesori 30"
  );

  /*
   * ==============================
   * nextMonth from Epagomenal
   * ==============================
   */

  const nextFromEpagomenal =
    nextMonth({
      selectedDate: epagomenal3,
    }).selectedDate;

  assert(
    nextFromEpagomenal.isEpagomenal,
    "Next month from epagomenal day 3 should remain epagomenal"
  );

  assert(
    nextFromEpagomenal.epagomenalDay === 4,
    "Next month from epagomenal day 3 should reach day 4"
  );

  /*
   * ==============================
   * Nephthys 5 → New Year
   * ==============================
   */

  const nextFromNephthys =
    nextMonth({
      selectedDate: epagomenal5,
    }).selectedDate;

  assert(
    nextFromNephthys.year === 2776,
    "Next month from Nephthys should move to the next year"
  );

  assert(
    nextFromNephthys.month === 1,
    "Next month from Nephthys should move to Thoth"
  );

  assert(
    nextFromNephthys.monthName === "Thoth",
    "Next month from Nephthys should be Thoth"
  );

  assert(
    nextFromNephthys.day === 1,
    "Next month from Nephthys should be Thoth 1"
  );

  assert(
    nextFromNephthys.dayOfYear === 1,
    "Next month from Nephthys should have day of year 1"
  );

  assert(
    !nextFromNephthys.isEpagomenal,
    "Thoth 1 should not be epagomenal"
  );

  /*
   * ==============================
   * Previous Year Boundary
   * ==============================
   */

  const previousYearDate =
    addDays(
      thoth1,
      -1
    );

  assert(
    previousYearDate.year === 2774,
    "Day before Thoth 1 should be previous Egyptian year"
  );

  assert(
    previousYearDate.month === 12,
    "Day before Thoth 1 should be Mesori"
  );

  assert(
    previousYearDate.monthName === "Mesori",
    "Day before Thoth 1 should be Mesori"
  );

  assert(
    previousYearDate.day === 30,
    "Day before Thoth 1 should be Mesori 30"
  );

  assert(
    previousYearDate.dayOfYear === 360,
    "Mesori 30 should be day 360"
  );

  /*
   * ==============================
   * Previous Year → Epagomenal
   * ==============================
   */

  const previousYearEpagomenal =
    addDays(
      thoth1,
      -2
    );

  assert(
    previousYearEpagomenal.year === 2774,
    "Two days before Thoth should remain in previous year"
  );

  assert(
    previousYearEpagomenal.isEpagomenal,
    "Two days before Thoth should be epagomenal"
  );

  assert(
    previousYearEpagomenal.epagomenalDay === 5,
    "Two days before Thoth should be Nephthys"
  );

  assert(
    previousYearEpagomenal.monthName === "Nephthys",
    "Two days before Thoth should be Nephthys"
  );

  assert(
    previousYearEpagomenal.dayOfYear === 365,
    "Nephthys should be day 365"
  );

  /*
   * ==============================
   * previousYear
   * ==============================
   */

  const previousYearState =
    previousYear({
      selectedDate: reference,
    }).selectedDate;

  assert(
    previousYearState.year === 2774,
    "previousYear should move to year 2774"
  );

  assert(
    previousYearState.month === 5,
    "previousYear should preserve month"
  );

  assert(
    previousYearState.day === 7,
    "previousYear should preserve day"
  );

  /*
   * ==============================
   * nextYear
   * ==============================
   */

  const nextYearState =
    nextYear({
      selectedDate: reference,
    }).selectedDate;

  assert(
    nextYearState.year === 2776,
    "nextYear should move to year 2776"
  );

  assert(
    nextYearState.month === 5,
    "nextYear should preserve month"
  );

  assert(
    nextYearState.day === 7,
    "nextYear should preserve day"
  );

  /*
   * ==============================
   * Gregorian ↔ Egyptian
   * ==============================
   */

  const convertedGregorian =
    convertEgyptianDate(
      reference
    );

  assert(
    convertedGregorian.year === 2026,
    "Egyptian to Gregorian year"
  );

  assert(
    convertedGregorian.month === 8,
    "Egyptian to Gregorian month"
  );

  assert(
    convertedGregorian.day === 21,
    "Egyptian to Gregorian day"
  );

  /*
   * ==============================
   * Round Trip
   * ==============================
   */

  const convertedEgyptian =
    convertGregorianDate(
      convertedGregorian.year,
      convertedGregorian.month,
      convertedGregorian.day
    );

  const returnedEgyptian =
    convertedEgyptian.result.egyptian;

  assert(
    !!returnedEgyptian,
    "Round trip should return an Egyptian date"
  );

  if (!returnedEgyptian) {
    throw new Error(
      "Round trip returned no Egyptian date."
    );
  }

  assert(
    returnedEgyptian.year === reference.year,
    "Round trip year"
  );

  assert(
    returnedEgyptian.month === reference.month,
    "Round trip month"
  );

  assert(
    returnedEgyptian.day === reference.day,
    "Round trip day"
  );

  /*
   * ==============================
   * Date Comparison
   * ==============================
   */

  assert(
    compareEgyptianDates(
      previous,
      reference
    ) === -1,
    "Previous date should be older"
  );

  assert(
    compareEgyptianDates(
      reference,
      reference
    ) === 0,
    "Same dates should compare as equal"
  );

  assert(
    compareEgyptianDates(
      next,
      reference
    ) === 1,
    "Next date should be newer"
  );

  /*
   * ==============================
   * Difference Between Dates
   * ==============================
   */

  assert(
    differenceInEgyptianDays(
      reference,
      next
    ) === 1,
    "Next day difference should be 1"
  );

  assert(
    differenceInEgyptianDays(
      reference,
      previous
    ) === -1,
    "Previous day difference should be -1"
  );

  assert(
    differenceInEgyptianDays(
      reference,
      reference
    ) === 0,
    "Same date difference should be 0"
  );

  /*
   * ==============================
   * Historical Gregorian Dates
   * ==============================
   */

  const historicalDates = [
    {
      year: 1,
      month: 1,
      day: 1,
    },
    {
      year: 0,
      month: 1,
      day: 1,
    },
    {
      year: -1,
      month: 1,
      day: 1,
    },
    {
      year: -10,
      month: 1,
      day: 1,
    },
    {
      year: -100,
      month: 1,
      day: 1,
    },
  ];

  for (
    const date of historicalDates
  ) {
    const result =
      convertGregorianDate(
        date.year,
        date.month,
        date.day
      );

    assert(
      !!result.result.egyptian,
      `Historical conversion ${formatGregorianDate(
        date
      )}`
    );
  }

  /*
   * ==============================
   * Invalid Dates
   * ==============================
   */

  const invalidDates: EgyptianDate[] = [
    {
      year: 2775,
      season: "Akhet",
      month: 0,
      monthName: "Invalid",
      day: 1,
      dayOfYear: 1,
      isEpagomenal: false,
    },
    {
      year: 2775,
      season: "Akhet",
      month: 13,
      monthName: "Invalid",
      day: 1,
      dayOfYear: 1,
      isEpagomenal: false,
    },
    {
      year: 2775,
      season: "Akhet",
      month: 1,
      monthName: "Thoth",
      day: 0,
      dayOfYear: 0,
      isEpagomenal: false,
    },
    {
      year: 2775,
      season: "Akhet",
      month: 1,
      monthName: "Thoth",
      day: 31,
      dayOfYear: 31,
      isEpagomenal: false,
    },
  ];

  for (
    const date of invalidDates
  ) {
    assert(
      !isValidEgyptianDate(date),
      `Invalid Egyptian date should be rejected: ${formatEgyptianDateSafe(
        date
      )}`
    );
  }

  /*
   * ==============================
   * Test Complete
   * ==============================
   */

  console.log(
    "Egyptian Calendar tests passed."
  );
}

/*
 * ==============================
 * Safe Formatter
 * ==============================
 */

function formatEgyptianDateSafe(
  date: EgyptianDate
): string {
  if (date.isEpagomenal) {
    return `${date.epagomenalDay}/${date.monthName}/${date.year}`;
  }

  return `${date.day}/${date.monthName}/${date.year}`;
}

/*
 * لا نشغل الاختبارات تلقائيًا هنا.
 *
 * يتم استدعاء runCalendarTests()
 * يدويًا عند الحاجة أثناء الاختبار.
 */
