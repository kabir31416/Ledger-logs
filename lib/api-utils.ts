import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { UnauthorizedError } from "@/lib/auth";
import { formatZodError } from "@/lib/validation";

export function ok<T>(data: T, status = 200, message?: string) {
  return NextResponse.json({ data, message }, { status });
}

export function fail(error: string, status = 400, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json({ error, fieldErrors }, { status });
}

/**
 * Wraps a route handler body so every route gets consistent error shapes
 * without repeating try/catch + status-code logic everywhere.
 */
export function withErrorHandling(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch((err: unknown) => {
    if (err instanceof UnauthorizedError) {
      return fail("You must be logged in to do that", 401);
    }
    if (err instanceof ZodError) {
      return fail("Validation failed", 422, formatZodError(err));
    }
    if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 11000) {
      return fail("An account with that email already exists", 409);
    }
    console.error("[API ERROR]", err);
    return fail("Something went wrong. Please try again.", 500);
  });
}
