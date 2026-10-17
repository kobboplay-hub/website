"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, Copy, Check } from "lucide-react";
import { AuthCardShell } from "@/components/account/PageShell";
import AuthAlert from "@/components/account/AuthAlert";
import { mapAuthErrorMessage } from "@/lib/auth/messages";
import { getPasswordResetEmailLink } from "@/lib/auth/reset-password";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const emailTemplateLink = getPasswordResetEmailLink();

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(emailTemplateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to send reset email.");
      }

      setSent(true);
    } catch (err) {
      const raw =
        err instanceof Error
          ? err.message
          : "Failed to send reset email. Please try again.";
      setError(mapAuthErrorMessage(raw));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCardShell title="Check Your Email">
        <div className="text-left">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-kobbo-green" />
            <p className="mt-4 text-sm text-kobbo-muted">
              If an account exists for <strong>{email}</strong>, a password reset
              link has been sent.
            </p>
          </div>

          <p className="mt-5 rounded-xl bg-kobbo-yellow/20 px-4 py-3 text-xs leading-relaxed text-kobbo-black">
            Click the link in your email, set a new password, and you&apos;ll be
            signed in to your <strong>Kobbo</strong> account.
          </p>

          <details className="mt-4 rounded-xl border border-kobbo-beige bg-kobbo-cream p-3">
            <summary className="cursor-pointer text-xs font-semibold text-kobbo-black">
              If the link opens on Shopify.com — one-time setup
            </summary>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-kobbo-muted">
              <li>Shopify Admin → Settings → Notifications</li>
              <li>Customer account password reset → Edit</li>
              <li>Replace the reset button link with the template below</li>
              <li>Save, then send a new reset email</li>
            </ol>
            <code className="mt-2 block overflow-x-auto rounded-lg bg-kobbo-white p-2 text-[10px] leading-relaxed text-kobbo-black">
              {emailTemplateLink}
            </code>
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-kobbo-beige bg-kobbo-white px-3 py-1.5 text-xs font-semibold text-kobbo-black"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy link template
                </>
              )}
            </button>
          </details>

          <Link
            href="/login"
            className="mt-5 block text-center text-sm font-semibold text-kobbo-black hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </AuthCardShell>
    );
  }

  return (
    <AuthCardShell
      title="Forgot Password"
      subtitle="We'll email you a link to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AuthAlert variant="error">{error}</AuthAlert>}
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-kobbo-black"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-2xl border-2 border-kobbo-beige bg-kobbo-cream px-4 py-3 text-sm outline-none focus:border-kobbo-yellow"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-kobbo-yellow py-3.5 text-sm font-bold text-kobbo-black shadow-soft disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send Reset Link
        </button>
        <p className="text-center text-sm text-kobbo-muted">
          <Link
            href="/login"
            className="font-semibold text-kobbo-black hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
