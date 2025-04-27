export const getProjectPeriod = (startDateString?: string, endDateString?: string) => {
  if (!startDateString) return "";

  const startDate = formatDate(startDateString);
  const endDate = endDateString ? formatDate(endDateString) : "Now";

  return `${startDate} - ${endDate}`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};