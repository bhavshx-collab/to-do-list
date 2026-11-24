import { BookOpen, Briefcase, Layers, User } from 'lucide-react';
import { Category } from '../types/task';

export type CategoryFilter = 'All' | Category;

interface SidebarProps {
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  categoryCounts: Record<CategoryFilter, number>;
  selectedCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

const CATEGORIES: { id: CategoryFilter; label: string; icon: typeof Layers }[] = [
  { id: 'All', label: 'All Tasks', icon: Layers },
  { id: 'Work', label: 'Work', icon: Briefcase },
  { id: 'Study', label: 'Study', icon: BookOpen },
  { id: 'Personal', label: 'Personal', icon: User },
];

export function Sidebar({
  totalCount,
  pendingCount,
  completedCount,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
}: SidebarProps) {
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <aside className="w-full shrink-0 lg:w-64" aria-label="Task summary and categories">
      <div className="space-y-6">
        {/* Summary Counter Block */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Overview
            </h2>
            <span className="font-mono text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
              {completionPct}% done
            </span>
          </div>

          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={completionPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Task completion progress"
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-transform duration-200 ease-out origin-left dark:bg-indigo-500"
              style={{ transform: `scaleX(${completionPct / 100})` }}
            />
          </div>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-100 pt-4 dark:divide-slate-800 dark:border-slate-800">
            <div className="pr-2">
              <dt className="text-xs text-slate-500 dark:text-slate-400">Total</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {totalCount}
              </dd>
            </div>
            <div className="px-3">
              <dt className="text-xs text-slate-500 dark:text-slate-400">Pending</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {pendingCount}
              </dd>
            </div>
            <div className="pl-3">
              <dt className="text-xs text-slate-500 dark:text-slate-400">Done</dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {completedCount}
              </dd>
            </div>
          </dl>
        </section>

        {/* Category Navigation */}
        <nav
          aria-label="Filter by category"
          className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="px-2.5 pb-2 pt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Categories
          </p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isActive = selectedCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectCategory(id)}
                  className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-300'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {categoryCounts[id]}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
