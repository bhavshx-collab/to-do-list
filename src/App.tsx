/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ClipboardList, RotateCcw } from 'lucide-react';
import { EditTaskModal } from './components/EditTaskModal';
import { FilterBar, PriorityFilter } from './components/FilterBar';
import { Header } from './components/Header';
import { CategoryFilter, Sidebar } from './components/Sidebar';
import { TaskComposer } from './components/TaskComposer';
import { TaskRow } from './components/TaskRow';
import { StatusFilter, Task, TaskDraft } from './types/task';
import {
  loadInitialTheme,
  loadTasks,
  saveTasks,
  saveTheme,
} from './utils/storage';

function generateTaskId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadInitialTheme());

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const composerInputRef = useRef<HTMLInputElement>(null);

  // Sync tasks with localStorage on every change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync dark class & theme preference
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleFocusComposer = () => {
    composerInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    composerInputRef.current?.focus();
  };

  const handleAddTask = (draft: TaskDraft) => {
    const newTask: Task = {
      id: generateTaskId(),
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      category: draft.category,
      dueDate: draft.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleUpdateTask = (id: string, updates: TaskDraft) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const handleResetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setSearchQuery('');
  };

  const totalCount = tasks.length;
  const completedCount = useMemo(
    () => tasks.filter((t) => t.completed).length,
    [tasks]
  );
  const pendingCount = totalCount - completedCount;

  const categoryCounts = useMemo<Record<CategoryFilter, number>>(() => {
    return {
      All: tasks.length,
      Work: tasks.filter((t) => t.category === 'Work').length,
      Study: tasks.filter((t) => t.category === 'Study').length,
      Personal: tasks.filter((t) => t.category === 'Personal').length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      if (statusFilter === 'Active' && task.completed) return false;
      if (statusFilter === 'Completed' && !task.completed) return false;
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
      if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;

      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDescription && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery]);

  const hasActiveFilters =
    statusFilter !== 'All' ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All' ||
    searchQuery.trim().length > 0;

  const todayFormatted = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-150 dark:bg-slate-950 dark:text-slate-100"
    >
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onFocusComposer={handleFocusComposer}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Heading */}
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
              {categoryFilter === 'All' ? 'All Tasks' : `${categoryFilter} Tasks`}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {todayFormatted}
            </p>
          </div>

          <p className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
            Showing {filteredTasks.length} of {totalCount}{' '}
            {totalCount === 1 ? 'task' : 'tasks'}
          </p>
        </div>

        {/* Desktop 2-column Workspace */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <Sidebar
            totalCount={totalCount}
            pendingCount={pendingCount}
            completedCount={completedCount}
            categoryCounts={categoryCounts}
            selectedCategory={categoryFilter}
            onSelectCategory={setCategoryFilter}
          />

          <div className="min-w-0 flex-1 space-y-5">
            <TaskComposer
              titleInputRef={composerInputRef}
              defaultCategory={categoryFilter === 'All' ? 'Work' : categoryFilter}
              onAddTask={handleAddTask}
            />

            <FilterBar
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
            />

            {/* Task List Container */}
            <section
              aria-label="Task list"
              className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              {filteredTasks.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={setEditingTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </ul>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <ClipboardList className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                    Your task list is empty
                  </h2>
                  <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Add your first task above with a priority, category, and optional due date to stay on track.
                  </p>
                  <button
                    type="button"
                    onClick={handleFocusComposer}
                    className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Add First Task
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                    No matching tasks found
                  </h2>
                  <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    No tasks match your current filters or search query.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
