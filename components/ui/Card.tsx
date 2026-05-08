import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface border border-border rounded-[16px] shadow-[0_1px_3px_rgba(15,23,42,0.06)]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const StatusBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    tone?: "completed" | "issue" | "refunded" | "pending" | "info";
  }
>(({ className, tone = "info", ...props }, ref) => {
  const tones: Record<string, string> = {
    completed: "bg-green/15 text-[#15803d]",
    issue: "bg-coral/15 text-[#be123c]",
    refunded: "bg-cyan/15 text-[#0369a1]",
    pending: "bg-yellow/20 text-[#b45309]",
    info: "bg-bg text-text-sub",
  };
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 px-[10px] py-[3px] rounded-full text-[10px] font-bold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
});
StatusBadge.displayName = "StatusBadge";
