import { Schema, model, models, type Model, type Document, Types } from "mongoose";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES } from "@/config/constants";

export interface IExpense extends Document {
  user: Types.ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  amount: number;
  category: string;
  priority: string;
  date: Date;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title must be under 120 characters"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [200, "Short description must be under 200 characters"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
      maxlength: [4000, "Full description must be under 4000 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    category: {
      type: String,
      required: true,
      enum: EXPENSE_CATEGORIES,
    },
    priority: {
      type: String,
      required: true,
      enum: EXPENSE_PRIORITIES,
      default: "Medium",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);


ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });
ExpenseSchema.index({ user: 1, priority: 1 });
ExpenseSchema.index({ title: "text", shortDescription: "text", fullDescription: "text" });

export const Expense: Model<IExpense> =
  models.Expense || model<IExpense>("Expense", ExpenseSchema);

export default Expense;
