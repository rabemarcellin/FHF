import { monthsForRender } from "../datas/date";

export const parseKeywordForMonthSearch = (text) => {
  const normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return normalizedText.match(/\b\w+[-']?\w*\b/g);
};

export const formatMonth = (monthIndex, year) =>
  `${monthsForRender.at(monthIndex)} ${year}`;

export const isSearchFormatValid = (text) => {
  const searchRegex = /^[a-zA-ZÀ-ÿ]+(?: [a-zA-ZÀ-ÿ]+)? \d{4}$/;
  return searchRegex.test(text.trim());
};

/**
 *
 * @param {*} date
 * @returns { day, month, year }
 */
export const convertDate = (date) => {
  const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = date.match(regex);

  if (match) {
    const day = parseInt(match[1], 10); // Premier groupe : le jour
    const month = parseInt(match[2], 10); // Deuxième groupe : le mois
    const year = parseInt(match[3], 10); // Troisième groupe : l'année

    return { day, month, year }; // Affiche : 1 1 2025
  } else {
    return;
  }
};
