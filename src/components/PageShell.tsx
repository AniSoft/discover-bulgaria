import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  return (
    <div className="container-page pt-34 pb-8">
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="mt-10">
        {children ?? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">
              This page is part of the next build step and will be implemented soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
