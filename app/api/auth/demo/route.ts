import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Expense } from "@/models/Expense";
import { signToken, AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { ok, withErrorHandling } from "@/lib/api-utils";
import { EXPENSE_CATEGORIES, EXPENSE_PRIORITIES } from "@/config/constants";
import type { PublicUser } from "@/types";

const DEMO_EMAIL = "hi@programminghero.com";
const DEMO_PASSWORD = "Ph@heroB13";


export async function POST() {
  return withErrorHandling(async () => {
    await connectDB();

    let user = await User.findOne({ email: DEMO_EMAIL });

    if (!user) {
      user = await User.create({
        name: "Demo User",
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });
      await seedDemoExpenses(user.id);
    }

    const token = await signToken({ userId: user.id, email: user.email });

    const publicUser: PublicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };

    const res = ok(publicUser, 200, "Logged in as demo user");
    res.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
    return res;
  });
}

async function seedDemoExpenses(userId: string) {
  const titles = [
    "Grocery run",
    "Uber to airport",
    "Monthly rent",
    "Electric bill",
    "Movie night",
    "Dentist visit",
    "New headphones",
    "Online course",
    "Weekend trip",
    "Coffee subscription",
    "Gym membership",
    "Laptop stand",
  ];

  const now = Date.now();
  const docs = titles.map((title, i) => ({
    user: userId,
    title,
    shortDescription: `${title} - demo expense`,
    fullDescription: `This is a seeded demo expense (${title}) used to showcase charts, filtering, and search without needing to add data manually.`,
    amount: Math.round((20 + Math.random() * 480) * 100) / 100,
    category: EXPENSE_CATEGORIES[i % EXPENSE_CATEGORIES.length],
    priority: EXPENSE_PRIORITIES[i % EXPENSE_PRIORITIES.length],
    date: new Date(now - i * 4 * 24 * 60 * 60 * 1000),
  }));

  await Expense.insertMany(docs);
}
