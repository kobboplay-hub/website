"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { AuthCardShell } from "@/components/account/PageShell";
import { useAuth } from "@/context/auth-context";
import { parseShopifyResetUrl } from "@/lib/auth/reset-password";

interface ResetPasswordFormProps {
  resetUrl?: string | null;
  customerId?: string | null;
  resetToken?: string | null;
  allowManualLink?: boolean;
}

export default function ResetPasswordForm({
  resetUrl: initialResetUrl,
  customerId: initialCustomerId,
  resetToken: initialResetToken,
  allowManualLink = true,
}: ResetPasswordFormProps) {
  const [resetUrl, setResetUrl] = useState(initialResetUrl ?? "");
  const [customerId, setCustomerId] = useState(initialCustomerId ?? "");
  const [resetToken, setResetToken] = useState(initialResetToken ?? "");
  const [manualLink, setManualLink] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  const hasValidLink = Boolean(resetUrl || (customerId && resetToken));

  const applyManualLink = () => {
    setError("");
    const parsed = parseShopifyResetUrl(manualLink);
    if (!parsed) {
      setError("Please paste a valid reset link from your email.");
      return;
    }

    setResetUrl(parsed.resetUrl);
    if (parsed.customerId) setCustomerId(parsed.customerId);
    if (parsed.resetToken) setResetToken(parsed.resetToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          resetUrl: resetUrl || undefined,
          customerId: customerId || undefined,
          resetToken: resetToken || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Password reset failed.");
      }

      setDone(true);
      await refreshUser();
      setTimeout(() => router.push("/account"), 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Password reset failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!hasValidLink && allowManualLink) {
    return (
      <AuthCardShell
        title="Reset Password"
        subtitle="Paste the reset link from your email to continue on Kobbo"
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-kobbo-yellow/20 px-4 py-3 text-left text-xs leading-relaxed text-kobbo-black">
            <p className="font-semibold">Email link Shopify pe khul raha hai?</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4">
              <li>Email mein &quot;Reset password&quot; par right-click karein</li>
              <li>&quot;Copy link&quot; / link copy karein</li>
              <li>Niche paste karein aur Continue dabayein</li>
              <li>Naya password set karein — aap Kobbo site par rahenge</li>
            </ol>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="manualLink"
              className="text-sm font-semibold text-kobbo-black"
            >
              Reset link from email
            </label>
            <textarea
              id="manualLink"
              value={manualLink}
              onChange={(e) => setManualLink(e.target.value)}
              placeholder="https://shopify.com/... or https://your-store.myshopify.com/account/reset/..."
              rows={3}
              className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none focus:border-kobbo-yellow"
            />
          </div>

          <button
            type="button"
            onClick={applyManualLink}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft"
          >
            Continue
          </button>

          <p className="text-center text-sm text-kobbo-muted">
            <Link
              href="/forgot-password"
              className="font-semibold text-kobbo-black hover:underline"
            >
              Request a new reset email
            </Link>
          </p>
        </div>
      </AuthCardShell>
    );
  }

  if (!hasValidLink) {
    return (
      <AuthCardShell title="Invalid Reset Link">
        <div className="text-center">
          <p className="text-sm text-kobbo-muted">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/reset-password"
            className="mt-4 inline-block text-sm font-semibold text-kobbo-black hover:underline"
          >
            Paste reset link manually →
          </Link>
          <Link
            href="/forgot-password"
            className="mt-6 inline-flex rounded-full bg-kobbo-yellow px-6 py-3 text-sm font-bold text-kobbo-black shadow-soft"
          >
            Request New Link
          </Link>
        </div>
      </AuthCardShell>
    );
  }

  if (done) {
    return (
      <AuthCardShell title="Password Updated">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-kobbo-green" />
          <p className="mt-4 text-sm text-kobbo-muted">
            Password reset ho gaya. Aapko account page par bhej rahe hain…
          </p>
        </div>
      </AuthCardShell>
    );
  }

  return (
    <AuthCardShell
      title="Set New Password"
      subtitle="Apna naya Kobbo password set karein"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <div>
          <label
            htmlFor="password"
            className="text-sm font-semibold text-kobbo-black"
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none focus:border-kobbo-yellow"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-kobbo-black"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none focus:border-kobbo-yellow"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Reset Password
        </button>
      </form>
    </AuthCardShell>
  );
}
