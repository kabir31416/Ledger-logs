import { Container } from "@/components/ui/Container";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const STATS = [
  { value: 10, suffix: "", label: "Expense categories tracked" },
  { value: 3, suffix: "", label: "Chart types on one dashboard" },
  { value: 15, suffix: "s", label: "Average time to log an expense" },
  { value: 100, suffix: "%", label: "Of your data scoped to your account" },
];

export function Stats() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-8 rounded-2xl border border-paper-line bg-white p-8 sm:p-12 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="font-amount text-4xl font-semibold text-primary sm:text-5xl">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              <p className="mt-2 text-sm text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
