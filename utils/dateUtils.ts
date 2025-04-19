import { parse, compareAsc, isAfter, format } from "date-fns";

export const sortDateStrings = (datesArray: string[]): string[] => {
  if (!datesArray || datesArray.length === 0) {
    return [];
  }

  return [...datesArray].sort((dateA, dateB) => {
    const parsedDateA = parse(dateA, "yyyy-MM-dd", new Date());
    const parsedDateB = parse(dateB, "yyyy-MM-dd", new Date());

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
  const parsedCurrentDate = parse(currentDate, "yyyy-MM-dd", new Date());

  let latestHistoryDate = parse(historyDates[0], "yyyy-MM-dd", new Date());

  for (const dateStr of historyDates) {
    const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
    if (isAfter(parsedDate, latestHistoryDate)) {
      latestHistoryDate = parsedDate;
    }
  }

  if (isAfter(parsedCurrentDate, latestHistoryDate)) {
    return currentDate;
  } else {
    return format(latestHistoryDate, "yyyy-MM-dd");
  }
};

export const parseDate = (
  dateString: string | null,
  format: string = "yyyy-MM-dd",
): Date | null => {
  if (!dateString) return null;
  return parse(dateString, format, new Date());
};
