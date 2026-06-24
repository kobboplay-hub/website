"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-kobbo-yellow/20 px-6 py-6 shadow-soft sm:px-8 sm:py-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-xl font-extrabold text-kobbo-black sm:text-2xl">
              Let&apos;s Keep the Fun Going!
            </h2>
            <p className="mt-2 text-sm text-kobbo-muted">
              Join our newsletter for offers, new toys and parenting tips.
            </p>

            <form
              className="mt-4 flex flex-col gap-2.5 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border-2 border-transparent bg-kobbo-white px-5 py-2.5 text-sm text-kobbo-black placeholder:text-kobbo-muted/60 outline-none transition-colors focus:border-kobbo-yellow"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-kobbo-yellow px-6 py-2.5 text-sm font-bold text-kobbo-black shadow-soft transition-all hover:-translate-y-0.5 hover:bg-kobbo-yellow-light"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
