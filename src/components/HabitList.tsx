"use client";

import { useState } from "react";
import { apiFetch, Habit, LogEntry } from "@/lib/api";
import { getTodayDateString, getWeekDates } from "@/lib/date";
import HabitCard from "./HabitCard";
import ProgressRing from "./ProgressRing";
import WeekStrip, { WeekDay } from "./WeekStrip";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import styles from "./HabitList.module.css";

interface HabitListProps {
  initialHabits: Habit[];
  weekLogs: LogEntry[];
  children?: React.ReactNode;
}

export default function HabitList({
  initialHabits,
  weekLogs,
  children,
}: HabitListProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleToggle(habit: Habit) {
    const today = getTodayDateString();
    setPendingIds((current) => new Set(current).add(habit.id));

    try {
      if (habit.doneToday) {
        await apiFetch(`/habits/${habit.id}/logs/${today}`, {
          method: "DELETE",
        });
      } else {
        await apiFetch(`/habits/${habit.id}/logs`, {
          method: "POST",
          body: JSON.stringify({ date: today }),
        });
      }

      // Replace only the toggled habit, keep every other item untouched
      setHabits((current) =>
        current.map((item) =>
          item.id === habit.id
            ? {
                ...item,
                doneToday: !item.doneToday,
                streak: item.streak + (item.doneToday ? -1 : 1),
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle habit log", err);
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(habit.id);
        return next;
      });
    }
  }

  function handleCancelDelete() {
    setHabitToDelete(null);
    setDeleteError(null);
  }

  async function handleConfirmDelete() {
    if (!habitToDelete) return;

    const deletedId = habitToDelete.id;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiFetch(`/habits/${deletedId}`, { method: "DELETE" });

      // Remove it locally — ring and week strip recalculate from `habits`
      setHabits((current) => current.filter((item) => item.id !== deletedId));
      setHabitToDelete(null);
    } catch (err) {
      console.error("Failed to delete habit", err);
      setDeleteError("Could not delete the habit. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  const doneCount = habits.filter((habit) => habit.doneToday).length;

  const today = getTodayDateString();
  const habitIds = new Set(habits.map((habit) => habit.id));

  const weekDays: WeekDay[] = getWeekDates(today).map((date) => {
    if (date > today) return { date, done: null };
    if (date === today) return { date, done: doneCount }; // live, from state

    // Past days: count server logs, ignoring logs from habits that no longer exist
    const done = weekLogs.filter(
      (log) => log.date === date && habitIds.has(log.habitId),
    ).length;
    return { date, done };
  });

  return (
    <div className={styles.layout}>
      <div className={styles.summary}>
        <ProgressRing done={doneCount} total={habits.length} />
        <WeekStrip days={weekDays} total={habits.length} today={today} />
      </div>

      <section className={styles.listSection} aria-labelledby="habits-title">
        <div className={styles.sectionHeader}>
          <h2 id="habits-title" className={styles.sectionTitle}>
            Your habits
          </h2>
          {habits.length > 0 && (
            <button
              type="button"
              className={styles.editButton}
              onClick={() => setIsEditing((current) => !current)}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
          )}
        </div>

        {habits.length === 0 ? (
          <p className={styles.empty}>
            No habits yet. Tap + to add your first one.
          </p>
        ) : (
          <div className={styles.list}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isPending={pendingIds.has(habit.id)}
                isEditing={isEditing}
                onToggle={() => handleToggle(habit)}
                onDelete={() => setHabitToDelete(habit)}
              />
            ))}
          </div>
        )}

        {children}
      </section>

      <ConfirmDeleteDialog
        habitName={habitToDelete?.name ?? null}
        isDeleting={isDeleting}
        error={deleteError}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
