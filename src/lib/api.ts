const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Habit {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isPredefined: boolean;
  streak: number;
  doneToday: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  createdAt: string;
}

export interface LogEntry {
  habitId: string;
  date: string;
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
