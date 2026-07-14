import type { Expense } from "@/types";


interface LeanExpense {
  _id: unknown;
  user: unknown;
  title: string;
  shortDescription: string;
  fullDescription: string;
  amount: number;
  category: string;
  priority: string;
  date: Date | string;
  imageUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}


export function serializeExpense(doc: LeanExpense): Expense {
  return {
    id: String(doc._id),
    userId: String(doc.user),
    title: doc.title,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    amount: doc.amount,
    category: doc.category as Expense["category"],
    priority: doc.priority as Expense["priority"],
    date: new Date(doc.date).toISOString(),
    imageUrl: doc.imageUrl || undefined,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}
