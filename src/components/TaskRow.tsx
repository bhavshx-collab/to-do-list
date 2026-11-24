import {
  AlertTriangle,
  ArrowDown,
  Calendar,
  Check,
  Minus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Priority, Task } from '../types/task';
import { formatDueDate } from '../utils/storage';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_STYLES: Record<
  Priority,
  {
    badge: string;
    icon: typeof AlertTriangle;
  }
> = {
  High: {
    badge:
      'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/70',
    icon: AlertTriangle,
  },
  Medium: {
    badge:
      'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/70',
    icon: Minus,
  },
  Low: {
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/70',
    icon: ArrowDown,
  },
};

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const priorityConfig = PRIORITY_STYLES[task.priority];
  const PriorityIcon = priorityConfig.icon;
  const dueInfo = formatDueDate(task.dueDate);
  const showOverdue = Boolean(task.dueDate) && dueInfo.isOverdue && !task.completed;

  return (
    <li className="group flex items-start gap-3 px-4 py-4 transition-colors duration-150 hover:bg-slate-50/80 sm:px-5 dark:hover:bg-slate-800/40">
      {/* Accessible 44x44 touch target checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'active' : 'completed'}`}
        onClick={() => onToggle(task.id)}
        className="-ml-2 -mt-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-indigo-600"
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150 ${
            task.completed
              ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
              : 'border-slate-300 bg-white group-hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:group-hover:border-indigo-400'
          }`}
        >
          {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />}
        </span>
      </button>

      {/* Main Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <p
            className={`text-sm font-medium leading-snug sm:text-base ${
              task.completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </p>
        </div>

        {task.description && (
          <p
            className={`mt-1 text-sm leading-relaxed ${
              task.completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Metadata line: Priority tag + unboxed Category + Due Date */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-medium whitespace-nowrap ${priorityConfig.badge}`}
          >
            <PriorityIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{task.priority}</span>
          </span>

          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
            ·
          </span>

          <span className="font-medium text-slate-600 dark:text-slate-400">
            {task.category}
          </span>

          {task.dueDate && (
            <>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                ·
              </span>
              <span
                className={`inline-flex items-center gap-1 font-mono tabular-nums ${
                  showOverdue
                    ? 'font-medium text-red-600 dark:text-red-400'
                    : dueInfo.isToday && !task.completed
                      ? 'font-medium text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {dueInfo.label}
                  {showOverdue ? ' (Overdue)' : ''}
                </span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Edit & Delete Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:opacity-75 sm:transition-opacity sm:duration-150 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit "${task.title}"`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-200/70 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete "${task.title}"`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-indigo-600 dark:text-slate-500 dark:hover:bg-red-950/50 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
