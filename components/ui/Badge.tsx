import { CATEGORY_COLORS, PRIORITY_COLORS, type ExpenseCategory, type ExpensePriority } from "@/config/constants";

export function CategoryBadge({ category }: { category: ExpenseCategory | string }) {
  const color = CATEGORY_COLORS[category as ExpenseCategory] ?? "#64748b";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {category}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: ExpensePriority | string }) {
  const color = PRIORITY_COLORS[priority as ExpensePriority] ?? "#64748b";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {priority}
    </span>
  );
}
