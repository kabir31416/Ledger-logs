import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api-client";
import type { DashboardStats } from "@/types";

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiFetch<DashboardStats>("/api/dashboard/stats")
      .then(setData)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Failed to load dashboard"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, reload: load };
}
