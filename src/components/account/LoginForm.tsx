"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { AuthCardShell } from "@/components/account/PageShell";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!email || !password) {
        setError("Please enter email and password.");
        return;
      }
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      title="Welcome Back"
      subtitle="Sign in to your Kobbo account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-kobbo-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none transition-colors focus:border-kobbo-yellow"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold text-kobbo-black">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none transition-colors focus:border-kobbo-yellow"
          />
        </div>
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-kobbo-muted hover:text-kobbo-black"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Login
        </button>
        <p className="text-center text-sm text-kobbo-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-kobbo-black hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
