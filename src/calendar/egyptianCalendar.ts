import type {
  GregorianDate,
  EgyptianDate,
} from "./types";

/*
 * Egyptian Civil Calendar
 *
 * 12 months × 30 days = 360 days
 * 5 epagomenal days = 365 days
 *
 * No leap year in this model.
 */

/*
 * ==============================
 * Constants
 * ==============================
 */

export const EGYPTIAN_CIVIL_EPOCH = 1448637.5;

export const EGYPTIAN_DAYS_PER_YEAR = 365;

export const EGYPTIAN_DAYS_PER_MONTH = 30;

export const EGYPTIAN_MONTHS_PER_YEAR = 12;

export const EGYPTIAN_MONTH_DAYS =
  EGYPTIAN_MONTHS_PER_YEAR *
  EGYPTIAN_DAYS_PER_MONTH;

export const EGYPTIAN_EPAGOMENAL_DAYS = 5;

export const EGYPTIAN_MONTH_NAMES = [
  "Thoth",
  "Phaophi",
  "Hathor",
  "Choiak",
  "Tybi",
  "Mechir",
  "Phamenoth",
  "Pharmuthi",
  "Pachons",
  "Payni",
  "Epiphi",
  "Mesori",
] as const;

export const EGYPTIAN_SEASONS = [
  "Akhet",
  "Peret",
  "Shemu",
] as const;

export const EPAGOMENAL_NAMES = [
  "Osiris",
  "Horus",
  "Set",
  "Isis",
  "Nephthys",
] as const;

/*
 * ==============================
 * Gregorian → Julian Day
 * ==============================
 */

export function gregorianToJulianDay(
  year: number,
  month: number,
  day: number
): number {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(
      "Gregorian date must contain integer values."
    );
  }

  if (
    month < 1 ||
    month > 12
  ) {
    throw new Error(
      `Invalid Gregorian month: ${month}`
    );
  }

  const daysInMonth =
    getGregorianDaysInMonth(
      year,
      month
    );

  if (
    day < 1 ||
    day > daysInMonth
  ) {
    throw new Error(
      `Invalid Gregorian date: ${day}/${month}/${year}`
    );
  }

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A =
    Math.floor(y / 100);

  const B =
    2 -
    A +
    Math.floor(A / 4);

  return (
    Math.floor(
      365.25 *
      (y + 4716)
    ) +
    Math.floor(
      30.6001 *
      (m + 1)
    ) +
    day +
    B -
    1524.5
  );
}

/*
 * ==============================
 * Julian Day → Gregorian
 * ==============================
 */

export function julianDayToGregorian(
  jd: number
): GregorianDate {
  if (
    !Number.isFinite(jd)
  ) {
    throw new Error(
      "Julian Day must be a finite number."
    );
  }

  const Z =
    Math.floor(jd + 0.5);

  const alpha =
    Math.floor(
      (Z - 1867216.25) /
      36524.25
    );

  const A =
    Z +
    1 +
    alpha -
    Math.floor(alpha / 4);

  const B =
    A + 1524;

  const C =
    Math.floor(
      (B - 122.1) /
      365.25
    );

  const D =
    Math.floor(
      365.25 * C
    );

  const E =
    Math.floor(
      (B - D) /
      30.6001
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
 * ==============================
 * Gregorian validation
 * ==============================
 */

function isLeapGregorianYear(
  year: number
): boolean {
  return (
    year % 4 === 0 &&
    (
      year % 100 !== 0 ||
      year % 400 === 0
    )
  );
}

function getGregorianDaysInMonth(
  year: number,
  month: number
): number {
  const days = [
    31,
    isLeapGregorianYear(year)
      ? 29
      : 28,
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

  return days[month - 1] ?? 0;
}

function assertValidGregorianDate(
  date: GregorianDate
): void {
  if (
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day)
  ) {
    throw new Error(
      "Invalid Gregorian date."
    );
  }

  if (
    date.month < 1 ||
    date.month > 12
  ) {
    throw new Error(
      `Invalid Gregorian month: ${date.month}`
    );
  }

  const maxDay =
    getGregorianDaysInMonth(
      date.year,
      date.month
    );

  if (
    date.day < 1 ||
    date.day > maxDay
  ) {
    throw new Error(
      `Invalid Gregorian date: ${date.day}/${date.month}/${date.year}`
    );
  }
}

/*
 * ==============================
 * Egyptian Season
 * ==============================
 */

function getSeason(
  month: number
): "Akhet" | "Peret" | "Shemu" {
  if (
    month >= 1 &&
    month <= 4
  ) {
    return "Akhet";
  }

  if (
    month >= 5 &&
    month <= 8
  ) {
    return "Peret";
  }

  return "Shemu";
}

/*
 * ==============================
 * Create Egyptian Date
 * ==============================
 */

function createEgyptianDate(
  year: number,
  dayOfYear: number
): EgyptianDate {
  if (
    !Number.isInteger(year)
  ) {
    throw new Error(
      `Invalid Egyptian year: ${year}`
    );
  }

  if (
    !Number.isInteger(dayOfYear) ||
    dayOfYear < 1 ||
    dayOfYear >
      EGYPTIAN_DAYS_PER_YEAR
  ) {
    throw new Error(
      `Invalid Egyptian day of year: ${dayOfYear}`
    );
  }

  if (
    dayOfYear <=
    EGYPTIAN_MONTH_DAYS
  ) {
    const month =
      Math.floor(
        (dayOfYear - 1) /
        EGYPTIAN_DAYS_PER_MONTH
      ) + 1;

    const day =
      ((dayOfYear - 1) %
        EGYPTIAN_DAYS_PER_MONTH) +
      1;

    return {
      year,
      season: getSeason(month),
      month,
      monthName:
        EGYPTIAN_MONTH_NAMES[
          month - 1
        ],
      day,
      dayOfYear,
      isEpagomenal: false,
    };
  }

  const epagomenalDay =
    dayOfYear -
    EGYPTIAN_MONTH_DAYS;

  return {
    year,
    season: "Epagomenal",
    month: 13,
    monthName:
      EPAGOMENAL_NAMES[
        epagomenalDay - 1
      ],
    day: epagomenalDay,
    dayOfYear,
    isEpagomenal: true,
    epagomenalDay,
  };
}

/*
 * ==============================
 * Gregorian → Egyptian
 * ==============================
 */

export function getEgyptianDateFromGregorian(
  date: GregorianDate
): EgyptianDate {
  assertValidGregorianDate(
    date
  );

  const jd =
    gregorianToJulianDay(
      date.year,
      date.month,
      date.day
    );

  const elapsedDays =
    Math.floor(
      jd -
      EGYPTIAN_CIVIL_EPOCH
    );

  const year =
    Math.floor(
      elapsedDays /
      EGYPTIAN_DAYS_PER_YEAR
    ) + 1;

  const dayOfYear =
    (
      (
        elapsedDays %
        EGYPTIAN_DAYS_PER_YEAR
      ) +
      EGYPTIAN_DAYS_PER_YEAR
    ) %
    EGYPTIAN_DAYS_PER_YEAR +
    1;

  return createEgyptianDate(
    year,
    dayOfYear
  );
}

/*
 * ==============================
 * Egyptian → Gregorian
 * ==============================
 */

export function getGregorianDateFromEgyptian(
  date: EgyptianDate
): GregorianDate {
  assertValidEgyptianDate(
    date
  );

  const elapsedDays =
    (date.year - 1) *
    EGYPTIAN_DAYS_PER_YEAR +
    (date.dayOfYear - 1);

  const julianDay =
    EGYPTIAN_CIVIL_EPOCH +
    elapsedDays;

  const gregorian =
    julianDayToGregorian(
      julianDay
    );

  assertValidGregorianDate(
    gregorian
  );

  return gregorian;
}

/*
 * ==============================
 * إضافة أو طرح أيام
 * ==============================
 */

export function addEgyptianDays(
  date: EgyptianDate,
  amount: number
): EgyptianDate {
  assertValidEgyptianDate(
    date
  );

  if (
    !Number.isInteger(amount)
  ) {
    throw new Error(
      `Day amount must be an integer: ${amount}`
    );
  }

  const absoluteDay =
    (date.year - 1) *
    EGYPTIAN_DAYS_PER_YEAR +
    (date.dayOfYear - 1);

  const newAbsoluteDay =
    absoluteDay + amount;

  const year =
    Math.floor(
      newAbsoluteDay /
      EGYPTIAN_DAYS_PER_YEAR
    ) + 1;

  const dayOfYear =
    (
      (
        newAbsoluteDay %
        EGYPTIAN_DAYS_PER_YEAR
      ) +
      EGYPTIAN_DAYS_PER_YEAR
    ) %
    EGYPTIAN_DAYS_PER_YEAR +
    1;

  return createEgyptianDate(
    year,
    dayOfYear
  );
}

/*
 * ==============================
 * اليوم المصري الحالي
 * ==============================
 */

export function getTodayEgyptian(): EgyptianDate {
  const now =
    new Date();

  return getEgyptianDateFromGregorian({
    year:
      now.getFullYear(),
    month:
      now.getMonth() + 1,
    day:
      now.getDate(),
  });
}

/*
 * ==============================
 * معلومات الشهور
 * ==============================
 */

export function getEgyptianMonths() {
  return EGYPTIAN_MONTH_NAMES.map(
    (name, index) => ({
      number: index + 1,
      name,
      season:
        getSeason(index + 1),
    })
  );
}

/*
 * ==============================
 * الأيام النسئية
 * ==============================
 */

export function getEpagomenalDays() {
  return EPAGOMENAL_NAMES.map(
    (name, index) => ({
      day: index + 1,
      name,
    })
  );
}

/*
 * ==============================
 * اسم اليوم النسئي
 * ==============================
 */

export function getEpagomenalName(
  day: number
): string | undefined {
  if (
    !Number.isInteger(day) ||
    day < 1 ||
    day >
      EGYPTIAN_EPAGOMENAL_DAYS
  ) {
    return undefined;
  }

  return EPAGOMENAL_NAMES[
    day - 1
  ];
}

/*
 * ==============================
 * التحقق من التاريخ المصري
 * ==============================
 */

export function isValidEgyptianDate(
  date: EgyptianDate
): boolean {
  if (
    !date ||
    !Number.isInteger(date.year)
  ) {
    return false;
  }

  if (
    !Number.isInteger(
      date.dayOfYear
    )
  ) {
    return false;
  }

  if (
    date.dayOfYear < 1 ||
    date.dayOfYear >
      EGYPTIAN_DAYS_PER_YEAR
  ) {
    return false;
  }

  /*
   * الأيام النسئية
   */

  if (
    date.isEpagomenal
  ) {
    if (
      date.month !== 13
    ) {
      return false;
    }

    if (
      date.day < 1 ||
      date.day >
        EGYPTIAN_EPAGOMENAL_DAYS
    ) {
      return false;
    }

    if (
      date.epagomenalDay !==
      date.day
    ) {
      return false;
    }

    if (
      date.dayOfYear !==
      EGYPTIAN_MONTH_DAYS +
      date.day
    ) {
      return false;
    }

    if (
      date.monthName !==
      EPAGOMENAL_NAMES[
        date.day - 1
      ]
    ) {
      return false;
    }

    if (
      date.season !==
      "Epagomenal"
    ) {
      return false;
    }

    return true;
  }

  /*
   * الأشهر العادية
   */

  if (
    date.month < 1 ||
    date.month >
      EGYPTIAN_MONTHS_PER_YEAR
  ) {
    return false;
  }

  if (
    date.day < 1 ||
    date.day >
      EGYPTIAN_DAYS_PER_MONTH
  ) {
    return false;
  }

  const expectedDayOfYear =
    (date.month - 1) *
    EGYPTIAN_DAYS_PER_MONTH +
    date.day;

  if (
    date.dayOfYear !==
    expectedDayOfYear
  ) {
    return false;
  }

  if (
    date.monthName !==
    EGYPTIAN_MONTH_NAMES[
      date.month - 1
    ]
  ) {
    return false;
  }

  if (
    date.season !==
    getSeason(date.month)
  ) {
    return false;
  }

  return true;
}

/*
 * ==============================
 * التحقق مع إيقاف التنفيذ
 * ==============================
 */

export function assertValidEgyptianDate(
  date: EgyptianDate
): void {
  if (
    !isValidEgyptianDate(date)
  ) {
    throw new Error(
      `Invalid Egyptian date: ${date.day}/${date.monthName}/${date.year}`
    );
  }
}

/*
 * ==============================
 * تحويل التاريخ إلى رقم مطلق
 * ==============================
 */

function egyptianDateToAbsoluteDay(
  date: EgyptianDate
): number {
  assertValidEgyptianDate(
    date
  );

  return (
    (date.year - 1) *
    EGYPTIAN_DAYS_PER_YEAR +
    (date.dayOfYear - 1)
  );
}

/*
 * ==============================
 * مقارنة تاريخين مصريين
 * ==============================
 */

export function compareEgyptianDates(
  a: EgyptianDate,
  b: EgyptianDate
): -1 | 0 | 1 {
  const absoluteA =
    egyptianDateToAbsoluteDay(a);

  const absoluteB =
    egyptianDateToAbsoluteDay(b);

  if (
    absoluteA < absoluteB
  ) {
    return -1;
  }

  if (
    absoluteA > absoluteB
  ) {
    return 1;
  }

  return 0;
}

/*
 * ==============================
 * الفرق بين تاريخين
 * ==============================
 */

export function differenceInEgyptianDays(
  from: EgyptianDate,
  to: EgyptianDate
): number {
  const fromAbsoluteDay =
    egyptianDateToAbsoluteDay(
      from
    );

  const toAbsoluteDay =
    egyptianDateToAbsoluteDay(
      to
    );

  return (
    toAbsoluteDay -
    fromAbsoluteDay
  );
}
