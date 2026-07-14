

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Travel",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_PRIORITIES = ["Low", "Medium", "High"] as const;

export type ExpensePriority = (typeof EXPENSE_PRIORITIES)[number];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Housing: "#8b5cf6",
  Utilities: "#06b6d4",
  Entertainment: "#ec4899",
  Healthcare: "#ef4444",
  Shopping: "#eab308",
  Education: "#22c55e",
  Travel: "#14b8a6",
  Other: "#64748b",
};

export const PRIORITY_COLORS: Record<ExpensePriority, string> = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#ef4444",
};

export const DEFAULT_PAGE_SIZE = 8;

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "amount_desc", label: "Amount: High to Low" },
  { value: "amount_asc", label: "Amount: Low to High" },
  { value: "title_asc", label: "Title: A to Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
