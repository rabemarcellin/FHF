import React, { memo, useEffect, useState } from "react";
import { months, monthsForRender } from "../datas/date";
import {
  formatMonth,
  isSearchFormatValid,
  parseKeywordForMonthSearch,
} from "../helpers/date-utils";

// todo: move into utils

const SelectMonthForm = ({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) => {
  const [inputValue, setInputValue] = useState(
    formatMonth(selectedMonth, selectedYear)
  );
  const [suggests, setSuggests] = useState([]);
  const yearRegex = /^\d{4}$/;

  const searchMonth = (text) => {
    console.log(text, "text");
    const keywords = parseKeywordForMonthSearch(text).map((key) =>
      key.toLowerCase()
    );

    const year = keywords.find((key) => yearRegex.test(key));
    const monthsFound = keywords
      .filter((key) => months.find((month) => month.includes(key)))
      .map((key) => months.filter((month) => month.includes(key)));

    const monthsClean = [...new Set([].concat(...monthsFound))];

    const monthsIndex = monthsClean
      ? monthsClean.map((each) => months.indexOf(each))
      : [];

    return { monthsIndex, year };
  };

  const parseMonthValue = (str) => {
    // Supprimer les espaces inutiles (avant, après et entre) et laisser au plus un espace
    const cleanedStr = str.trim().replace(/\s+/g, " ");

    const [month, year] = cleanedStr.split(" "); // Sépare le mois et l'année
    return { month: monthsForRender.findIndex((m) => m === month), year }; // Vérifie la validité du mois et de l'année
  };

  useEffect(() => {
    setInputValue(formatMonth(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  return (
    <form
      action=""
      className="relative"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        type="text"
        value={inputValue}
        className="text-center"
        onChange={(event) => {
          const value = event.target.value;
          setInputValue(value);

          if (!isSearchFormatValid(value)) {
            setSuggests([]);
            return;
          }

          const { monthsIndex, year } = searchMonth(value);

          if (monthsIndex.length > 0 && year) {
            setSuggests(
              monthsIndex.map((monthIndex) => formatMonth(monthIndex, year))
            );
          }
        }}
      />
      {suggests.length > 0 && (
        <div className="absolute top-0 left-0 p-2 translate-y-8 border w-full shadow-md bg-white">
          {suggests.map((suggest) => (
            <div
              className="hover:bg-slate-100 active:bg-slate-200 cursor-pointer select-none "
              onClick={(e) => {
                setInputValue(suggest);
                const { month, year } = parseMonthValue(suggest);
                setSelectedMonth(month);
                setSelectedYear(parseInt(year));
                setSuggests([]);
              }}
            >
              {suggest}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default SelectMonthForm;
