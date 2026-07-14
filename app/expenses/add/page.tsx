"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Container } from "@/components/ui/Container";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { apiFetch } from "@/lib/api-client";
import { ApiRequestError } from "@/context/AuthContext";
import type { ExpenseInput } from "@/lib/validation";
import type { Expense } from "@/types";

export default function AddExpensePage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | undefined>();

  async function handleSubmit(data: ExpenseInput) {
    setServerError(undefined);
    try {
      await apiFetch<Expense>("/api/expenses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      toast.success("Expense added");
      router.push("/expenses/manage");
      router.refresh();
    } catch (err) {
      const message = err instanceof ApiRequestError ? err.message : "Couldn't save the expense. Try again.";
      setServerError(message);
      toast.error(message);
      throw err;
    }
  }

  return (
    <div className="bg-paper py-14 sm:py-20">
      <Container className="max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Add an expense</h1>
        <p className="mt-1.5 text-sm text-ink/60">
          Title, short description, amount, category, priority, and date are required.
        </p>

        <div className="mt-8 rounded-2xl border border-paper-line bg-white p-6 sm:p-8">
          <ExpenseForm onSubmit={handleSubmit} showReset submitLabel="Add expense" serverError={serverError} />
        </div>
      </Container>
    </div>
  );
}
