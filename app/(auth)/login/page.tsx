"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth, ApiRequestError } from "@/context/AuthContext";
import { loginSchema } from "@/lib/validation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path.join(".")] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(result.data.email, result.data.password);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        toast.error(err.message);
        if (err.fieldErrors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(err.fieldErrors)) {
            fieldErrors[key] = msgs[0] ?? "";
          }
          setErrors(fieldErrors);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDemo() {
    setIsDemoLoading(true);
    try {
      await demoLogin();
    } catch {
      toast.error("Couldn't start the demo. Try again.");
    } finally {
      setIsDemoLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center bg-paper py-16">
      <Container className="max-w-md">
        <div className="rounded-2xl border border-paper-line bg-white p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1.5 text-sm text-ink/60">Log in to see your dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="••••••••"
            />
            <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="mt-2">
              Log in
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-paper-line" />
            <span className="text-xs uppercase tracking-wide text-ink/40">Or</span>
            <div className="h-px flex-1 bg-paper-line" />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            isLoading={isDemoLoading}
            onClick={handleDemo}
          >
            Demo login
          </Button>
          <p className="mt-2 text-center text-xs text-ink/40">
            Instantly signs you into a shared account pre-loaded with sample expenses.
          </p>

          <p className="mt-6 text-center text-sm text-ink/60">
            New here?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
