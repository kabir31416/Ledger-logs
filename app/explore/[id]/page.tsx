import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { FiArrowLeft, FiPaperclip } from "react-icons/fi";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { serializeExpense } from "@/lib/serialize";
import { Container } from "@/components/ui/Container";
import { CategoryBadge, PriorityBadge } from "@/components/ui/Badge";
import { ExpenseCard } from "@/components/expenses/ExpenseCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense as ExpenseDTO } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getExpense(id: string): Promise<ExpenseDTO | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const doc = await Expense.findById(id).lean();
  if (!doc) return null;
  return serializeExpense(doc as unknown as Parameters<typeof serializeExpense>[0]);
}

async function getRelated(expense: ExpenseDTO): Promise<ExpenseDTO[]> {
  await connectDB();
  const docs = await Expense.find({
    category: expense.category,
    _id: { $ne: expense.id },
  })
    .sort({ date: -1 })
    .limit(3)
    .lean();
  return docs.map((d) => serializeExpense(d as unknown as Parameters<typeof serializeExpense>[0]));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const expense = await getExpense(id);
  if (!expense) return { title: "Expense not found - Ledger" };
  return {
    title: `${expense.title} - Ledger`,
    description: expense.shortDescription,
  };
}

export default async function ExpenseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const expense = await getExpense(id);
  if (!expense) notFound();

  const related = await getRelated(expense);

  return (
    <div className="bg-paper py-14 sm:py-20">
      <Container className="max-w-4xl">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-ink"
        >
          <FiArrowLeft size={15} /> Back to Explore
        </Link>

        <div className="mt-6 rounded-2xl border border-paper-line bg-white p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-2 font-amount text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Overview
              </p>
              <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                {expense.title}
              </h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-ink/60">
                {expense.shortDescription}
              </p>
            </div>
            <div className="font-amount text-3xl font-semibold text-ink">
              {formatCurrency(expense.amount)}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <CategoryBadge category={expense.category} />
            <PriorityBadge priority={expense.priority} />
          </div>

          {expense.imageUrl && (
            <div className="mt-8">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/40">
                <FiPaperclip size={12} /> Attachment
              </p>
              <div className="relative h-72 w-full overflow-hidden rounded-xl border border-paper-line sm:h-96">
                <Image src={expense.imageUrl} alt={expense.title} fill className="object-cover" />
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-paper-line pt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink/70">
              {expense.fullDescription}
            </p>
          </div>

          <div className="mt-8 border-t border-paper-line pt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Expense information</h2>
            <dl className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Category</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{expense.category}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Priority</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{expense.priority}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Date</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{formatDate(expense.date, "long")}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink/40">Amount</dt>
                <dd className="font-amount mt-1 text-sm font-medium text-ink">
                  {formatCurrency(expense.amount)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-xl font-semibold text-ink">Related expenses</h2>
            <p className="mt-1 text-sm text-ink/50">More entries in {expense.category}.</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ExpenseCard key={r.id} expense={r} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
