import { parse, compareAsc, isAfter, format } from "date-fns";

export const sortDateStrings = (datesArray: string[]): string[] => {
  if (!datesArray || datesArray.length === 0) {
    return [];
  }

  return [...datesArray].sort((dateA, dateB) => {
    const parsedDateA = parse(dateA, "dd-MM-yyyy", new Date());
    const parsedDateB = parse(dateB, "dd-MM-yyyy", new Date());

    return compareAsc(parsedDateA, parsedDateB);
  });
};

export const ensureLatestDate = (
  currentDate: string,
  historyDates: string[],
): string => {
  if (!currentDate || !historyDates || historyDates.length === 0) {
    return currentDate;
  }
  const parsedCurrentDate = parse(currentDate, "dd-MM-yyyy", new Date());

  let latestHistoryDate = parse(historyDates[0], "dd-MM-yyyy", new Date());

  for (const dateStr of historyDates) {
    const parsedDate = parse(dateStr, "dd-MM-yyyy", new Date());
    if (isAfter(parsedDate, latestHistoryDate)) {
      latestHistoryDate = parsedDate;
    }
  }

  if (isAfter(parsedCurrentDate, latestHistoryDate)) {
    return currentDate;
  } else {
    return format(latestHistoryDate, "dd-MM-yyyy");
  }
};
