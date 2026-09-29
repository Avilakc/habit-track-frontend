interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

interface IconSvgProps extends IconProps {
  path: string;
}

// Base SVG shared by every icon — only the path changes
export function IconSvg({
  path,
  size = 22,
  strokeWidth = 1.9,
  className,
}: IconSvgProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

function createIcon(path: string) {
  return function Icon(props: IconProps) {
    return <IconSvg path={path} {...props} />;
  };
}

/* ---------- UI icons ---------- */

export const HomeIcon = createIcon(
  "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
);
export const StatsIcon = createIcon("M5 20V11M11 20V5M17 20v-7M3 20h18");
export const PlusIcon = createIcon("M12 5v14M5 12h14");
export const CheckIcon = createIcon("M5 12.5l4.5 4.5L19 7.5");
export const CloseIcon = createIcon("M6 6l12 12M18 6L6 18");
export const TrashIcon = createIcon(
  "M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3",
);

/* ---------- Habit icons ---------- */

export interface HabitIconOption {
  value: string; // emoji stored in the database
  label: string;
  path: string;
}

export const DEFAULT_HABIT_ICON: HabitIconOption = {
  value: "🎯",
  label: "Goal",
  path: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

export const HABIT_ICONS: HabitIconOption[] = [
  {
    value: "😴",
    label: "Sleep",
    path: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z",
  },
  { value: "💧", label: "Water", path: "M12 3l5.5 6.2a7 7 0 1 1-11 0z" },
  {
    value: "💪",
    label: "Exercise",
    path: "M6.5 6v12M17.5 6v12M3.5 9v6M20.5 9v6M6.5 12h11",
  },
  {
    value: "📖",
    label: "Read",
    path: "M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z",
  },
  { value: "🏃", label: "Cardio", path: "M3 12h4l3-8 4 16 3-8h4" },
  {
    value: "🧘",
    label: "Calm",
    path: "M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l7-7",
  },
  {
    value: "📝",
    label: "Write",
    path: "M12 20h8M16 4.5a2 2 0 0 1 3 3L8 18.5l-4 1 1-4z",
  },
  {
    value: "🎨",
    label: "Create",
    path: "M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z",
  },
  DEFAULT_HABIT_ICON,
];

interface HabitIconProps {
  icon: string | null;
  size?: number;
}

// Translates the emoji saved in the database into its SVG — unknown values fall back to Goal
export function HabitIcon({ icon, size = 22 }: HabitIconProps) {
  const option =
    HABIT_ICONS.find((item) => item.value === icon?.trim()) ??
    DEFAULT_HABIT_ICON;
  return <IconSvg path={option.path} size={size} strokeWidth={1.8} />;
}
