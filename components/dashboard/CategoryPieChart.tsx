"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORY_COLORS, type ExpenseCategory } from "@/config/constants";
import { formatCurrency } from "@/lib/utils";
import { FiPieChart } from "react-icons/fi";

interface CategoryPieChartProps {
  data: { category: string; total: number }[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    <Card className="p-5">
      <h3 className="font-display text-sm font-semibold text-ink">Spending by category</h3>
      {data.length === 0 ? (
        <div className="py-8">
          <EmptyState icon={<FiPieChart size={20} />} title="No data yet" description="Add an expense to see this chart." />
        </div>
      ) : (
        <div className="mt-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category as ExpenseCategory] ?? "#64748b"}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
