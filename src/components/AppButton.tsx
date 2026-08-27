import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "accent"
  | "outline"
  | "ghost"
  | "destructive"
  | "destructive-ghost"
  | "ivory"
  | "onImage"
  | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] font-semibold tracking-[0.08em] uppercase whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60 disabled:pointer-events-none [&_svg]:shrink-0 [&_svg]:normal-case";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  accent: "bg-accent text-accent-foreground hover:bg-accent-hover",
  outline: "border border-input bg-transparent text-foreground hover:bg-secondary",
  ghost: "text-foreground hover:bg-secondary",
  destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  "destructive-ghost": "text-destructive hover:bg-destructive/10",
  ivory: "bg-card text-primary hover:bg-stone",
  onImage:
    "border border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/15",
  link: "px-0 h-auto text-foreground hover:text-accent [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-1",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-11 px-5 text-xs",
  lg: "h-13 px-7 text-[0.8125rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
