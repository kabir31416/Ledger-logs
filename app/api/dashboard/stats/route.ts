import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { requireAuth } from "@/lib/auth";
import { ok, withErrorHandling } from "@/lib/api-utils";
import { serializeExpense } from "@/lib/serialize";
import type { DashboardStats } from "@/types";

export async function GET() {
  return withErrorHandling(async () => {
    const session = await requireAuth();
    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [totals, monthTotals, byCategory, byPriority, byMonth, recentDocs] =
      await Promise.all([
        Expense.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
              count: { $sum: 1 },
              average: { $avg: "$amount" },
            },
          },
        ]),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId } },
          { $group: { _id: "$category", total: { $sum: "$amount" } } },
          { $sort: { total: -1 } },
        ]),
        Expense.aggregate([
          { $match: { user: userId } },
          { $group: { _id: "$priority", total: { $sum: "$amount" } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { year: { $year: "$date" }, month: { $month: "$date" } },
              total: { $sum: "$amount" },
            },
          },
          { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]),
        Expense.find({ user: userId }).sort({ date: -1 }).limit(5).lean(),
      ]);

    const totalsRow = totals[0] ?? { total: 0, count: 0, average: 0 };
    const monthRow = monthTotals[0] ?? { total: 0, count: 0 };

    const stats: DashboardStats = {
      totalExpenses: round2(totalsRow.total),
      totalCount: totalsRow.count,
      thisMonthTotal: round2(monthRow.total),
      thisMonthCount: monthRow.count,
      highestCategory: byCategory[0]
        ? { category: byCategory[0]._id, total: round2(byCategory[0].total) }
        : null,
      averageExpense: round2(totalsRow.average || 0),
      recentExpenses: recentDocs.map((d) =>
        serializeExpense(d as unknown as Parameters<typeof serializeExpense>[0])
      ),
      byCategory: byCategory.map((c) => ({ category: c._id, total: round2(c.total) })),
      byPriority: byPriority.map((p) => ({ priority: p._id, total: round2(p.total) })),
      byMonth: byMonth.map((m) => ({
        month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
        total: round2(m.total),
      })),
    };

    return ok(stats);
  });
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
