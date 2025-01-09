import React, { useEffect, useMemo, useState } from "react";
import AppNavbar from "./AppNavbar";
import SelectMonthForm from "./SelectMonthForm";
import { useNavigate } from "react-router-dom";
import { daysOfWeek } from "../datas/date";

// todo: migrate in utils
const getNaturalMonth = (date) => date.getMonth();

const MemoriumCalendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(getNaturalMonth(today));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  // todo: translator date to text form as "Dec 2022" and the reverse

  const firstMonthDay = useMemo(
    () => new Date(selectedYear, selectedMonth, 1),
    [selectedMonth, selectedYear]
  );

  const monthsDate = useMemo(() => {
    const monthDate = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const dates = [];
    let datesLine = [];
    const firstDayIndex =
      daysOfWeek.findIndex(
        (day) => day === daysOfWeek[firstMonthDay.getDay()]
      ) + 1;

    for (let i = 0; i < firstDayIndex - 1; i++) {
      datesLine.push(null);
    }

    for (let cpt = firstDayIndex; cpt < monthDate + firstDayIndex; cpt++) {
      datesLine.push(
        cpt > monthDate + firstDayIndex ? null : cpt - firstDayIndex + 1
      );
      if (cpt % 7 === 0 || cpt + 1 === monthDate + firstDayIndex) {
        if (cpt + 1 === monthDate + firstDayIndex) {
          while (datesLine.length < 7) {
            console.log();
            datesLine.push(null); // Remplir les éléments manquants avec `null`.
          }
        }
        dates.push(datesLine);
        datesLine = [];
      }
    }

    return dates;
  }, [firstMonthDay]);

  useEffect(() => {}, [selectedMonth, selectedYear]);

  return (
    <div>
      <AppNavbar />
      <div className="flex items-center justify-center my-4">
        <button
          onClick={() => {
            if (selectedMonth > 1) {
              setSelectedMonth(selectedMonth - 1);
            } else {
              setSelectedMonth(11);
              setSelectedYear(selectedYear - 1);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <SelectMonthForm
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />
        <button
          onClick={() => {
            if (selectedMonth < 11) {
              setSelectedMonth(selectedMonth + 1);
            } else {
              setSelectedMonth(0);
              setSelectedYear(selectedYear + 1);
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>

      <div className="min-w-96 overflow-x-auto my-4 max-w-3xl mx-auto shadow">
        <table className="border-collapse border w-full">
          <thead>
            <tr className="border-b">
              {daysOfWeek.map((day) => (
                <th className="p-2" key={day}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthsDate.map((week) => (
              <tr>
                {week.map((day) => (
                  <td
                    className={`p-2 text-center hover:bg-slate-100 cursor-pointer select-none ${
                      day ? "" : "bg-slate-200"
                    }`}
                    onClick={() => {
                      console.log(day, selectedMonth + 1, selectedYear);
                      if (day) {
                        navigate(
                          `/memorium/${day.toString().padStart(2, "0")}-${(
                            selectedMonth + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${selectedYear}`
                        );
                      }
                    }}
                  >
                    {day}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemoriumCalendar;
