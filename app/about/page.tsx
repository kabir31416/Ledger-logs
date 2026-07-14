import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About - Ledger",
  description: "Why Ledger exists and how it handles your data.",
};

const VALUES = [
  {
    title: "Itemized, not summarized",
    body: "Most budgeting apps flatten your spending into a single monthly number. Ledger keeps every entry - title, description, category, priority - so you can trace a total back to the actual purchase.",
  },
  {
    title: "Your data stays yours",
    body: "Every read and write is checked against the logged-in user server-side, not just hidden in the UI. There's no ad network, no data resale - the product is the product.",
  },
  {
    title: "Fast enough to actually use",
    body: "The whole point of a tracker is that you keep using it. Adding an expense takes under a minute, and the dashboard updates the moment you do.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-paper py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="About Ledger"
          title="Built for people who want the real number, not the rounded one."
          align="left"
        />
        <div className="mt-10 space-y-8">
          {VALUES.map((v) => (
            <div key={v.title} className="border-l-2 border-primary/30 pl-5">
              <h2 className="font-display text-lg font-semibold text-ink">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{v.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-paper-line bg-white p-6">
          <h2 className="font-display text-base font-semibold text-ink">A demo project</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Ledger is a demonstration full-stack expense tracker built with Next.js, MongoDB, and
            JWT authentication. Explore the public feed, create a free account, or use the demo
            login to see the dashboard and charts with sample data already loaded.
          </p>
        </div>
      </Container>
    </div>
  );
}
