import type { EgyptianDate } from "./types";

/*
 * ==============================
 * مقارنة تاريخين مصريين
 * ==============================
 *
 * تتحقق هل التاريخان متساويان.
 *
 * تشمل:
 * - السنة
 * - الشهر
 * - اليوم
 * - الأيام النسئية
 */
export function clampEgyptianDate(
  date: EgyptianDate
): EgyptianDate {
  if (date.isEpagomenal) {
    if (
      date.epagomenalDay === undefined ||
      date.epagomenalDay < 1 ||
      date.epagomenalDay > 5
    ) {
      throw new Error(
        "Invalid epagomenal date."
      );
    }

    return date;
  }

  if (
    date.month < 1 ||
    date.month > 12
  ) {
    throw new Error(
      "Invalid Egyptian month."
    );
  }

  if (
    date.day < 1 ||
    date.day > 30
  ) {
    throw new Error(
      "Invalid Egyptian day."
    );
  }

  return date;
}
export function isSameEgyptianDate(
  first: EgyptianDate,
  second: EgyptianDate
): boolean {
  /*
   * السنة مختلفة
   */

  if (first.year !== second.year) {
    return false;
  }

  /*
   * واحد نسئي والآخر شهر عادي
   */

  if (
    first.isEpagomenal !==
    second.isEpagomenal
  ) {
    return false;
  }

  /*
   * الأيام النسئية
   */

  if (first.isEpagomenal) {
    return (
      first.epagomenalDay ===
      second.epagomenalDay
    );
  }

  /*
   * الأيام العادية
   */

  return (
    first.month === second.month &&
    first.day === second.day
  );
}