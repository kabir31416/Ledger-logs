"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/config/constants";

const TAPE_ITEMS = [
  { title: "Grocery run", category: "Food" as const, amount: 64.2 },
  { title: "Uber to airport", category: "Transport" as const, amount: 38.5 },
  { title: "Monthly rent", category: "Housing" as const, amount: 1450 },
  { title: "Electric bill", category: "Utilities" as const, amount: 92.1 },
  { title: "Movie night", category: "Entertainment" as const, amount: 27.0 },
];

const TAPE_TOTAL = TAPE_ITEMS.reduce((sum, i) => sum + i.amount, 0);

export function Hero() {
  const { demoLogin } = useAuth();

  async function handleTryDemo() {
    try {
      await demoLogin();
    } catch (err) {
      toast.error(err instanceof ApiRequestError ? err.message : "Couldn't start the demo. Try again.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-5%] h-80 w-80 rounded-full bg-positive/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div className="animate-fade-in">
          <p className="mb-5 font-amount text-xs font-semibold uppercase tracking-[0.25em] text-attention">
            Expense tracking, itemized
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
            Know where every dollar goes.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70">
            Ledger logs, categorizes, and charts your spending automatically - so the next
            surprise credit card bill isn&apos;t a surprise.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Start tracking free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-paper/20 text-paper hover:bg-white/10" onClick={handleTryDemo}>
              Try the live demo
            </Button>
          </div>
          <p className="mt-5 text-sm text-paper/40">
            No credit card. <Link href="/explore" className="underline hover:text-paper/70">Browse public expenses</Link> without an account.
          </p>
        </div>

        <div className="relative animate-ticker-up [animation-delay:150ms]">
          <div className="rounded-2xl border border-ink-line bg-ink-soft p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink-line pb-4">
              <span className="font-display text-sm font-semibold text-paper">Today&apos;s ledger</span>
              <span className="font-amount text-xs text-paper/40">Live preview</span>
            </div>
            <ul className="divide-y divide-ink-line">
              {TAPE_ITEMS.map((item, i) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between py-3 animate-ticker-up"
                  style={{ animationDelay: `${300 + i * 120}ms` }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                    />
                    <span className="text-sm text-paper/80">{item.title}</span>
                  </div>
                  <span className="font-amount text-sm text-paper/90">{formatCurrency(item.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-ink-line pt-4">
              <span className="text-sm font-medium text-paper">Total</span>
              <span className="font-amount text-xl font-semibold text-positive">
                <AnimatedNumber value={TAPE_TOTAL} formatter={(n) => formatCurrency(n)} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ledger-divider ledger-divider--ink" />
    </section>
  );
}
