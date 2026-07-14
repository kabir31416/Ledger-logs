/**
 * Run with: npm run seed
 * Populates the database with a demo user (demo@expensetracker.app /
 * Demo1234) and ~40 sample expenses spread across the last 6 months, so
 * the dashboard charts and explore/manage pages have real data to show
 * during local development.
 *
 * Safe to re-run: it skips seeding if the demo user already has expenses.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { Expense } from "../models/Expense";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES } from "../config/constants";

const DEMO_EMAIL = "demo@expensetracker.app";
const DEMO_PASSWORD = "Demo1234";

const SAMPLE_TITLES = [
  "Grocery run", "Uber to airport", "Monthly rent", "Electric bill",
  "Movie night", "Dentist visit", "New headphones", "Online course",
  "Weekend trip", "Coffee subscription", "Gym membership", "Laptop stand",
  "Team lunch", "Car insurance", "Phone bill", "Streaming service",
  "Birthday gift", "Pharmacy", "Haircut", "Parking fee",
  "Book purchase", "Concert tickets", "Home repair", "Pet supplies",
  "Flight ticket", "Hotel stay", "Software license", "Furniture",
  "Water bill", "Internet bill", "Charity donation", "Bike repair",
  "Museum entry", "Dry cleaning", "Plant nursery", "Bakery",
  "Taxi ride", "Notebook set", "Yoga class", "Sunglasses",
];

async function seed() {
  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    user = await User.create({ name: "Demo User", email: DEMO_EMAIL, password: DEMO_PASSWORD });
    console.log(`Created demo user: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  }

  const existingCount = await Expense.countDocuments({ user: user.id });
  if (existingCount > 0) {
    console.log(`Demo user already has ${existingCount} expenses - skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  const now = Date.now();
  const docs = SAMPLE_TITLES.map((title, i) => ({
    user: user!.id,
    title,
    shortDescription: `${title} - sample expense for testing`,
    fullDescription: `This is a seeded sample expense titled "${title}", generated to populate the dashboard charts, explore feed, and manage table with realistic-looking data.`,
    amount: Math.round((15 + Math.random() * 585) * 100) / 100,
    category: EXPENSE_CATEGORIES[i % EXPENSE_CATEGORIES.length],
    priority: EXPENSE_PRIORITIES[i % EXPENSE_PRIORITIES.length],
    date: new Date(now - i * 4.5 * 24 * 60 * 60 * 1000),
  }));

  await Expense.insertMany(docs);
  console.log(`Seeded ${docs.length} expenses for ${DEMO_EMAIL}.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
