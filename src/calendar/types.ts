/*
 * ==============================
 * Gregorian Date
 * ==============================
 *
 * Gregorian calendar date.
 *
 * Astronomical year numbering:
 *
 * 1 CE  → 1
 * 1 BCE → 0
 * 2 BCE → -1
 */

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

/*
 * ==============================
 * Egyptian Season
 * ==============================
 */

export type EgyptianSeason =
  | "Akhet"
  | "Peret"
  | "Shemu"
  | "Epagomenal";

/*
 * ==============================
 * Egyptian Date
 * ==============================
 *
 * Normal month:
 *
 * month = 1 → Thoth
 * month = 5 → Tybi
 * month = 12 → Mesori
 *
 * Epagomenal day:
 *
 * month = 13
 * isEpagomenal = true
 *
 * The value 13 is an internal
 * representation only.
 *
 * The epagomenal days are not
 * considered a normal Egyptian month.
 */

export interface EgyptianDate {
  year: number;

  season: EgyptianSeason;

  /*
   * 1–12 for normal months.
   *
   * 13 for epagomenal days.
   */

  month: number;

  monthName: string;

  /*
   * Normal month:
   *
   * 1–30
   *
   * Epagomenal:
   *
   * 1–5
   */

  day: number;

  /*
   * 1–365
   */

  dayOfYear: number;

  /*
   * true only for epagomenal days.
   */

  isEpagomenal: boolean;

  /*
   * Exists only when isEpagomenal === true.
   *
   * 1 → Osiris
   * 2 → Horus
   * 3 → Set
   * 4 → Isis
   * 5 → Nephthys
   */

  epagomenalDay?: number;
}

/*
 * ==============================
 * Calendar Date
 * ==============================
 *
 * A container that can hold either
 * Gregorian or Egyptian date data.
 */

export interface CalendarDate {
  gregorian?: GregorianDate;
  egyptian?: EgyptianDate;
}

/*
 * ==============================
 * Date Conversion Result
 * ==============================
 *
 * Used when converting between
 * calendar systems.
 */

export interface DateConversionResult {
  input: CalendarDate;

  result: CalendarDate;
}
