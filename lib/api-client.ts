import type { ApiError } from "@/types";

export class ApiRequestError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Thin fetch wrapper: always sends cookies, always parses JSON, and throws
 * a typed ApiRequestError (with field-level messages) on non-2xx so callers
 * can just try/catch instead of checking res.ok everywhere.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = path;
  if (params) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const qs = search.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const errBody = (body ?? {}) as ApiError;
    throw new ApiRequestError(
      errBody.error || "Something went wrong. Please try again.",
      res.status,
      errBody.fieldErrors
    );
  }

  return (body?.data ?? body) as T;
}
