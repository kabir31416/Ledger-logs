import { z } from "zod";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES } from "@/config/constants";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const expenseSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120),
  shortDescription: z
    .string()
    .trim()
    .min(5, "Short description must be at least 5 characters")
    .max(200),
  fullDescription: z
    .string()
    .trim()
    .min(10, "Full description must be at least 10 characters")
    .max(4000),
  amount: z.coerce.number().positive("Amount must be greater than 0").max(100_000_000),
  category: z.enum(EXPENSE_CATEGORIES, { message: "Choose a valid category" }),
  priority: z.enum(EXPENSE_PRIORITIES, { message: "Choose a valid priority" }),
  date: z.coerce.date({ message: "Enter a valid date" }),
  imageUrl: z
    .union([z.string().trim().url("Must be a valid URL"), z.literal("")])
    .optional(),
});
export type ExpenseInput = z.infer<typeof expenseSchema>;

export const expenseUpdateSchema = expenseSchema.partial();
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;

export const expenseQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
  search: z.string().trim().optional().default(""),
  category: z.string().optional().default("all"),
  priority: z.string().optional().default("all"),
  sort: z
    .enum(["date_desc", "date_asc", "amount_desc", "amount_asc", "title_asc"])
    .default("date_desc"),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().min(0).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;

/** Flattens a ZodError into `{ field: [messages] }` for API responses. */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(issue.message);
  }
  return fieldErrors;
}
