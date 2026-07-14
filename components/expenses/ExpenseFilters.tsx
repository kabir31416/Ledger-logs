"use client";

import { useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES, SORT_OPTIONS } from "@/config/constants";
import type { ExpenseListFilters } from "@/hooks/useExpenses";

interface ExpenseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: ExpenseListFilters;
  onChange: (patch: Partial<ExpenseListFilters>) => void;
  onReset: () => void;
}

export function ExpenseFilters({ search, onSearchChange, filters, onChange, onReset }: ExpenseFiltersProps) {
  const [showMore, setShowMore] = useState(false);

  const hasAdvancedFilters =
    filters.category !== "all" ||
    filters.priority !== "all" ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined ||
    !!filters.dateFrom ||
    !!filters.dateTo;

  return (
    <div className="rounded-xl border border-paper-line bg-white p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or description..."
            aria-label="Search expenses"
            className="h-11 w-full rounded-md border border-paper-line bg-white pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            aria-label="Sort by"
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as ExpenseListFilters["sort"], page: 1 })}
            className="w-auto min-w-[160px]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>

          <Button
            type="button"
            variant={showMore || hasAdvancedFilters ? "primary" : "outline"}
            size="md"
            onClick={() => setShowMore((v) => !v)}
            className="gap-1.5"
          >
            <FiSliders size={15} />
            Filters
          </Button>

          {hasAdvancedFilters && (
            <Button type="button" variant="ghost" size="md" onClick={onReset} className="gap-1.5">
              <FiX size={15} />
              Reset
            </Button>
          )}
        </div>
      </div>

      {showMore && (
        <div className="mt-4 grid gap-3 border-t border-paper-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Category"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value, page: 1 })}
          >
            <option value="all">All categories</option>
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>

          <Select
            label="Priority"
            value={filters.priority}
            onChange={(e) => onChange({ priority: e.target.value, page: 1 })}
          >
            <option value="all">All priorities</option>
            {EXPENSE_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>

          <Input
            label="Min amount"
            type="number"
            min={0}
            step="0.01"
            value={filters.minAmount ?? ""}
            onChange={(e) =>
              onChange({ minAmount: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
            placeholder="$0"
          />

          <Input
            label="Max amount"
            type="number"
            min={0}
            step="0.01"
            value={filters.maxAmount ?? ""}
            onChange={(e) =>
              onChange({ maxAmount: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
            placeholder="No limit"
          />

          <Input
            label="From date"
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => onChange({ dateFrom: e.target.value || undefined, page: 1 })}
          />

          <Input
            label="To date"
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => onChange({ dateTo: e.target.value || undefined, page: 1 })}
          />
        </div>
      )}
    </div>
  );
}
