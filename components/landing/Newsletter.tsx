"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.success("You're on the list - we'll email product updates only, nothing else.");
      setEmail("");
      setSubmitting(false);
    }, 500);
  }

  return (
    <section className="bg-paper-dim py-16 sm:py-20">
      <Container className="max-w-2xl text-center">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Get budgeting tips, not spam.
        </h2>
        <p className="mt-3 text-sm text-ink/60">
          One short email a month on spending patterns worth knowing about. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-11 flex-1 rounded-md border border-paper-line bg-white px-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <Button type="submit" variant="primary" isLoading={submitting}>
            Subscribe
          </Button>
        </form>
      </Container>
    </section>
  );
}
