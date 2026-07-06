import { AlertCircle, CheckCircle2 } from "lucide-react";

interface AuthAlertProps {
  variant: "error" | "success";
  children: React.ReactNode;
}

export default function AuthAlert({ variant, children }: AuthAlertProps) {
  if (variant === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-2.5 rounded-2xl border border-kobbo-green/20 bg-kobbo-green/10 px-4 py-3 text-sm text-kobbo-black"
      >
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-kobbo-green" />
        <span className="leading-relaxed">{children}</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-2xl border border-kobbo-yellow/40 bg-kobbo-yellow/15 px-4 py-3 text-sm text-kobbo-black"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-kobbo-black/70" />
      <span className="leading-relaxed">{children}</span>
    </div>
  );
}
