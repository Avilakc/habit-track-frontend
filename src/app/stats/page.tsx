import type { Metadata } from "next";
import styles from "./page.module.css";
import { apiFetch, Habit, LogEntry } from "@/lib/api";
import {
  formatMonthLabel,
  getMonthDates,
  getTodayDateString,
} from "@/lib/date";
import { buildMonthStats } from "@/lib/stats";
import MonthHeatmap from "@/components/MonthHeatmap";
import HabitStatsList from "@/components/HabitStatsList";

export const metadata: Metadata = {
  title: "Stats · habit-track",
};

export default async function StatsPage() {
  const today = getTodayDateString();
  const monthDates = getMonthDates(today);

  const [habits, logs] = await Promise.all([
    apiFetch<Habit[]>("/habits"),
    apiFetch<LogEntry[]>(
      `/logs?from=${monthDates[0]}&to=${monthDates[monthDates.length - 1]}`,
    ),
  ]);

  const stats = buildMonthStats(habits, logs, monthDates, today);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>{formatMonthLabel(today)}</span>
        <h1 className={styles.title}>Stats</h1>
      </header>

      <dl className={styles.summary}>
        <div className={styles.stat}>
          <dt>Completion</dt>
          <dd>{stats.completionRate}%</dd>
        </div>
        <div className={styles.stat}>
          <dt>Perfect days</dt>
          <dd>{stats.perfectDays}</dd>
        </div>
        <div className={styles.stat}>
          <dt>Best streak</dt>
          <dd>{stats.bestStreak}</dd>
        </div>
      </dl>

      <div className={styles.content}>
        <MonthHeatmap days={stats.days} total={habits.length} today={today} />
        <HabitStatsList habits={stats.habits} elapsedDays={stats.elapsedDays} />
      </div>
    </div>
  );
}
