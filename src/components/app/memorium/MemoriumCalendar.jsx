import React, { useEffect, useMemo, useState } from "react";
import {useAsyncMemo} from "use-async-memo"
import AppNavbar from "../../ui/AppNavbar";
import SelectMonthForm from "./SelectMonthForm";
import { useNavigate } from "react-router-dom";
import { daysOfWeek } from "../../../datas/date";
import { checkArtilesByDateService } from "../../../services/article";
import Skeleton from 'react-loading-skeleton'

// todo: migrate in utils
const getNaturalMonth = (date) => date.getMonth();

const MemoriumCalendar = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(getNaturalMonth(today));
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  // todo: translator date to text form as "Dec 2022" and the reverse

  const firstMonthDay = useMemo(
    () => new Date(selectedYear, selectedMonth, 1),
    [selectedMonth, selectedYear]
  );

  const monthsDate = useAsyncMemo(async () => {
    const monthDate = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    const dates = [];
    let datesLine = [];
    const firstDayIndex =
      daysOfWeek.findIndex(
        (day) => day === daysOfWeek[firstMonthDay.getDay()]
      ) + 1;

    for (let i = 0; i < firstDayIndex - 1; i++) {
      datesLine.push({
        id: null,
        haveArticle: false
      });
    }

    for (let cpt = firstDayIndex; cpt < monthDate + firstDayIndex; cpt++) {
      const isDateValid =  cpt > monthDate + firstDayIndex === false

      if(isDateValid) {
        const format =  selectedYear +
          "-" +
          (selectedMonth + 1).toString().padStart(2, "0") +
          "-" +
          (cpt - firstDayIndex + 1).toString().padStart(2, "0")
          console.log("format", format)
        const haveArticle = await checkArtilesByDateService(format)
        datesLine.push(
          cpt > monthDate + firstDayIndex ? null : {id: cpt - firstDayIndex + 1, haveArticle: haveArticle}
        );
      } else {
        datesLine.push({
          id: null,
          haveArticle: false
        })
      }
      

      if (cpt % 7 === 0 || cpt + 1 === monthDate + firstDayIndex) {
        if (cpt + 1 === monthDate + firstDayIndex) {
          while (datesLine.length < 7) {
            datesLine.push({
              id: null,
              haveArticle: false
            }); // Remplir les éléments manquants avec `null`.
          }
        }
        dates.push(datesLine);
        datesLine = [];
      }
    }

    console.log("dates: ", dates)
    setLoading(false)
    return dates;
  }, [firstMonthDay, selectedMonth, selectedYear]);

  useEffect(() => {
    setLoading(true)
  }, [selectedMonth, selectedYear]);

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
            {monthsDate && !loading ? monthsDate.map((week) => (
              <tr>
                {week.map((day) => (
                  <td
                    className={`p-1 text-center hover:bg-slate-100 cursor-pointer select-none ${
                      day.id ? "" : "bg-slate-200"
                    }`}
                    onClick={() => {
                      if (day.id) {
                        navigate(
                          `/memorium/${day.id.toString().padStart(2, "0")}-${(
                            selectedMonth + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${selectedYear}`
                        );
                      }
                    }}
                  >
                    <div className={`${day.haveArticle ? "border border-primary hover:bg-blue-100": ""} rounded-md p-2 hover:bg-blue-50`}>
                    {day.id}

                    </div>
                  </td>
                ))}
              </tr>
            )): [0, 1, 2, 4].map(line => (
              <tr className="">
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <td>
                    <Skeleton height={50} />
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
