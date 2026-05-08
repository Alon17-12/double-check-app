import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "success" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-navy to-navy-light text-white shadow-[0_8px_20px_rgba(30,58,138,0.25)] hover:brightness-110",
  secondary:
    "bg-bg text-navy hover:bg-[rgba(30,58,138,0.06)] border border-border",
  ghost: "bg-transparent text-text-main hover:bg-bg",
  success:
    "bg-gradient-to-br from-green to-[#16a34a] text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)] hover:brightness-110",
  danger:
    "bg-gradient-to-br from-coral to-[#d63384] text-white shadow-[0_8px_20px_rgba(240,86,128,0.35)] hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-sm rounded-[10px]",
  md: "px-5 py-3 text-sm rounded-[14px]",
  lg: "px-6 py-4 text-[15px] rounded-[14px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
