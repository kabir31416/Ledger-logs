import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <Container className="relative text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Your next expense is thirty seconds from being accounted for.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-paper/65">
          Create a free account, or explore the public feed first if you'd rather see it before you
          sign up.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register">
            <Button variant="primary" size="lg">
              Create free account
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" size="lg" className="border-paper/20 text-paper hover:bg-white/10">
              Explore first
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
