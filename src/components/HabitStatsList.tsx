import { HabitStat } from "@/lib/stats";
import { HabitIcon } from "./Icons";
import styles from "./HabitStatsList.module.css";

interface HabitStatsListProps {
  habits: HabitStat[];
  elapsedDays: number;
}

export default function HabitStatsList({
  habits,
  elapsedDays,
}: HabitStatsListProps) {
  return (
    <section className={styles.card} aria-labelledby="by-habit-title">
      <div className={styles.header}>
        <h2 id="by-habit-title" className={styles.title}>
          By habit
        </h2>
        <span className={styles.hint}>{elapsedDays} days so far</span>
      </div>

      {habits.length === 0 ? (
        <p className={styles.empty}>No habits yet.</p>
      ) : (
        <ul className={styles.list}>
          {habits.map((habit) => (
            <li key={habit.id} className={styles.row}>
              <span className={styles.iconTile}>
                <HabitIcon icon={habit.icon} size={20} />
              </span>

              <div className={styles.info}>
                <div className={styles.topLine}>
                  <span className={styles.name}>{habit.name}</span>
                  <span className={styles.rate}>{habit.rate}%</span>
                </div>

                <div className={styles.bar} aria-hidden="true">
                  <span
                    className={styles.barFill}
                    style={{ width: `${habit.rate}%` }}
                  />
                </div>

                <span className={styles.meta}>
                  {habit.doneDays} of {elapsedDays} days ·{" "}
                  {habit.streak > 0
                    ? `${habit.streak}-day streak`
                    : "No active streak"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
