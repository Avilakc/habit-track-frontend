import { Habit } from "@/lib/api";
import { CheckIcon, HabitIcon, TrashIcon } from "./Icons";
import styles from "./HabitCard.module.css";

interface HabitCardProps {
  habit: Habit;
  isPending: boolean;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function HabitCard({
  habit,
  isPending,
  isEditing,
  onToggle,
  onDelete,
}: HabitCardProps) {
  const streakLabel =
    habit.streak > 0 ? `${habit.streak}-day streak` : "Start a streak today";
  const meta = habit.isPredefined ? streakLabel : `Custom · ${streakLabel}`;

  return (
    <div className={styles.row} data-editing={isEditing}>
      <button
        type="button"
        className={styles.card}
        onClick={onToggle}
        disabled={isPending || isEditing}
        aria-pressed={habit.doneToday}
      >
        <span className={styles.iconTile}>
          <HabitIcon icon={habit.icon} />
        </span>

        <span className={styles.info}>
          <span className={styles.name}>{habit.name}</span>
          <span className={styles.meta}>{meta}</span>
        </span>

        {!isEditing && (
          <span className={styles.check}>
            {habit.doneToday && <CheckIcon size={16} strokeWidth={3} />}
          </span>
        )}
      </button>

      {isEditing && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={onDelete}
          aria-label={`Delete ${habit.name}`}
        >
          <TrashIcon size={20} />
        </button>
      )}
    </div>
  );
}
