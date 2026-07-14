import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Log it",
    description:
      "Add an expense in under 15 seconds: title, amount, category, priority, and date. Everything else is optional.",
  },
  {
    number: "02",
    title: "Tag it",
    description:
      "Every entry gets a category and a priority, so a $6 coffee and a $1,400 rent payment never get lumped together.",
  },
  {
    number: "03",
    title: "Track it",
    description:
      "Your dashboard updates immediately - totals, this month's spend, your highest category, all recalculated live.",
  },
  {
    number: "04",
    title: "Refine it",
    description:
      "Search, filter, sort, or edit any entry from the Manage table. Nothing is locked in once it's logged.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper-dim py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="The workflow"
          title="Four steps, repeated every time you spend."
          description="Ledger doesn't ask you to change habits - it just asks you to log the expense once."
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              <span className="font-amount text-4xl font-semibold text-primary/25">{step.number}</span>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{step.description}</p>
              {i < STEPS.length - 1 && (
                <div className="mt-6 hidden h-px w-full bg-paper-line lg:block" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
