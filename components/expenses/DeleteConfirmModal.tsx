"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import type { Expense } from "@/types";

interface DeleteConfirmModalProps {
  expense: Expense | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ expense, isDeleting, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <Modal open={!!expense} onClose={onCancel} title="Delete this expense?">
      {expense && (
        <>
          <p className="text-sm leading-relaxed text-ink/65">
            You&apos;re about to permanently delete <span className="font-medium text-ink">&ldquo;{expense.title}&rdquo;</span>{" "}
            ({formatCurrency(expense.amount)}). This can&apos;t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={onCancel} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
              Delete expense
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
