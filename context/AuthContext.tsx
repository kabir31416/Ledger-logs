"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import type { PublicUser } from "@/types";

interface AuthContextValue {
  user: PublicUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    apiFetch<PublicUser>("/api/auth/me")
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const u = await apiFetch<PublicUser>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(u);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      router.push("/dashboard");
      router.refresh();
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const u = await apiFetch<PublicUser>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setUser(u);
      toast.success(`Welcome to Expense Tracker, ${u.name.split(" ")[0]}!`);
      router.push("/dashboard");
      router.refresh();
    },
    [router]
  );

  const demoLogin = useCallback(async () => {
    const u = await apiFetch<PublicUser>("/api/auth/demo", { method: "POST" });
    setUser(u);
    toast.success("Logged in with the demo account");
    router.push("/dashboard");
    router.refresh();
  }, [router]);

  const logout = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.info("Logged out");
    router.push("/");
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { ApiRequestError };
