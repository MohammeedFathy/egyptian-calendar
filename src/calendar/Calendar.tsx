import {
  useMemo,
  useState,
} from "react";

import {
  addDays,
  getEgyptianMonths,
} from "./calendarEngine";

import {
  previousDay,
  nextDay,
  previousMonth,
  nextMonth,
  previousYear,
  nextYear,
  todayState,
} from "./calendarState";

import {
  createEgyptianMonthView,
  createEpagomenalView,
} from "./calendarView";

import {
  formatEgyptianDate,
  formatGregorianDate,
  formatEgyptianDay,
} from "./calendarFormatter";

import type {
  EgyptianDate,
} from "./types";

import "./Calendar.css";

/*
 * ==============================
 * Helpers
 * ==============================
 */

function isSameDate(
  first: EgyptianDate,
  second: EgyptianDate
): boolean {
  if (
    first.year !== second.year
  ) {
    return false;
  }

  if (
    first.isEpagomenal !==
    second.isEpagomenal
  ) {
    return false;
  }

  if (
    first.isEpagomenal &&
    second.isEpagomenal
  ) {
    return (
      first.epagomenalDay ===
      second.epagomenalDay
    );
  }

  return (
    first.month === second.month &&
    first.day === second.day
  );
}

/*
 * ==============================
 * Calendar
 * ==============================
 */

function Calendar() {
  /*
   * ==============================
   * Initial State
   * ==============================
   */

  const initialState =
    useMemo(
      () => todayState(),
      []
    );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<EgyptianDate>(
    initialState.selectedDate
  );

  /*
   * ==============================
   * Gregorian Date
   * ==============================
   *
   * يتم تحديث التاريخ مع كل render.
   */

  const gregorianDate =
    useMemo(() => {
      const now =
        new Date();

      return {
        year:
          now.getFullYear(),
        month:
          now.getMonth() + 1,
        day:
          now.getDate(),
      };
    }, []);

  /*
   * ==============================
   * Egyptian Months
   * ==============================
   */

  const egyptianMonths =
    useMemo(
      () => getEgyptianMonths(),
      []
    );

  /*
   * ==============================
   * Month View
   * ==============================
   */

  const monthDays =
    useMemo(() => {
      if (
        selectedDate.isEpagomenal
      ) {
        return [];
      }

      return createEgyptianMonthView(
        selectedDate.year,
        selectedDate.month
      );
    }, [
      selectedDate.year,
      selectedDate.month,
      selectedDate.isEpagomenal,
    ]);

  /*
   * ==============================
   * Epagomenal View
   * ==============================
   */

  const epagomenalDays =
    useMemo(
      () =>
        createEpagomenalView(
          selectedDate.year
        ),
      [
        selectedDate.year,
      ]
    );

  /*
   * ==============================
   * Season Class
   * ==============================
   */

  const seasonClass =
    selectedDate.isEpagomenal
      ? "season-epagomenal"
      : `season-${selectedDate.season.toLowerCase()}`;

  /*
   * ==============================
   * State Helper
   * ==============================
   */

  function applyState(
    state: {
      selectedDate: EgyptianDate;
    }
  ): void {
    setSelectedDate(
      state.selectedDate
    );
  }

  /*
   * ==============================
   * Date Selection
   * ==============================
   */

  function selectDate(
    date: EgyptianDate
  ): void {
    setSelectedDate(date);
  }

  /*
   * ==============================
   * Today
   * ==============================
   */

  function goToday(): void {
    applyState(
      todayState()
    );
  }

  /*
   * ==============================
   * Navigation
   * ==============================
   */

  function goPreviousDay(): void {
    applyState(
      previousDay({
        selectedDate,
      })
    );
  }

  function goNextDay(): void {
    applyState(
      nextDay({
        selectedDate,
      })
    );
  }

  function goPreviousMonth(): void {
    applyState(
      previousMonth({
        selectedDate,
      })
    );
  }

  function goNextMonth(): void {
    applyState(
      nextMonth({
        selectedDate,
      })
    );
  }

  function goPreviousYear(): void {
    applyState(
      previousYear({
        selectedDate,
      })
    );
  }

  function goNextYear(): void {
    applyState(
      nextYear({
        selectedDate,
      })
    );
  }

  /*
   * ==============================
   * Month Selection
   * ==============================
   */

  function selectMonth(
    year: number,
    month: number
  ): void {
    if (
      month < 1 ||
      month > 12
    ) {
      return;
    }

    const monthStart =
      createEgyptianMonthView(
        year,
        month
      )[0];

    if (!monthStart) {
      return;
    }

    /*
     * عند اختيار شهر من الأيام النسئية
     * نبدأ من اليوم الأول.
     */

    const targetDay =
      selectedDate.isEpagomenal
        ? 1
        : Math.min(
            selectedDate.day,
            30
          );

    const targetDate =
      addDays(
        monthStart.date,
        targetDay - 1
      );

    setSelectedDate(
      targetDate
    );
  }

  /*
   * ==============================
   * Season Months
   * ==============================
   */

  const akhetMonths =
    egyptianMonths.filter(
      (month) =>
        month.season === "Akhet"
    );

  const peretMonths =
    egyptianMonths.filter(
      (month) =>
        month.season === "Peret"
    );

  const shemuMonths =
    egyptianMonths.filter(
      (month) =>
        month.season === "Shemu"
    );

  /*
   * ==============================
   * Render
   * ==============================
   */

  return (
    <main
      className={`calendar ${seasonClass}`}
    >

      {/* =========================
          Hero
          ========================= */}

      <section className="calendar-hero">

        <div className="calendar-hero-symbol">
          ☥
        </div>

        <div className="calendar-hero-season">

          <span className="season-line" />

          <span>
            {selectedDate.season}
          </span>

          <span className="season-line" />

        </div>

        <p className="calendar-hero-year">
          Egyptian Year{" "}
          {selectedDate.year}
        </p>

        <div className="calendar-hero-date">

          <strong className="calendar-hero-day">
            {selectedDate.isEpagomenal
              ? selectedDate.epagomenalDay
              : selectedDate.day}
          </strong>

          <div className="calendar-hero-month">

            <h1>
              {selectedDate.monthName}
            </h1>

            <span>
              {selectedDate.isEpagomenal
                ? "Epagomenal Day"
                : `Month ${selectedDate.month}`}
            </span>

          </div>

        </div>

        <p className="calendar-hero-day-of-year">
          {formatEgyptianDay(
            selectedDate
          )}
        </p>

      </section>

      {/* =========================
          Selected Date
          ========================= */}

      <section className="calendar-selected-date">

        <div className="date-card">

          <span>
            Egyptian Date
          </span>

          <strong>
            {formatEgyptianDate(
              selectedDate
            )}
          </strong>

        </div>

        <div className="date-card">

          <span>
            Gregorian Date
          </span>

          <strong>
            {formatGregorianDate(
              gregorianDate
            )}
          </strong>

        </div>

      </section>

      {/* =========================
          Navigation
          ========================= */}

      <nav className="calendar-navigation">

        <div className="calendar-navigation-group">

          <button
            type="button"
            onClick={goPreviousYear}
            aria-label="Previous Egyptian year"
          >
            «
          </button>

          <button
            type="button"
            onClick={goPreviousMonth}
            aria-label="Previous Egyptian month"
          >
            ‹
          </button>

        </div>

        <button
          type="button"
          className="calendar-today-button"
          onClick={goToday}
        >
          Today
        </button>

        <div className="calendar-navigation-group">

          <button
            type="button"
            onClick={goNextMonth}
            aria-label="Next Egyptian month"
          >
            ›
          </button>

          <button
            type="button"
            onClick={goNextYear}
            aria-label="Next Egyptian year"
          >
            »
          </button>

        </div>

      </nav>

      {/* =========================
          Year
          ========================= */}

      <section className="calendar-year">

        <header className="calendar-year-header">

          <div>

            <span>
              Egyptian Calendar
            </span>

            <h2>
              Year {selectedDate.year}
            </h2>

          </div>

          <span>
            365 Days
          </span>

        </header>

        <div className="calendar-seasons">

          {/* Akhet */}

          <section className="calendar-season-group">

            <h3>
              Akhet
            </h3>

            <div className="calendar-month-list">

              {akhetMonths.map(
                (month) => (
                  <button
                    key={month.number}
                    type="button"
                    className={
                      !selectedDate.isEpagomenal &&
                      selectedDate.month ===
                        month.number
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      selectMonth(
                        selectedDate.year,
                        month.number
                      )
                    }
                  >

                    <span>
                      {month.number}
                    </span>

                    <strong>
                      {month.name}
                    </strong>

                  </button>
                )
              )}

            </div>

          </section>

          {/* Peret */}

          <section className="calendar-season-group">

            <h3>
              Peret
            </h3>

            <div className="calendar-month-list">

              {peretMonths.map(
                (month) => (
                  <button
                    key={month.number}
                    type="button"
                    className={
                      !selectedDate.isEpagomenal &&
                      selectedDate.month ===
                        month.number
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      selectMonth(
                        selectedDate.year,
                        month.number
                      )
                    }
                  >

                    <span>
                      {month.number}
                    </span>

                    <strong>
                      {month.name}
                    </strong>

                  </button>
                )
              )}

            </div>

          </section>

          {/* Shemu */}

          <section className="calendar-season-group">

            <h3>
              Shemu
            </h3>

            <div className="calendar-month-list">

              {shemuMonths.map(
                (month) => (
                  <button
                    key={month.number}
                    type="button"
                    className={
                      !selectedDate.isEpagomenal &&
                      selectedDate.month ===
                        month.number
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      selectMonth(
                        selectedDate.year,
                        month.number
                      )
                    }
                  >

                    <span>
                      {month.number}
                    </span>

                    <strong>
                      {month.name}
                    </strong>

                  </button>
                )
              )}

            </div>

          </section>

        </div>

      </section>

      {/* =========================
          Current Month
          ========================= */}

      {!selectedDate.isEpagomenal && (
        <section className="calendar-month">

          <header className="calendar-month-header">

            <div>

              <span>
                Egyptian Month
              </span>

              <h2>
                {selectedDate.monthName}
              </h2>

            </div>

            <span>
              {selectedDate.season}
            </span>

          </header>

          <div className="calendar-grid">

            {monthDays.map(
              ({ date }) => {

                const selected =
                  isSameDate(
                    date,
                    selectedDate
                  );

                return (
                  <button
                    key={`${date.year}-${date.month}-${date.day}`}
                    type="button"
                    className={`calendar-day ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectDate(
                        date
                      )
                    }
                  >

                    <span>
                      {date.day}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        </section>
      )}

      {/* =========================
          Epagomenal Days
          ========================= */}

      <section className="calendar-epagomenal">

        <header>

          <span>
            End of the Egyptian Year
          </span>

          <h2>
            Epagomenal Days
          </h2>

        </header>

        <div className="epagomenal-grid">

          {epagomenalDays.map(
            ({ date }) => {

              const selected =
                isSameDate(
                  date,
                  selectedDate
                );

              return (
                <button
                  key={`${date.year}-epagomenal-${date.epagomenalDay}`}
                  type="button"
                  className={`epagomenal-day ${
                    selected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    selectDate(
                      date
                    )
                  }
                >

                  <span>
                    {date.epagomenalDay}
                  </span>

                  <strong>
                    {date.monthName}
                  </strong>

                </button>
              );
            }
          )}

        </div>

      </section>

      {/* =========================
          Day Navigation
          ========================= */}

      <div className="calendar-day-navigation">

        <button
          type="button"
          onClick={goPreviousDay}
        >
          Previous Day
        </button>

        <button
          type="button"
          onClick={goNextDay}
        >
          Next Day
        </button>

      </div>

    </main>
  );
}

export default Calendar;
