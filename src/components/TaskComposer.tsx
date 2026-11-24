import { FormEvent, RefObject, useEffect, useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Category, Priority, TaskDraft } from '../types/task';

interface TaskComposerProps {
  titleInputRef: RefObject<HTMLInputElement | null>;
  defaultCategory: Category;
  onAddTask: (draft: TaskDraft) => void;
}

export function TaskComposer({
  titleInputRef,
  defaultCategory,
  onAddTask,
}: TaskComposerProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [dueDate, setDueDate] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!title.trim()) {
      setCategory(defaultCategory);
    }
  }, [defaultCategory, title]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Please enter a task title before adding.');
      titleInputRef.current?.focus();
      return;
    }

    onAddTask({
      title: trimmed,
      description: description.trim(),
      priority,
      category,
      dueDate,
    });

    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate('');
    setError('');
  };

  return (
    <section
      aria-label="Add a new task"
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="new-task-title" className="sr-only">
              Task title
            </label>
            <input
              ref={titleInputRef}
              id="new-task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error && e.target.value.trim()) {
                  setError('');
                }
              }}
              placeholder="What needs to get done?"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'new-task-error' : undefined}
              className={`h-11 w-full rounded-lg border bg-slate-50 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-950 ${
                error
                  ? 'border-red-500 focus:ring-red-500/20 dark:border-red-500'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/20 dark:border-slate-800 dark:focus:border-indigo-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDetails((prev) => !prev)}
              aria-expanded={showDetails}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <span>Options</span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="submit"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap shrink-0 sm:flex-initial dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {error && (
          <p
            id="new-task-error"
            role="alert"
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {showDetails && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div>
              <label
                htmlFor="new-task-description"
                className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                Notes (optional)
              </label>
              <textarea
                id="new-task-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context, links, or checklist details..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="new-task-priority"
                  className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Priority
                </label>
                <select
                  id="new-task-priority"
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
                  htmlFor="new-task-category"
                  className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Category
                </label>
                <select
                  id="new-task-category"
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
                  htmlFor="new-task-due-date"
                  className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  Due Date
                </label>
                <input
                  id="new-task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </section>
  );
}
