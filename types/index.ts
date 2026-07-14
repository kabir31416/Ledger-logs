import type { ExpenseCategory, ExpensePriority } from "@/config/constants";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  amount: number;
  category: ExpenseCategory;
  priority: ExpensePriority;
  date: string; 
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalExpenses: number;
  totalCount: number;
  thisMonthTotal: number;
  thisMonthCount: number;
  highestCategory: { category: string; total: number } | null;
  averageExpense: number;
  recentExpenses: Expense[];
  byCategory: { category: string; total: number }[];
  byMonth: { month: string; total: number }[];
  byPriority: { priority: string; total: number }[];
}

export interface ApiError {
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ApiSuccess<T> {
  data: T;
  message?: string;
}
