import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { requireAuth } from "@/lib/auth";
import { expenseUpdateSchema } from "@/lib/validation";
import { ok, fail, withErrorHandling } from "@/lib/api-utils";
import { serializeExpense } from "@/lib/serialize";

interface Params {
  params: Promise<{ id: string }>;
}

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/expenses/[id]
 * Publicly readable (used by the public expense detail page), but still
 * scoped to expenses that exist - no auth required per the spec's
 * "public detail page" requirement.
 */
export async function GET(_req: NextRequest, { params }: Params) {
  return withErrorHandling(async () => {
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid expense id", 400);

    await connectDB();
    const doc = await Expense.findById(id).lean();
    if (!doc) return fail("Expense not found", 404);

    return ok(serializeExpense(doc as unknown as Parameters<typeof serializeExpense>[0]));
  });
}

/** PUT /api/expenses/[id] - update an expense, only if it belongs to the requester. */
export async function PUT(req: NextRequest, { params }: Params) {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid expense id", 400);

    const body = await req.json();
    const data = expenseUpdateSchema.parse(body);

    await connectDB();

    const existing = await Expense.findById(id);
    if (!existing) return fail("Expense not found", 404);
    if (String(existing.user) !== session.userId) {
      return fail("You do not have permission to edit this expense", 403);
    }

    Object.assign(existing, data);
    await existing.save();

    return ok(serializeExpense(existing.toObject()), 200, "Expense updated");
  });
}

/** DELETE /api/expenses/[id] - only the owner can delete. */
export async function DELETE(_req: NextRequest, { params }: Params) {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    const { id } = await params;
    if (!isValidId(id)) return fail("Invalid expense id", 400);

    await connectDB();

    const existing = await Expense.findById(id);
    if (!existing) return fail("Expense not found", 404);
    if (String(existing.user) !== session.userId) {
      return fail("You do not have permission to delete this expense", 403);
    }

    await existing.deleteOne();

    return ok(null, 200, "Expense deleted");
  });
}
