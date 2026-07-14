import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from "@/config/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Categories() {
  return (
    <section id="categories" className="bg-paper py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Ten buckets, no junk drawer"
          title="A category for everything, so nothing hides in 'Other'."
          description="Every expense fits somewhere specific - which is what makes the charts underneath actually mean something."
        />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {EXPENSE_CATEGORIES.map((category) => (
            <div
              key={category}
              className="flex flex-col items-start gap-3 rounded-xl border border-paper-line bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: CATEGORY_COLORS[category] }}
              >
                {category[0]}
              </span>
              <span className="font-display text-sm font-semibold text-ink">{category}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
