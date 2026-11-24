import { FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Category, Priority, Task, TaskDraft } from '../types/task';

interface EditTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (id: string, updates: TaskDraft) => void;
}

export function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Work');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setCategory(task.category);
      setDueDate(task.dueDate);
      setError('');
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 20);
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [task, onClose]);

  if (!task) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Task title cannot be empty.');
      titleInputRef.current?.focus();
      return;
    }

    onSave(task.id, {
      title: trimmed,
      description: description.trim(),
      priority,
      category,
      dueDate,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-heading"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2
            id="edit-task-heading"
            className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100"
          >
            Edit Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit dialog"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="edit-task-title"
              className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Title
            </label>
            <input
              ref={titleInputRef}
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error && e.target.value.trim()) {
                  setError('');
                }
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'edit-task-error' : undefined}
              className={`h-11 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-900 transition-colors focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-slate-100 dark:focus:bg-slate-950 ${
                error
                  ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20 dark:border-slate-800 dark:focus:border-indigo-500'
              }`}
            />
            {error && (
              <p
                id="edit-task-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-task-description"
              className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              Notes
            </label>
            <textarea
              id="edit-task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details or notes..."
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label
                htmlFor="edit-task-priority"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Priority
              </label>
              <select
                id="edit-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-task-category"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Category
              </label>
              <select
                id="edit-task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
              >
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-task-due-date"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Due Date
              </label>
              <input
                id="edit-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
