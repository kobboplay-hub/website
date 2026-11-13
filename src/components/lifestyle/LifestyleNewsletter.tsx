"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function LifestyleNewsletter({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Subscription failed. Please try again.");
      setStatus("success");
      setMessage(data.message ?? "Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.");
    }
  };

  const dark = tone === "dark";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor={`newsletter-email-${tone}`} className="sr-only">
        Email address
      </label>
      <div
        className={`flex items-center border-b transition-colors focus-within:border-current ${
          dark ? "border-ls-paper/40 text-ls-paper" : "border-ls-ink/30 text-ls-ink"
        }`}
      >
        <input
          id={`newsletter-email-${tone}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          className={`h-12 min-w-0 flex-1 bg-transparent text-sm focus:outline-none ${
            dark ? "placeholder:text-ls-paper/60" : "placeholder:text-ls-muted"
          }`}
        />
        <button
          type="submit"
          disabled={status === "submitting" || !email.trim()}
          aria-label="Subscribe"
          className="flex size-10 items-center justify-center rounded-full transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-current disabled:opacity-40"
        >
          {status === "submitting" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden />
          )}
        </button>
      </div>
      <p role="status" className={`mt-3 min-h-5 text-xs ${dark ? "text-ls-paper/75" : "text-ls-muted"}`}>
        {message}
      </p>
    </form>
  );
}
