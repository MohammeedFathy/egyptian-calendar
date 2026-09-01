import { useEffect, useState } from "react";

import {
  convertGregorianDate,
  convertEgyptianDate,
} from "./calendarEngine";

import type {
  EgyptianDate,
} from "./types";

type ConversionMode =
  | "gregorian-to-egyptian"
  | "egyptian-to-gregorian";

interface CalendarConverterProps {
  egyptianDate: EgyptianDate;
  gregorianDate: {
    year: number;
    month: number;
    day: number;
  };
  onEgyptianDateChange: (
    date: EgyptianDate
  ) => void;
}

function CalendarConverter({
  egyptianDate,
  gregorianDate,
  onEgyptianDateChange,
}: CalendarConverterProps) {
  const [
    mode,
    setMode,
  ] = useState<ConversionMode>(
    "gregorian-to-egyptian"
  );

  const [
    gregorianYear,
    setGregorianYear,
  ] = useState(
    gregorianDate.year
  );

  const [
    gregorianMonth,
    setGregorianMonth,
  ] = useState(
    gregorianDate.month
  );

  const [
    gregorianDay,
    setGregorianDay,
  ] = useState(
    gregorianDate.day
  );

  const [
    egyptianYear,
    setEgyptianYear,
  ] = useState(
    egyptianDate.year
  );

  const [
    egyptianMonth,
    setEgyptianMonth,
  ] = useState(
    egyptianDate.month
  );

  const [
    egyptianDay,
    setEgyptianDay,
  ] = useState(
    egyptianDate.isEpagomenal
      ? egyptianDate.epagomenalDay ?? 1
      : egyptianDate.day
  );

  const [
    conversionError,
    setConversionError,
  ] = useState("");

  /*
   * ==============================
   * Sync Selected Date
   * ==============================
   */

  useEffect(() => {
    setEgyptianYear(
      egyptianDate.year
    );

    setEgyptianMonth(
      egyptianDate.month
    );

    setEgyptianDay(
      egyptianDate.isEpagomenal
        ? egyptianDate.epagomenalDay ?? 1
        : egyptianDate.day
    );
  }, [egyptianDate]);

  useEffect(() => {
    setGregorianYear(
      gregorianDate.year
    );

    setGregorianMonth(
      gregorianDate.month
    );

    setGregorianDay(
      gregorianDate.day
    );
  }, [
    gregorianDate.year,
    gregorianDate.month,
    gregorianDate.day,
  ]);

  /*
   * ==============================
   * Mode
   * ==============================
   */

  function handleModeChange(
    nextMode: ConversionMode
  ) {
    setMode(nextMode);
    setConversionError("");
  }

  /*
   * ==============================
   * Gregorian → Egyptian
   * ==============================
   */

  function handleGregorianConvert() {
    setConversionError("");

    if (
      !Number.isInteger(
        gregorianYear
      ) ||
      !Number.isInteger(
        gregorianMonth
      ) ||
      !Number.isInteger(
        gregorianDay
      )
    ) {
      setConversionError(
        "Please enter a valid Gregorian date."
      );

      return;
    }

    if (
      gregorianMonth < 1 ||
      gregorianMonth > 12
    ) {
      setConversionError(
        "Gregorian month must be between 1 and 12."
      );

      return;
    }

    if (
      gregorianDay < 1 ||
      gregorianDay > 31
    ) {
      setConversionError(
        "Gregorian day must be between 1 and 31."
      );

      return;
    }

    try {
      const result =
        convertGregorianDate(
          gregorianYear,
          gregorianMonth,
          gregorianDay
        );

      const converted =
        result.result.egyptian;

      if (!converted) {
        setConversionError(
          "Unable to convert this Gregorian date."
        );

        return;
      }

      onEgyptianDateChange(
        converted
      );
    } catch {
      setConversionError(
        "Invalid Gregorian date."
      );
    }
  }

  /*
   * ==============================
   * Egyptian → Gregorian
   * ==============================
   */

  function handleEgyptianConvert() {
    setConversionError("");

    if (
      !Number.isInteger(
        egyptianYear
      ) ||
      !Number.isInteger(
        egyptianMonth
      ) ||
      !Number.isInteger(
        egyptianDay
      )
    ) {
      setConversionError(
        "Please enter a valid Egyptian date."
      );

      return;
    }

    if (
      egyptianMonth < 1 ||
      egyptianMonth > 12
    ) {
      setConversionError(
        "Egyptian month must be between 1 and 12."
      );

      return;
    }

    if (
      egyptianDay < 1 ||
      egyptianDay > 30
    ) {
      setConversionError(
        "Egyptian day must be between 1 and 30."
      );

      return;
    }

    try {
      const result: EgyptianDate = {
        year: egyptianYear,
        season:
          egyptianMonth <= 4
            ? "Akhet"
            : egyptianMonth <= 8
              ? "Peret"
              : "Shemu",
        month: egyptianMonth,
        monthName: "",
        day: egyptianDay,
        dayOfYear:
          (egyptianMonth - 1) * 30 +
          egyptianDay,
        isEpagomenal: false,
      };

      const converted =
        convertEgyptianDate(
          result
        );

      if (!converted) {
        setConversionError(
          "Unable to convert this Egyptian date."
        );

        return;
      }

      onEgyptianDateChange(
        result
      );
    } catch {
      setConversionError(
        "Invalid Egyptian date."
      );
    }
  }

  /*
   * ==============================
   * Render
   * ==============================
   */

  return (
    <section className="calendar-converter">
      <header className="calendar-converter-header">
        <span>
          Calendar Converter
        </span>

        <h2>
          Convert a Date
        </h2>
      </header>

      <div className="calendar-converter-mode">
        <button
          type="button"
          className={
            mode ===
            "gregorian-to-egyptian"
              ? "active"
              : ""
          }
          onClick={() =>
            handleModeChange(
              "gregorian-to-egyptian"
            )
          }
        >
          Gregorian → Egyptian
        </button>

        <button
          type="button"
          className={
            mode ===
            "egyptian-to-gregorian"
              ? "active"
              : ""
          }
          onClick={() =>
            handleModeChange(
              "egyptian-to-gregorian"
            )
          }
        >
          Egyptian → Gregorian
        </button>
      </div>

      {mode ===
        "gregorian-to-egyptian" && (
        <div className="calendar-converter-body">
          <div className="calendar-converter-fields">
            <label className="calendar-converter-field">
              <span>
                Year
              </span>

              <input
                type="number"
                value={
                  gregorianYear
                }
                onChange={(event) =>
                  setGregorianYear(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <label className="calendar-converter-field">
              <span>
                Month
              </span>

              <input
                type="number"
                min="1"
                max="12"
                value={
                  gregorianMonth
                }
                onChange={(event) =>
                  setGregorianMonth(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <label className="calendar-converter-field">
              <span>
                Day
              </span>

              <input
                type="number"
                min="1"
                max="31"
                value={
                  gregorianDay
                }
                onChange={(event) =>
                  setGregorianDay(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>
          </div>

          <div className="calendar-converter-arrow">
            →
          </div>

          <div className="calendar-converter-result">
            <span>
              Egyptian Date
            </span>

            <strong>
              {egyptianDate.isEpagomenal
                ? `${egyptianDate.epagomenalDay} ${egyptianDate.monthName} ${egyptianDate.year}`
                : `${egyptianDate.day} ${egyptianDate.monthName} ${egyptianDate.year}`}
            </strong>
          </div>

          <div className="calendar-converter-actions">
            <button
              type="button"
              onClick={
                handleGregorianConvert
              }
            >
              Convert
            </button>
          </div>
        </div>
      )}

      {mode ===
        "egyptian-to-gregorian" && (
        <div className="calendar-converter-body">
          <div className="calendar-converter-fields">
            <label className="calendar-converter-field">
              <span>
                Year
              </span>

              <input
                type="number"
                value={
                  egyptianYear
                }
                onChange={(event) =>
                  setEgyptianYear(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <label className="calendar-converter-field">
              <span>
                Month
              </span>

              <input
                type="number"
                min="1"
                max="12"
                value={
                  egyptianMonth
                }
                onChange={(event) =>
                  setEgyptianMonth(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>

            <label className="calendar-converter-field">
              <span>
                Day
              </span>

              <input
                type="number"
                min="1"
                max="30"
                value={
                  egyptianDay
                }
                onChange={(event) =>
                  setEgyptianDay(
                    Number(
                      event.target.value
                    )
                  )
                }
              />
            </label>
          </div>

          <div className="calendar-converter-arrow">
            →
          </div>

          <div className="calendar-converter-result">
            <span>
              Gregorian Date
            </span>

            <strong>
              {gregorianDate.day} /
              {" "}
              {gregorianDate.month} /
              {" "}
              {gregorianDate.year}
            </strong>
          </div>

          <div className="calendar-converter-actions">
            <button
              type="button"
              onClick={
                handleEgyptianConvert
              }
            >
              Convert
            </button>
          </div>
        </div>
      )}

      {conversionError && (
        <p className="calendar-converter-error">
          {conversionError}
        </p>
      )}
    </section>
  );
}

export default CalendarConverter;