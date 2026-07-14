import Link from "next/link";
import { FiInbox } from "react-icons/fi";
import { Card } from "@/components/ui/Card";
import { CategoryBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/types";

export function RecentExpensesList({ expenses }: { expenses: Expense[] }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink">Recent expenses</h3>
        <Link href="/expenses/manage" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="py-6">
          <EmptyState
            icon={<FiInbox size={20} />}
            title="No expenses yet"
            description="Your five most recent expenses will show up here."
            action={
              <Link href="/expenses/add">
                <Button size="sm">Add your first expense</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-paper-line">
          {expenses.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{e.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <CategoryBadge category={e.category} />
                  <span className="text-xs text-ink/40">{formatDate(e.date)}</span>
                </div>
              </div>
              <span className="font-amount shrink-0 text-sm font-semibold text-ink">
                {formatCurrency(e.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
