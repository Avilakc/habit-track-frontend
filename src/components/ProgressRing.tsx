import styles from "./ProgressRing.module.css";

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
  done: number;
  total: number;
}

function getMessage(done: number, total: number): string {
  if (total === 0) return "Add your first habit to get started.";

  const left = total - done;
  if (left === 0) return "Perfect day. Your streak is safe.";

  return `${left} ${left === 1 ? "habit" : "habits"} left to keep your streak going.`;
}

export default function ProgressRing({ done, total }: ProgressRingProps) {
  const progress = total === 0 ? 0 : done / total;
  const offset = CIRCUMFERENCE * (1 - progress);
  const percent = Math.round(progress * 100);

  return (
    <section className={styles.card} aria-label="Today's progress">
      <div className={styles.ring}>
        <svg viewBox="0 0 76 76" className={styles.svg} aria-hidden="true">
          <circle cx="38" cy="38" r={RADIUS} className={styles.track} />
          <circle
            cx="38"
            cy="38"
            r={RADIUS}
            className={styles.fill}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            // round line caps draw a dot even at 0% — hide it
            style={{ opacity: progress === 0 ? 0 : 1 }}
          />
        </svg>
        <span className={styles.percent}>{percent}%</span>
      </div>

      <div className={styles.text}>
        <p className={styles.count}>
          {done} of {total} done
        </p>
        <p className={styles.message}>{getMessage(done, total)}</p>
      </div>
    </section>
  );
}
