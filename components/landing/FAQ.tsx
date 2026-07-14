"use client";

import { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FAQS = [
  {
    question: "Is my financial data private?",
    answer:
      "Your expenses are scoped to your account on every request - the server checks ownership on every read and write, not just the UI. Nobody else can see, edit, or delete your entries.",
  },
  {
    question: "What's the difference between Explore and Manage Expenses?",
    answer:
      "Explore is a public, read-only feed for browsing example entries without an account. Manage Expenses is your private table - only you can see it, and it's where you edit or delete your own entries.",
  },
  {
    question: "Can I try it without creating an account?",
    answer:
      "Yes - use the Demo Login button on the login page (or 'Try the live demo' above) to sign into a shared demo account pre-loaded with sample expenses.",
  },
  {
    question: "How is my password stored?",
    answer:
      "Passwords are hashed with bcrypt before they ever touch the database - Ledger never stores or logs a plain-text password.",
  },
  {
    question: "Can I add an expense without a full description?",
    answer:
      "Title, a short description, amount, category, priority, and date are required. Full description and an image URL are optional.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
        <div className="mt-10 divide-y divide-paper-line rounded-xl border border-paper-line bg-white">
          {FAQS.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-sm font-semibold text-ink sm:text-base">
                    {faq.question}
                  </span>
                  <HiChevronDown
                    size={18}
                    className={`shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-ink/60">{faq.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
