import { Search, Trash2, X } from 'lucide-react';
import { Priority, StatusFilter } from '../types/task';

export type PriorityFilter = 'All' | Priority;

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityChange: (priority: PriorityFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  completedCount: number;
  onClearCompleted: () => void;
}

const STATUS_OPTIONS: StatusFilter[] = ['All', 'Active', 'Completed'];

export function FilterBar({
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  searchQuery,
  onSearchChange,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <section
      aria-label="Filter and search tasks"
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Status Segmented Tabs */}
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex w-full items-center gap-1 rounded-lg bg-slate-100 p-1 md:w-auto dark:bg-slate-950"
        >
          {STATUS_OPTIONS.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onStatusChange(status)}
                className={`h-9 flex-1 rounded-md px-3.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap md:flex-initial ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search + Priority + Clear Completed */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:w-56">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              aria-hidden="true"
            />
            <label htmlFor="task-search" className="sr-only">
              Search tasks
            </label>
            <input
              id="task-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-indigo-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="priority-filter" className="sr-only">
              Filter by priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as PriorityFilter)}
              className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 transition-colors focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 sm:flex-initial dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <button
              type="button"
              onClick={onClearCompleted}
              disabled={completedCount === 0}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-700 whitespace-nowrap shrink-0 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:disabled:hover:border-slate-800 dark:disabled:hover:bg-slate-900 dark:disabled:hover:text-slate-300"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>Clear Completed</span>
              {completedCount > 0 && (
                <span className="font-mono text-xs tabular-nums">({completedCount})</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
