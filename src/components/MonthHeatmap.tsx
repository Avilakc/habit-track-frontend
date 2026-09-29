import { DayStat } from "@/lib/stats";
import { getDaysSinceMonday } from "@/lib/date";
import styles from "./MonthHeatmap.module.css";

interface MonthHeatmapProps {
  days: DayStat[];
  total: number;
  today: string;
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const LEGEND_LEVELS = [0, 1, 2, 3, 4];

function getDayLabel(day: DayStat, total: number): string {
  const dayNumber = Number(day.date.slice(8));
  if (day.done === null) return `Day ${dayNumber}: upcoming`;
  return `Day ${dayNumber}: ${day.done} of ${total} habits done`;
}

export default function MonthHeatmap({
  days,
  total,
  today,
}: MonthHeatmapProps) {
  // Empty cells so day 1 lands under the right weekday
  const leadingBlanks = getDaysSinceMonday(days[0].date);

  return (
    <section className={styles.card} aria-labelledby="heatmap-title">
      <h2 id="heatmap-title" className={styles.title}>
        Month overview
      </h2>

      <div className={styles.grid}>
        {WEEKDAYS.map((weekday, index) => (
          <span
            key={`weekday-${index}`}
            className={styles.weekday}
            aria-hidden="true"
          >
            {weekday}
          </span>
        ))}

        {Array.from({ length: leadingBlanks }, (_, index) => (
          <span key={`blank-${index}`} aria-hidden="true" />
        ))}

        {days.map((day) => (
          <span
            key={day.date}
            className={styles.cell}
            data-level={day.level ?? "future"}
            aria-current={day.date === today ? "date" : undefined}
          >
            <span aria-hidden="true">{Number(day.date.slice(8))}</span>
            <span className="sr-only">{getDayLabel(day, total)}</span>
          </span>
        ))}
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span>Less</span>
        {LEGEND_LEVELS.map((level) => (
          <span
            key={level}
            className={`${styles.cell} ${styles.swatch}`}
            data-level={level}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
