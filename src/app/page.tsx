import styles from "./page.module.css";
import { apiFetch, Habit, LogEntry } from "@/lib/api";
import { formatLongDate, getTodayDateString, getWeekDates } from "@/lib/date";
import HabitList from "@/components/HabitList";
import AddHabitForm from "@/components/AddHabitForm";
import QuoteBanner from "@/components/QuoteBanner";

export default async function Home() {
  const weekDates = getWeekDates(getTodayDateString());

  // Both requests are independent, so they run at the same time
  const [habits, weekLogs] = await Promise.all([
    apiFetch<Habit[]>("/habits"),
    apiFetch<LogEntry[]>(`/logs?from=${weekDates[0]}&to=${weekDates[6]}`),
  ]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.date}>{formatLongDate(new Date())}</span>
          <h1 className={styles.title}>Today</h1>
        </div>
        <AddHabitForm />
      </header>

      <HabitList
        key={habits.map((habit) => habit.id).join("-")}
        initialHabits={habits}
        weekLogs={weekLogs}
      >
        <QuoteBanner />
      </HabitList>
    </div>
  );
}
