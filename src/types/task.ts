export type Priority = 'Low' | 'Medium' | 'High';

export type Category = 'Work' | 'Study' | 'Personal';

export type StatusFilter = 'All' | 'Active' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string; // YYYY-MM-DD or empty string
  completed: boolean;
  createdAt: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string;
}
