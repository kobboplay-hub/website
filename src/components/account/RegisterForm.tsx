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

type FieldError = "firstName" | "lastName" | "email" | "password" | "confirmPassword" | "general";

function inputClass(hasError: boolean) {
  return `mt-1.5 w-full rounded-2xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-500"
      : "border-kobbo-beige bg-kobbo-cream focus:border-kobbo-yellow"
  }`;
}

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [errorFields, setErrorFields] = useState<FieldError[]>([]);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const setFieldError = (fields: FieldError[], message: string) => {
    setError(message);
    setErrorFields(fields);
  };

  const clearError = () => {
    setError("");
    setErrorFields([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!firstName) {
      setFieldError(["firstName"], "Please enter your first name.");
      return;
    }
    if (!lastName) {
      setFieldError(["lastName"], "Please enter your last name.");
      return;
    }
    if (!email) {
      setFieldError(["email"], "Please enter your email address.");
      return;
    }
    if (!password) {
      setFieldError(["password"], "Please enter a password.");
      return;
    }
    if (password.length < 5) {
      setFieldError(["password"], "Password must be at least 5 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFieldError(["password", "confirmPassword"], "Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      router.push(redirectTo);
    } catch (err) {
      const raw =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      const msg = mapAuthErrorMessage(raw);
      const emailRelated = /email|account|taken|exists|registered/i.test(msg);
      setFieldError(emailRelated ? ["email"] : ["general"], msg);
    } finally {
      setLoading(false);
    }
  };

  const has = (field: FieldError) => errorFields.includes(field);

  return (
    <AuthCardShell
      title="Create Account"
      subtitle="Join Kobbo for a playful shopping experience"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthAlert variant="error">{error}</AuthAlert>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className={`text-sm font-semibold ${has("firstName") ? "text-red-600" : "text-kobbo-black"}`}
            >
              First name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); if (has("firstName")) clearError(); }}
              className={inputClass(has("firstName"))}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className={`text-sm font-semibold ${has("lastName") ? "text-red-600" : "text-kobbo-black"}`}
            >
              Last name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); if (has("lastName")) clearError(); }}
              className={inputClass(has("lastName"))}
            />
          </div>
        </div>

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
            className={inputClass(has("email"))}
          />
        </div>

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(v) => { setPassword(v); if (has("password")) clearError(); }}
          hasError={has("password")}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={(v) => { setConfirmPassword(v); if (has("confirmPassword")) clearError(); }}
          hasError={has("confirmPassword")}
        />

        <p className="text-xs leading-relaxed text-kobbo-muted">
          Sign in using email. Mobile login can be enabled later if required.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:bg-kobbo-yellow-light disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create Account
        </button>
        <p className="text-center text-sm text-kobbo-muted">
          Already have an account?{" "}
          <Link
            href={
              redirectTo !== "/account"
                ? `/login?redirect=${encodeURIComponent(redirectTo)}`
                : "/login"
            }
            className="font-semibold text-kobbo-black hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
