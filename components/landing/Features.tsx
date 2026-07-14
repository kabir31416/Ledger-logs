import { FiEdit3, FiSearch, FiPieChart, FiShield, FiSmartphone, FiList } from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURES = [
  {
    icon: FiEdit3,
    title: "Itemized entries",
    description:
      "Title, short and full description, amount, category, priority, date, even an image URL - every expense gets full context, not just a number.",
  },
  {
    icon: FiSearch,
    title: "Instant search & filters",
    description:
      "Find any expense by keyword, then narrow by category, priority, amount range, or date - results update as you type.",
  },
  {
    icon: FiPieChart,
    title: "Visual breakdowns",
    description:
      "Pie, line, and bar charts turn a month of entries into a shape you can actually reason about at a glance.",
  },
  {
    icon: FiList,
    title: "Sort, page, manage",
    description:
      "A responsive table with sorting and pagination for editing or deleting entries in bulk, with a confirmation step before anything's removed.",
  },
  {
    icon: FiShield,
    title: "Bank-grade auth",
    description:
      "Passwords hashed with bcrypt, sessions signed with JWT in an httpOnly cookie, every route checked server-side.",
  },
  {
    icon: FiSmartphone,
    title: "Built for every screen",
    description:
      "The same dashboard that works on your widescreen monitor collapses cleanly to a single column on your phone.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What's inside"
          title="Everything a spending habit needs to become a spending plan."
          description="No fluff features - just the tools that turn scattered receipts into a clear picture."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-paper-line bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
