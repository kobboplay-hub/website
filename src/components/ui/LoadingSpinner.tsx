import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-10 w-10",
};

export default function LoadingSpinner({
  label = "Loading",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2
        className={`animate-spin text-kobbo-yellow ${sizeMap[size]}`}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
      {size !== "sm" && (
        <p className="text-sm text-kobbo-muted">{label}…</p>
      )}
    </div>
  );
}
