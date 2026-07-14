"use client";

import { useState } from "react";
import { FiInbox } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { ExpenseCardSkeleton } from "@/components/expenses/ExpenseCardSkeleton";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { Pagination } from "@/components/expenses/Pagination";
import { useExpenseList, DEFAULT_FILTERS, type ExpenseListFilters } from "@/hooks/useExpenses";
import { useDebounce } from "@/hooks/useDebounce";

export default function ExplorePage() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ExpenseListFilters>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(searchInput, 350);

  const activeFilters: ExpenseListFilters = { ...filters, search: debouncedSearch };
  const { data, isLoading, error } = useExpenseList("/api/explore", activeFilters);

  function patchFilters(patch: Partial<ExpenseListFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
  }

  return (
    <div className="bg-paper py-14 sm:py-20">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-amount text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Public feed
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Explore expenses
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            A public feed of logged expenses - no account needed to browse. Sign up to log your own
            and keep them private.
          </p>
        </div>

        <ExpenseFilters
          search={searchInput}
          onSearchChange={(v) => {
            setSearchInput(v);
            patchFilters({ page: 1 });
          }}
          filters={activeFilters}
          onChange={patchFilters}
          onReset={resetFilters}
        />

        <div className="mt-8">
          {error && (
            <EmptyState
              icon={<FiInbox size={22} />}
              title="Couldn't load expenses"
              description={error}
            />
          )}

          {!error && isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ExpenseCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !isLoading && data && data.items.length === 0 && (
            <EmptyState
              icon={<FiInbox size={22} />}
              title="No expenses match those filters"
              description="Try widening your search, or reset the filters to see everything."
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Reset filters
                </Button>
              }
            />
          )}

          {!error && !isLoading && data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.items.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination
                  page={data.page}
                  totalPages={data.totalPages}
                  total={data.total}
                  pageSize={data.pageSize}
                  onPageChange={(p) => patchFilters({ page: p })}
                />
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
