"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  CloseIcon,
  DEFAULT_HABIT_ICON,
  HABIT_ICONS,
  IconSvg,
  PlusIcon,
} from "./Icons";
import styles from "./AddHabitForm.module.css";

export default function AddHabitForm() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const nameId = useId();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(DEFAULT_HABIT_ICON.value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleDialogClick(event: React.MouseEvent<HTMLDialogElement>) {
    // A click on the backdrop targets the <dialog> itself, not the form inside it
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter a habit name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await apiFetch("/habits", {
        method: "POST",
        body: JSON.stringify({ name: trimmedName, icon }),
      });

      setName("");
      setIcon(DEFAULT_HABIT_ICON.value);
      closeDialog();
      router.refresh();
    } catch (err) {
      console.error("Failed to create habit", err);
      setError("Could not add the habit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.desktopTrigger}
        onClick={openDialog}
      >
        <PlusIcon size={18} strokeWidth={2.4} />
        <span>New habit</span>
      </button>

      <button
        type="button"
        className={styles.fab}
        onClick={openDialog}
        aria-label="Add habit"
      >
        <PlusIcon size={24} strokeWidth={2.4} />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={titleId}
        onClick={handleDialogClick}
        onClose={() => setError(null)}
      >
        <form onSubmit={handleSubmit} className={styles.content}>
          <div className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              New habit
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={closeDialog}
              aria-label="Close"
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div className={styles.field}>
            <label htmlFor={nameId} className={styles.label}>
              Name
            </label>
            <input
              id={nameId}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Meditate 10 minutes"
              maxLength={100}
              required
              className={styles.input}
            />
          </div>

          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>Icon</legend>
            <div className={styles.iconGrid}>
              {HABIT_ICONS.map((option) => (
                <label key={option.value} className={styles.option}>
                  <input
                    type="radio"
                    name="icon"
                    value={option.value}
                    checked={icon === option.value}
                    onChange={() => setIcon(option.value)}
                  />
                  <span className={styles.tile}>
                    <IconSvg path={option.path} size={22} strokeWidth={1.8} />
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add habit"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
