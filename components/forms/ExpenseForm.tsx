"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { expenseSchema, type ExpenseInput } from "@/lib/validation";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES } from "@/config/constants";
import type { Expense } from "@/types";

export interface ExpenseFormValues {
  title: string;
  shortDescription: string;
  fullDescription: string;
  amount: string;
  category: string;
  priority: string;
  date: string;
  imageUrl: string;
}

const EMPTY_VALUES: ExpenseFormValues = {
  title: "",
  shortDescription: "",
  fullDescription: "",
  amount: "",
  category: "Food",
  priority: "Medium",
  date: new Date().toISOString().slice(0, 10),
  imageUrl: "",
};

function fromExpense(expense: Expense): ExpenseFormValues {
  return {
    title: expense.title,
    shortDescription: expense.shortDescription,
    fullDescription: expense.fullDescription,
    amount: String(expense.amount),
    category: expense.category,
    priority: expense.priority,
    date: expense.date.slice(0, 10),
    imageUrl: expense.imageUrl ?? "",
  };
}

interface ExpenseFormProps {
  initialExpense?: Expense;
  onSubmit: (data: ExpenseInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  showReset?: boolean;
  serverError?: string;
}

export function ExpenseForm({
  initialExpense,
  onSubmit,
  onCancel,
  submitLabel = "Save expense",
  showReset = false,
  serverError,
}: ExpenseFormProps) {
  const initial = initialExpense ? fromExpense(initialExpense) : EMPTY_VALUES;
  const [values, setValues] = useState<ExpenseFormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setValues(EMPTY_VALUES);
    setErrors({});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const result = expenseSchema.safeParse({
      ...values,
      amount: values.amount,
      imageUrl: values.imageUrl || "",
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit(result.data);
    } catch {
  
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input
        label="Title"
        name="title"
        value={values.title}
        onChange={(e) => setField("title", e.target.value)}
        error={errors.title}
        placeholder="e.g. Grocery run"
      />

      <Input
        label="Short description"
        name="shortDescription"
        value={values.shortDescription}
        onChange={(e) => setField("shortDescription", e.target.value)}
        error={errors.shortDescription}
        placeholder="One line - shows up on cards"
      />

      <Textarea
        label="Full description"
        name="fullDescription"
        value={values.fullDescription}
        onChange={(e) => setField("fullDescription", e.target.value)}
        error={errors.fullDescription}
        placeholder="As much detail as you want - shows on the detail page"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Amount"
          name="amount"
          type="number"
          min={0.01}
          step="0.01"
          value={values.amount}
          onChange={(e) => setField("amount", e.target.value)}
          error={errors.amount}
          placeholder="0.00"
        />
        <Input
          label="Date"
          name="date"
          type="date"
          value={values.date}
          onChange={(e) => setField("date", e.target.value)}
          error={errors.date}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Category"
          name="category"
          value={values.category}
          onChange={(e) => setField("category", e.target.value)}
          error={errors.category}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        <Select
          label="Priority"
          name="priority"
          value={values.priority}
          onChange={(e) => setField("priority", e.target.value)}
          error={errors.priority}
        >
          {EXPENSE_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Image URL (optional)"
        name="imageUrl"
        type="url"
        value={values.imageUrl}
        onChange={(e) => setField("imageUrl", e.target.value)}
        error={errors.imageUrl}
        placeholder="https://..."
      />

      {serverError && (
        <p className="rounded-md bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{serverError}</p>
      )}

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        {showReset && (
          <Button type="button" variant="outline" size="lg" onClick={handleReset} disabled={isSubmitting}>
            Reset
          </Button>
        )}
        {onCancel && (
          <Button type="button" variant="ghost" size="lg" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
