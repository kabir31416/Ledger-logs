"use client";

import { FiDollarSign, FiCalendar, FiTag, FiTrendingUp, FiInbox } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { MonthlyLineChart } from "@/components/dashboard/MonthlyLineChart";
import { PriorityBarChart } from "@/components/dashboard/PriorityBarChart";
import { RecentExpensesList } from "@/components/dashboard/RecentExpensesList";
import { useAuth } from "@/context/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardStats();
  const firstName = user?.name.split(" ")[0];

  return (
    <div className="bg-paper py-10 sm:py-14">
      <Container>
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Dashboard"}
          </h1>
          <p className="mt-1.5 text-sm text-ink/60">Here&apos;s where your money went.</p>
        </div>

        {error && (
          <EmptyState icon={<FiInbox size={22} />} title="Couldn't load your dashboard" description={error} />
        )}

        {!error && isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        )}

        {!error && !isLoading && data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={FiDollarSign}
                label="Total expenses"
                value={formatCurrency(data.totalExpenses)}
                sublabel={`${data.totalCount} entries`}
                accent="primary"
              />
              <StatCard
                icon={FiCalendar}
                label="This month"
                value={formatCurrency(data.thisMonthTotal)}
                sublabel={`${data.thisMonthCount} entries`}
                accent="positive"
              />
              <StatCard
                icon={FiTag}
                label="Highest category"
                value={data.highestCategory ? data.highestCategory.category : "—"}
                sublabel={data.highestCategory ? formatCurrency(data.highestCategory.total) : "No data yet"}
                accent="attention"
              />
              <StatCard
                icon={FiTrendingUp}
                label="Average expense"
                value={formatCurrency(data.averageExpense)}
                sublabel="Per entry"
                accent="primary"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryPieChart data={data.byCategory} />
              <MonthlyLineChart data={data.byMonth} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <PriorityBarChart data={data.byPriority} />
              <RecentExpensesList expenses={data.recentExpenses} />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
