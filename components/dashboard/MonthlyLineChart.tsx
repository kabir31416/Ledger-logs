"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { FiTrendingUp } from "react-icons/fi";

interface MonthlyLineChartProps {
  data: { month: string; total: number }[];
}

function formatMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function MonthlyLineChart({ data }: MonthlyLineChartProps) {
  const chartData = data.map((d) => ({ ...d, label: formatMonthLabel(d.month) }));

  return (
    <Card className="p-5">
      <h3 className="font-display text-sm font-semibold text-ink">Spending over time</h3>
      {data.length === 0 ? (
        <div className="py-8">
          <EmptyState icon={<FiTrendingUp size={20} />} title="No data yet" description="Add an expense to see this chart." />
        </div>
      ) : (
        <div className="mt-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-paper-line)" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--color-ink)" opacity={0.5} />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--color-ink)"
                opacity={0.5}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--color-primary)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
