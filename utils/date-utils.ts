const formatDateWithOptions = (
  dateString: string,
  options: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};

export const formatMonthYear = (dateString: string): string =>
  formatDateWithOptions(dateString, {
    month: "short",
    year: "numeric",
  });

export const formatFullDate = (dateString: string): string =>
  formatDateWithOptions(dateString, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateRange = (
  startDateString?: string,
  endDateString?: string
): string => {
  if (!startDateString) return "";

  const startDate = formatMonthYear(startDateString);
  const endDate = endDateString ? formatMonthYear(endDateString) : "Now";

  return `${startDate} - ${endDate}`;
};

export const formatFullDateRange = (
  startDateString?: string,
  endDateString?: string
): string => {
  if (!startDateString) return "";

  const startDate = formatFullDate(startDateString);
  const endDate = endDateString ? formatFullDate(endDateString) : "Now";

  return `${startDate} - ${endDate}`;
};
