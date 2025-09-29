export function parseDate(date?: string) {
  if (!date) return undefined;
  const [year, month, day] = date.split("-").map(Number);
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${day} ${MONTHS[month - 1]} ${year}`;
}
