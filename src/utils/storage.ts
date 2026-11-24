import { Task } from '../types/task';

const TASKS_STORAGE_KEY = 'cadence_tasks_v1';
const THEME_STORAGE_KEY = 'cadence_theme';

function getRelativeDateISO(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getSampleTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'sample-1',
      title: 'Finalize Q4 product roadmap presentation',
      description: 'Review slide deck metrics with engineering leads and confirm launch milestones.',
      priority: 'High',
      category: 'Work',
      dueDate: getRelativeDateISO(1),
      completed: false,
      createdAt: now,
    },
    {
      id: 'sample-2',
      title: 'Complete TypeScript generics practice module',
      description: 'Work through conditional types and utility type exercises from Chapter 6.',
      priority: 'Medium',
      category: 'Study',
      dueDate: getRelativeDateISO(3),
      completed: false,
      createdAt: now,
    },
    {
      id: 'sample-3',
      title: 'Book annual dental checkup & pick up groceries',
      description: 'Call clinic before 4 PM; grab fresh coffee beans, spinach, and oats.',
      priority: 'Low',
      category: 'Personal',
      dueDate: getRelativeDateISO(-1),
      completed: true,
      createdAt: now,
    },
  ];
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw === null) {
      const samples = getSampleTasks();
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      const samples = getSampleTasks();
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(samples));
      return samples;
    }
    return parsed;
  } catch {
    return getSampleTasks();
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // Fallback to light
  }
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage errors
  }
}

export function formatDueDate(dueDate: string): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  if (!dueDate) {
    return { label: 'No due date', isOverdue: false, isToday: false };
  }

  const parts = dueDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return { label: dueDate, isOverdue: false, isToday: false };
  }

  const [year, month, day] = parts;
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Today', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false };
  }
  if (diffDays === -1) {
    return { label: 'Yesterday', isOverdue: true, isToday: false };
  }

  const formatted = target.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: target.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });

  return {
    label: formatted,
    isOverdue: diffDays < 0,
    isToday: false,
  };
}
