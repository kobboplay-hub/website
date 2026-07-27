"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { newsletterSection } from "@/data/home-content";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Subscription failed. Please try again.");
      }

      setStatus("success");
      setMessage(data.message ?? newsletterSection.successFallback);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription failed. Please try again.",
      );
    }
  };

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-kobbo-yellow/20 px-5 py-6 shadow-soft sm:px-8 sm:py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
              {newsletterSection.title}
            </h2>
            <p className="mt-2 text-sm text-kobbo-muted sm:text-base">
              {newsletterSection.subtitle}
            </p>

            {status === "success" ? (
              <div className="mt-5 flex flex-col items-center gap-2 rounded-2xl bg-kobbo-white px-5 py-4 text-left shadow-soft sm:px-6">
                <CheckCircle2 className="h-6 w-6 text-kobbo-black" />
                <p className="text-center text-sm font-medium text-kobbo-black sm:text-base">
                  {message}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                  }}
                  className="mt-1 text-xs font-semibold text-kobbo-muted underline-offset-2 hover:text-kobbo-black hover:underline"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form
                className="mt-4 flex flex-col gap-2.5 sm:flex-row"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={newsletterSection.placeholder}
                  required
                  disabled={status === "loading"}
                  aria-label="Email address"
                  className="min-h-11 flex-1 rounded-full border-2 border-transparent bg-kobbo-white px-5 py-2.5 text-sm text-kobbo-black placeholder:text-kobbo-muted/60 outline-none transition-colors focus:border-kobbo-yellow disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      {newsletterSection.buttonLabel}
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {status === "error" && message && (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
