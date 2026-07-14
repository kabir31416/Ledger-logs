import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { CategoryBadge, PriorityBadge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, truncate } from "@/lib/utils";
import { CATEGORY_COLORS, type ExpenseCategory } from "@/config/constants";
import type { Expense } from "@/types";

export function ExpenseCard({ expense }: { expense: Expense }) {
  const color = CATEGORY_COLORS[expense.category as ExpenseCategory] ?? "#64748b";

  return (
    <Link
      href={`/explore/${expense.id}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-paper-line bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative h-36 w-full shrink-0 overflow-hidden">
        {expense.imageUrl ? (
          <Image
            src={expense.imageUrl}
            alt={expense.title}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {expense.category[0]}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-ink">
            {truncate(expense.title, 48)}
          </h3>
          <span className="font-amount shrink-0 text-base font-semibold text-ink">
            {formatCurrency(expense.amount)}
          </span>
        </div>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-ink/60">
          {expense.shortDescription}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={expense.category} />
          <PriorityBadge priority={expense.priority} />
        </div>

        <div className="flex items-center justify-between border-t border-paper-line pt-3 text-xs text-ink/50">
          <span>{formatDate(expense.date)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:underline">
            View details <FiArrowUpRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}
