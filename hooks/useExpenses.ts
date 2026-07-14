import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import type { Expense, PaginatedResult } from "@/types";
import { DEFAULT_PAGE_SIZE, type SortOption } from "@/config/constants";

export interface ExpenseListFilters {
  page: number;
  pageSize: number;
  search: string;
  category: string;
  priority: string;
  sort: SortOption;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
}

export const DEFAULT_FILTERS: ExpenseListFilters = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  search: "",
  category: "all",
  priority: "all",
  sort: "date_desc",
};

export function useExpenseList(
  endpoint: "/api/explore" | "/api/expenses",
  filters: ExpenseListFilters
) {
  const [data, setData] = useState<PaginatedResult<Expense> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    apiFetch<PaginatedResult<Expense>>(endpoint, { params: { ...filters } })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load expenses");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  
  }, [
    endpoint,
    filters.page,
    filters.pageSize,
    filters.search,
    filters.category,
    filters.priority,
    filters.sort,
    filters.minAmount,
    filters.maxAmount,
    filters.dateFrom,
    filters.dateTo,
    reloadToken,
  ]);

  return { data, isLoading, error, reload };
}
