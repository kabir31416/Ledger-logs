"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PRIORITY_COLORS, type ExpensePriority } from "@/config/constants";
import { formatCurrency } from "@/lib/utils";
import { FiBarChart2 } from "react-icons/fi";

interface PriorityBarChartProps {
  data: { priority: string; total: number }[];
}

export function PriorityBarChart({ data }: PriorityBarChartProps) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-sm font-semibold text-ink">Spending by priority</h3>
      {data.length === 0 ? (
        <div className="py-8">
          <EmptyState icon={<FiBarChart2 size={20} />} title="No data yet" description="Add an expense to see this chart." />
        </div>
      ) : (
        <div className="mt-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-paper-line)" />
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} stroke="var(--color-ink)" opacity={0.5} />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="var(--color-ink)"
                opacity={0.5}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.priority}
                    fill={PRIORITY_COLORS[entry.priority as ExpensePriority] ?? "#64748b"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
