"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { FiPlus, FiInbox } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ExpenseTableSkeleton } from "@/components/expenses/ExpenseTableSkeleton";
import { DeleteConfirmModal } from "@/components/expenses/DeleteConfirmModal";
import { Pagination } from "@/components/expenses/Pagination";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { useExpenseList, DEFAULT_FILTERS, type ExpenseListFilters } from "@/hooks/useExpenses";
import { useDebounce } from "@/hooks/useDebounce";
import { apiFetch } from "@/lib/api-client";
import { ApiRequestError } from "@/context/AuthContext";
import type { Expense } from "@/types";
import type { ExpenseInput } from "@/lib/validation";

export default function ManageExpensesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<ExpenseListFilters>(DEFAULT_FILTERS);
  const debouncedSearch = useDebounce(searchInput, 350);
  const activeFilters: ExpenseListFilters = { ...filters, search: debouncedSearch };

  const { data, isLoading, error, reload } = useExpenseList("/api/expenses", activeFilters);

  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState<string | undefined>();

  function patchFilters(patch: Partial<ExpenseListFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchInput("");
  }

  async function handleEditSubmit(values: ExpenseInput) {
    if (!editingExpense) return;
    setEditError(undefined);
    try {
      await apiFetch<Expense>(`/api/expenses/${editingExpense.id}`, {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Expense updated");
      setEditingExpense(null);
      reload();
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Couldn't update the expense.";
      setEditError(message);
      toast.error(message);
      throw err;
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await apiFetch(`/api/expenses/${deletingExpense.id}`, { method: "DELETE" });
      toast.success("Expense deleted");
      setDeletingExpense(null);
      reload();
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Couldn't delete the expense.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="bg-paper py-10 sm:py-14">
      <Container>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Manage expenses</h1>
            <p className="mt-1.5 text-sm text-ink/60">Search, filter, sort, edit, or delete your entries.</p>
          </div>
          <Link href="/expenses/add">
            <Button variant="primary" className="gap-1.5">
              <FiPlus size={16} />
              Add expense
            </Button>
          </Link>
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
          {error && <EmptyState icon={<FiInbox size={22} />} title="Couldn't load your expenses" description={error} />}

          {!error && isLoading && <ExpenseTableSkeleton />}

          {!error && !isLoading && data && data.items.length === 0 && (
            <EmptyState
              icon={<FiInbox size={22} />}
              title="No expenses match those filters"
              description="Add your first expense, or reset the filters to see everything."
              action={
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset filters
                  </Button>
                  <Link href="/expenses/add">
                    <Button>Add expense</Button>
                  </Link>
                </div>
              }
            />
          )}

          {!error && !isLoading && data && data.items.length > 0 && (
            <>
              <ExpenseTable
                expenses={data.items}
                onEdit={(e) => {
                  setEditError(undefined);
                  setEditingExpense(e);
                }}
                onDelete={(e) => setDeletingExpense(e)}
              />
              <div className="mt-8">
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

      <Modal open={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit expense">
        {editingExpense && (
          <ExpenseForm
            initialExpense={editingExpense}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingExpense(null)}
            submitLabel="Save changes"
            serverError={editError}
          />
        )}
      </Modal>

      <DeleteConfirmModal
        expense={deletingExpense}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingExpense(null)}
      />
    </div>
  );
}
