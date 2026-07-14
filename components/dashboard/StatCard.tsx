import type { IconType } from "react-icons";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  icon: IconType;
  label: string;
  value: string;
  sublabel?: string;
  accent?: "primary" | "positive" | "attention";
}

const ACCENT_CLASSES = {
  primary: "bg-primary-soft text-primary-dark",
  positive: "bg-positive-soft text-positive-dark",
  attention: "bg-attention-soft text-attention-dark",
};

export function StatCard({ icon: Icon, label, value, sublabel, accent = "primary" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${ACCENT_CLASSES[accent]}`}>
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-ink/60">{label}</span>
      </div>
      <div className="font-amount mt-4 text-2xl font-semibold text-ink sm:text-3xl">{value}</div>
      {sublabel && <p className="mt-1 text-xs text-ink/45">{sublabel}</p>}
    </Card>
  );
}
