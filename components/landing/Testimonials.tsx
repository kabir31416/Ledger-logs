import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { initials } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "I stopped guessing why my card statement felt high. Turns out it was takeout, every time - the pie chart made that obvious in a week.",
    name: "Priya Nair",
    role: "Freelance designer",
  },
  {
    quote:
      "Tagging every purchase by priority sounds tedious, but it's the reason I finally know which expenses I can actually cut.",
    name: "Marcus Webb",
    role: "Small business owner",
  },
  {
    quote:
      "The manage table with sorting and filtering is what sold me - I can find one weird transaction from three months ago in ten seconds.",
    name: "Elena Rossi",
    role: "Graduate student",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-paper-dim py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Who's using it"
          title="People who got tired of guessing where the money went."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-xl border border-paper-line bg-white p-6">
              <blockquote className="flex-1 text-sm leading-relaxed text-ink/75">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-paper-line pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-dark">
                  {initials(t.name)}
                </span>
                <div>
                  <div className="text-sm font-medium text-ink">{t.name}</div>
                  <div className="text-xs text-ink/50">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
