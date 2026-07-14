import Link from "next/link";
import { FiGithub, FiTwitter, FiMail,  } from "react-icons/fi";

const PRODUCT_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#categories", label: "Categories" },
  { href: "/#faq", label: "FAQ" },
];

const ACCOUNT_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Create account" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink text-paper/70">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-paper">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
                L
              </span>
              Ledger
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
              A fast, no-nonsense way to see where your money actually goes - every expense,
              accounted for.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com/kabir31416/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-line text-paper/70 transition-colors hover:border-primary hover:text-paper"
              >
                <FiGithub size={16} />
              </a>
              <a
                href="https://x.com/kabir31416/"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-line text-paper/70 transition-colors hover:border-primary hover:text-paper"
              >
                <FiTwitter size={16} />
              </a>
              <a
                href="mailto:hello@ledgerlogs.app"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-line text-paper/70 transition-colors hover:border-primary hover:text-paper"
              >
                <FiMail size={16} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-paper">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-paper/60 hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-paper">Account</h3>
            <ul className="mt-4 space-y-2.5">
              {ACCOUNT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-paper/60 hover:text-paper">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-paper">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-paper/60 hover:text-paper">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-paper/60 hover:text-paper">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="ledger-divider ledger-divider--ink mt-12" />
        <p className="mt-6 text-xs text-paper/40">
          &copy; {new Date().getFullYear()} Ledger Logs. Built as a premium expense tracker.
        </p>
      </div>
    </footer>
  );
}
