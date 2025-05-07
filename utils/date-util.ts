export const formatDateWithOptions = (
  dateString: string,
  locale: string,
  options: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, options);
};

export const formatMonthYear = (dateString: string, locale: string): string =>
  formatDateWithOptions(dateString, locale, {
    month: "short",
    year: "numeric",
  });

export const formatFullDate = (dateString: string, locale: string): string =>
  formatDateWithOptions(dateString, locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getNowText = (locale: string): string => {
  switch (locale) {
    case "ko":
      return "현재";
    default:
      return "Now";
  }
};

export const formatDateRange = (
  startDateString?: string,
  endDateString?: string,
  locale: string = "en"
): string => {
  if (!startDateString) return "";

  const startDate = formatMonthYear(startDateString, locale);
  const endDate = endDateString ? formatMonthYear(endDateString, locale) : getNowText(locale);

  return `${startDate} - ${endDate}`;
};

export const formatFullDateRange = (
  startDateString?: string,
  endDateString?: string,
  locale: string = "en"
): string => {
  if (!startDateString) return "";

  const startDate = formatFullDate(startDateString, locale);
  const endDate = endDateString ? formatFullDate(endDateString, locale) : getNowText(locale);

  return `${startDate} - ${endDate}`;
};
