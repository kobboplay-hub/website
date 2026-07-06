"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { CustomerProfile } from "@/lib/shopify/customer-types";
import { mapAuthErrorMessage } from "@/lib/auth/messages";

interface AuthContextValue {
  user: CustomerProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: (redirectTo?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return mapAuthErrorMessage(
      data.error ?? "Something went wrong. Please try again.",
      data.code,
    );
  } catch {
    return "We're having trouble connecting. Please check your internet and try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/customer/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.customer);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const data = await response.json();
      setUser(data.customer);
    },
    [],
  );

  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const result = await response.json();
      setUser(result.customer);
    },
    [],
  );

  const logout = useCallback(async (redirectTo = "/login") => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push(redirectTo);
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
