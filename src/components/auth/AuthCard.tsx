import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="container-page pt-30 pb-16 sm:pt-34">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-10">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>
        {footer ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        ) : null}
      </div>
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function inputClasses(hasError?: boolean, className?: string) {
  return cn(
    "h-12 w-full rounded-[var(--radius-button)] border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15",
    hasError ? "border-destructive" : "border-border",
    className,
  );
}

export function FormAlert({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[var(--radius-button)] border px-4 py-3 text-sm",
        tone === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-success/30 bg-success/10 text-foreground",
      )}
    >
      {children}
    </div>
  );
}
