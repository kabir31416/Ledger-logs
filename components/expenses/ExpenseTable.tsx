import type { ReactNode } from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { CategoryBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-paper-line bg-white md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-paper-line bg-paper-dim/60 text-xs uppercase tracking-wide text-ink/50">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-line">
            {expenses.map((expense) => (
              <tr key={expense.id} className="transition-colors hover:bg-paper-dim/40">
                <td className="max-w-[220px] truncate px-5 py-3.5 font-medium text-ink">{expense.title}</td>
                <td className="px-5 py-3.5">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="px-5 py-3.5">
                  <PriorityBadge priority={expense.priority} />
                </td>
                <td className="px-5 py-3.5 text-ink/60">{formatDate(expense.date)}</td>
                <td className="font-amount px-5 py-3.5 text-right font-semibold text-ink">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <RowAction href={`/explore/${expense.id}`} label="View" icon={<FiEye size={15} />} />
                    <RowAction onClick={() => onEdit(expense)} label="Edit" icon={<FiEdit2 size={15} />} />
                    <RowAction
                      onClick={() => onDelete(expense)}
                      label="Delete"
                      icon={<FiTrash2 size={15} />}
                      danger
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {expenses.map((expense) => (
          <div key={expense.id} className="rounded-xl border border-paper-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{expense.title}</p>
                <p className="mt-0.5 text-xs text-ink/50">{formatDate(expense.date)}</p>
              </div>
              <span className="font-amount shrink-0 font-semibold text-ink">
                {formatCurrency(expense.amount)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <CategoryBadge category={expense.category} />
              <PriorityBadge priority={expense.priority} />
            </div>
            <div className="mt-3 flex gap-2 border-t border-paper-line pt-3">
              <Link
                href={`/explore/${expense.id}`}
                className="flex-1 rounded-md border border-paper-line py-2 text-center text-xs font-medium text-ink/70"
              >
                View
              </Link>
              <button
                onClick={() => onEdit(expense)}
                className="flex-1 rounded-md border border-paper-line py-2 text-center text-xs font-medium text-ink/70"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(expense)}
                className="flex-1 rounded-md border border-danger/30 py-2 text-center text-xs font-medium text-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RowAction({
  href,
  onClick,
  label,
  icon,
  danger,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: ReactNode;
  danger?: boolean;
}) {
  const classes = `flex h-8 w-8 items-center justify-center rounded-md ${
    danger ? "text-danger hover:bg-danger-soft" : "text-ink/50 hover:bg-paper-dim hover:text-ink"
  }`;

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {icon}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={classes}>
      {icon}
    </button>
  );
}
