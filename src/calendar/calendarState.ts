import {
  convertGregorianDate,
  addDays,
} from "./calendarEngine";

import type {
  CalendarDate,
  EgyptianDate,
} from "./types";

/*
 * ==============================
 * Calendar State
 * ==============================
 */

export interface CalendarState {
  selectedDate: EgyptianDate;
}

/*
 * ==============================
 * إنشاء حالة التقويم من Gregorian
 * ==============================
 */

export function createCalendarState(
  year: number,
  month: number,
  day: number
): CalendarState {
  const result =
    convertGregorianDate(
      year,
      month,
      day
    );

  const egyptian =
    result.result.egyptian;

  if (!egyptian) {
    throw new Error(
      "Failed to create calendar state."
    );
  }

  return {
    selectedDate: egyptian,
  };
}

/*
 * ==============================
 * اليوم السابق
 * ==============================
 */

export function previousDay(
  state: CalendarState
): CalendarState {
  return {
    selectedDate: addDays(
      state.selectedDate,
      -1
    ),
  };
}

/*
 * ==============================
 * اليوم التالي
 * ==============================
 */

export function nextDay(
  state: CalendarState
): CalendarState {
  return {
    selectedDate: addDays(
      state.selectedDate,
      1
    ),
  };
}

/*
 * ==============================
 * الشهر السابق
 * ==============================
 *
 * الشهر المصري دائمًا 30 يومًا.
 *
 * Thoth 1
 * → Mesori 1 من السنة السابقة
 *
 * Choiak 7
 * → Hathor 7
 *
 * أي يوم نسئي
 * → Mesori 30
 */

export function previousMonth(
  state: CalendarState
): CalendarState {
  const date =
    state.selectedDate;

  /*
   * الأيام النسئية
   *
   * لا تعتبر شهرًا.
   *
   * الرجوع منها يعيدنا إلى
   * آخر يوم من Mesori.
   */

  if (date.isEpagomenal) {
    return {
      selectedDate: addDays(
        date,
        -(
          date.epagomenalDay ?? 1
        )
      ),
    };
  }

  /*
   * Thoth
   *
   * الرجوع 30 يومًا من Thoth 1
   * يعطينا Mesori 1 من السنة السابقة.
   */

  return {
    selectedDate: addDays(
      date,
      -30
    ),
  };
}

/*
 * ==============================
 * الشهر التالي
 * ==============================
 *
 * Tybi 7
 * → Mechir 7
 *
 * Mesori 15
 * → Osiris 1
 *
 * Osiris
 * → Horus
 *
 * Horus
 * → Set
 *
 * Set
 * → Isis
 *
 * Isis
 * → Nephthys
 *
 * Nephthys
 * → Thoth 1 من السنة التالية
 */

export function nextMonth(
  state: CalendarState
): CalendarState {
  const date =
    state.selectedDate;

  /*
   * الأيام النسئية
   *
   * ننتقل إلى اليوم النسئي التالي.
   */

  if (date.isEpagomenal) {
    return {
      selectedDate: addDays(
        date,
        1
      ),
    };
  }

  /*
   * Mesori
   *
   * ننتقل إلى Osiris 1.
   */

  if (date.month === 12) {
    return {
      selectedDate: addDays(
        date,
        30 - date.day + 1
      ),
    };
  }

  /*
   * الشهور العادية
   */

  return {
    selectedDate: addDays(
      date,
      30
    ),
  };
}

/*
 * ==============================
 * السنة السابقة
 * ==============================
 *
 * نحافظ على الشهر واليوم
 * ونرجع 365 يومًا.
 */

export function previousYear(
  state: CalendarState
): CalendarState {
  return {
    selectedDate: addDays(
      state.selectedDate,
      -365
    ),
  };
}

/*
 * ==============================
 * السنة التالية
 * ==============================
 *
 * نحافظ على الشهر واليوم
 * ونتقدم 365 يومًا.
 */

export function nextYear(
  state: CalendarState
): CalendarState {
  return {
    selectedDate: addDays(
      state.selectedDate,
      365
    ),
  };
}

/*
 * ==============================
 * التحرك بعدد معين من الأيام
 * ==============================
 */

export function moveDays(
  state: CalendarState,
  amount: number
): CalendarState {
  if (
    !Number.isInteger(amount)
  ) {
    throw new Error(
      `Invalid day movement: ${amount}`
    );
  }

  return {
    selectedDate: addDays(
      state.selectedDate,
      amount
    ),
  };
}

/*
 * ==============================
 * اليوم الحالي
 * ==============================
 */

export function todayState(): CalendarState {
  const now =
    new Date();

  return createCalendarState(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );
}

/*
 * ==============================
 * تحويل CalendarState إلى CalendarDate
 * ==============================
 */

export function stateToCalendarDate(
  state: CalendarState
): CalendarDate {
  return {
    egyptian: state.selectedDate,
  };
}
