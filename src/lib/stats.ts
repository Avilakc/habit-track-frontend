import { Habit, LogEntry } from "./api";

// 0 = nothing done, 4 = everything done
export type DayLevel = 0 | 1 | 2 | 3 | 4;

export interface DayStat {
  date: string;
  done: number | null; // null = future day
  level: DayLevel | null;
}

export interface HabitStat {
  id: string;
  name: string;
  icon: string | null;
  streak: number;
  doneDays: number;
  rate: number; // 0–100
}

export interface MonthStats {
  days: DayStat[];
  elapsedDays: number;
  completionRate: number;
  perfectDays: number;
  bestStreak: number;
  habits: HabitStat[];
}

function getLevel(done: number, total: number): DayLevel {
  if (total === 0 || done === 0) return 0;

  const ratio = done / total;
  if (ratio >= 1) return 4;
  if (ratio >= 2 / 3) return 3;
  if (ratio >= 1 / 3) return 2;
  return 1;
}

function toPercent(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

export function buildMonthStats(
  habits: Habit[],
  logs: LogEntry[],
  monthDates: string[],
  today: string,
): MonthStats {
  const total = habits.length;
  const habitIds = new Set(habits.map((habit) => habit.id));

  // Ignore logs from deleted habits and from future dates
  const validLogs = logs.filter(
    (log) => habitIds.has(log.habitId) && log.date <= today,
  );

  // Count everything in a single pass over the logs
  const doneByDate = new Map<string, number>();
  const doneByHabit = new Map<string, number>();

  for (const log of validLogs) {
    doneByDate.set(log.date, (doneByDate.get(log.date) ?? 0) + 1);
    doneByHabit.set(log.habitId, (doneByHabit.get(log.habitId) ?? 0) + 1);
  }

  const days: DayStat[] = monthDates.map((date) => {
    if (date > today) return { date, done: null, level: null };

    const done = doneByDate.get(date) ?? 0;
    return { date, done, level: getLevel(done, total) };
  });

  const elapsedDays = days.filter((day) => day.done !== null).length;

  const habitStats: HabitStat[] = habits
    .map((habit) => {
      const doneDays = doneByHabit.get(habit.id) ?? 0;
      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        streak: habit.streak,
        doneDays,
        rate: toPercent(doneDays, elapsedDays),
      };
    })
    // Highest rate first; ties broken by the longer streak
    .sort((a, b) => b.rate - a.rate || b.streak - a.streak);

  return {
    days,
    elapsedDays,
    completionRate: toPercent(validLogs.length, total * elapsedDays),
    perfectDays: days.filter((day) => total > 0 && day.done === total).length,
    bestStreak: habits.reduce((max, habit) => Math.max(max, habit.streak), 0),
    habits: habitStats,
  };
}
