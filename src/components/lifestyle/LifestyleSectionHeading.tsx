import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LifestyleSectionHeadingProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export default function LifestyleSectionHeading({ id, eyebrow, title, description, action }: LifestyleSectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ls-accent">{eyebrow}</p>}
        <h2 id={id} className="mt-3 font-ls-display text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-ls-ink sm:text-[2rem]">
          {title}
        </h2>
        {description && <p className="mt-3 text-[15px] leading-relaxed text-ls-ink-soft">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ls-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ls-ink"
        >
          {action.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={1.8} aria-hidden />
        </Link>
      )}
    </div>
  );
}
