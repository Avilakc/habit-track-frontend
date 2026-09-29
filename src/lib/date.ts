// Example output: "Sunday, September 27"
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// Example output: "2026-09-27" — the format the API expects
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// Returns the 7 dates (YYYY-MM-DD) of the week that contains `todayString`, Monday first
export function getWeekDates(todayString: string): string[] {
  const today = new Date(`${todayString}T00:00:00Z`);
  const daysSinceMonday = (today.getUTCDay() + 6) % 7;

  const monday = new Date(today);
  monday.setUTCDate(today.getUTCDate() - daysSinceMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday);
    day.setUTCDate(monday.getUTCDate() + index);
    return day.toISOString().split("T")[0];
  });
}

// Number of days between the given date and the Monday before it (Monday = 0, Sunday = 6)
export function getDaysSinceMonday(dateString: string): number {
  return (new Date(`${dateString}T00:00:00Z`).getUTCDay() + 6) % 7;
}

// Returns every date (YYYY-MM-DD) of the month that contains `todayString`
export function getMonthDates(todayString: string): string[] {
  const [year, month] = todayString.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthPart = String(month).padStart(2, "0");

  return Array.from({ length: daysInMonth }, (_, index) => {
    const dayPart = String(index + 1).padStart(2, "0");
    return `${year}-${monthPart}-${dayPart}`;
  });
}

// Example output: "September 2026"
export function formatMonthLabel(todayString: string): string {
  return new Date(`${todayString}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
