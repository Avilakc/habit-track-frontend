import styles from "./WeekStrip.module.css";

export interface WeekDay {
  date: string;
  done: number | null; // null = future day
}

interface WeekStripProps {
  days: WeekDay[];
  total: number;
  today: string;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

type DayStatus = "full" | "partial" | "none" | "future";

function getStatus(day: WeekDay, total: number): DayStatus {
  if (day.done === null) return "future";
  if (day.done === 0 || total === 0) return "none";
  if (day.done >= total) return "full";
  return "partial";
}

function getStatusText(day: WeekDay, total: number): string {
  switch (getStatus(day, total)) {
    case "future":
      return "Upcoming";
    case "none":
      return "No habits done";
    case "full":
      return "All habits done";
    case "partial":
      return `${day.done} of ${total} done`;
  }
}

export default function WeekStrip({ days, total, today }: WeekStripProps) {
  return (
    <section className={styles.card} aria-labelledby="week-title">
      <h2 id="week-title" className={styles.title}>
        This week
      </h2>

      <ol className={styles.days}>
        {days.map((day, index) => (
          <li
            key={day.date}
            className={styles.day}
            data-status={getStatus(day, total)}
            aria-current={day.date === today ? "date" : undefined}
          >
            <span className={styles.label}>{DAY_LABELS[index]}</span>
            <span className={styles.number}>{Number(day.date.slice(8))}</span>
            <span className={styles.dot} aria-hidden="true" />
            <span className="sr-only">{getStatusText(day, total)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
