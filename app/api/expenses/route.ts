import { NextRequest } from "next/server";
import { FilterQuery } from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense, type IExpense } from "@/models/Expense";
import { requireAuth } from "@/lib/auth";
import { expenseSchema, expenseQuerySchema } from "@/lib/validation";
import { ok, withErrorHandling } from "@/lib/api-utils";
import { serializeExpense } from "@/lib/serialize";
import type { PaginatedResult, Expense as ExpenseDTO } from "@/types";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  date_desc: { date: -1 },
  date_asc: { date: 1 },
  amount_desc: { amount: -1 },
  amount_asc: { amount: 1 },
  title_asc: { title: 1 },
};

/**
 * GET /api/expenses
 * Query params: page, pageSize, search, category, priority, sort,
 * minAmount, maxAmount, dateFrom, dateTo
 * Returns only the requesting user's expenses (scoped by JWT), never
 * another user's data.
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    await connectDB();

    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = expenseQuerySchema.parse(params);

    const filter: FilterQuery<IExpense> = { user: session.userId };

    if (query.search) {
      filter.$text = { $search: query.search };
    }
    if (query.category && query.category !== "all") {
      filter.category = query.category;
    }
    if (query.priority && query.priority !== "all") {
      filter.priority = query.priority;
    }
    if (query.minAmount !== undefined || query.maxAmount !== undefined) {
      filter.amount = {};
      if (query.minAmount !== undefined) filter.amount.$gte = query.minAmount;
      if (query.maxAmount !== undefined) filter.amount.$lte = query.maxAmount;
    }
    if (query.dateFrom || query.dateTo) {
      filter.date = {};
      if (query.dateFrom) filter.date.$gte = new Date(query.dateFrom);
      if (query.dateTo) filter.date.$lte = new Date(query.dateTo);
    }

    const skip = (query.page - 1) * query.pageSize;
    const sort = SORT_MAP[query.sort] ?? SORT_MAP.date_desc;

    const [docs, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(query.pageSize).lean(),
      Expense.countDocuments(filter),
    ]);

    const items: ExpenseDTO[] = docs.map((d) =>
      serializeExpense(d as unknown as Parameters<typeof serializeExpense>[0])
    );

    const result: PaginatedResult<ExpenseDTO> = {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    };

    return ok(result);
  });
}

/** POST /api/expenses - create a new expense owned by the logged-in user. */
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    const body = await req.json();
    const data = expenseSchema.parse(body);

    await connectDB();

    const doc = await Expense.create({
      ...data,
      user: session.userId,
    });

    return ok(serializeExpense(doc.toObject()), 201, "Expense created");
  });
}
