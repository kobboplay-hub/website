"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { AuthCardShell } from "@/components/account/PageShell";
import AuthAlert from "@/components/account/AuthAlert";
import PasswordInput from "@/components/account/PasswordInput";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorFields, setErrorFields] = useState<("email" | "password")[]>([]);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const oauthError = searchParams.get("error");

  const googleSignInHref =
    redirectTo !== "/account"
      ? `/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`
      : "/api/auth/google";

  const clearError = () => { setError(""); setErrorFields([]); };
  const has = (field: "email" | "password") => errorFields.includes(field);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email) {
      setError("Please enter your email address.");
      setErrorFields(["email"]);
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      setErrorFields(["password"]);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Login failed. Please try again.";
      const msg = mapAuthErrorMessage(raw);
      const passwordRelated = /password|credentials|unidentified/i.test(msg);
      const emailRelated = /email|account|not found/i.test(msg);
      setError(msg);
      setErrorFields(
        passwordRelated ? ["email", "password"] :
        emailRelated ? ["email"] : []
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell title="Welcome Back" subtitle="Sign in to your Kobbo account">
      <div className="space-y-5">
        <a
          href={googleSignInHref}
          className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-kobbo-beige bg-kobbo-cream py-3 text-sm font-semibold text-kobbo-black transition-all hover:border-kobbo-yellow hover:bg-kobbo-white"
        >
          <GoogleIcon />
          Continue with Google
        </a>

        <div className="relative flex items-center gap-3">
          <span className="h-px flex-1 bg-kobbo-beige" />
          <span className="text-xs font-medium text-kobbo-muted">or</span>
          <span className="h-px flex-1 bg-kobbo-beige" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-center text-sm font-semibold text-kobbo-black">
            Continue with Email
          </p>

          {error && <AuthAlert variant="error">{error}</AuthAlert>}
          {!error && oauthError && (
            <AuthAlert variant="error">{mapAuthErrorMessage(oauthError)}</AuthAlert>
          )}

          <div>
            <label
              htmlFor="email"
              className={`text-sm font-semibold ${has("email") ? "text-red-600" : "text-kobbo-black"}`}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (has("email")) clearError(); }}
              placeholder="you@example.com"
              className={`mt-1.5 w-full rounded-2xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
                has("email")
                  ? "border-red-400 bg-red-50 focus:border-red-500"
                  : "border-kobbo-beige bg-kobbo-cream focus:border-kobbo-yellow"
              }`}
            />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(v) => { setPassword(v); if (has("password")) clearError(); }}
            hasError={has("password")}
          />

          <p className="text-xs leading-relaxed text-kobbo-muted">
            Sign in using email. Mobile login can be enabled later if required.
          </p>

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
            Continue with Email
          </button>

          <p className="text-center text-sm text-kobbo-muted">
            Don&apos;t have an account?{" "}
            <Link
              href={
                redirectTo !== "/account"
                  ? `/register?redirect=${encodeURIComponent(redirectTo)}`
                  : "/register"
              }
              className="font-semibold text-kobbo-black hover:underline"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </AuthCardShell>
  );
}
