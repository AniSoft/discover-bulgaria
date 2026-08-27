import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  const t = useT();
  return (
    <div className="container-page pt-32 pb-16 md:pt-36">
      <header className="max-w-2xl">
        <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </header>
      <div className="mt-10 md:mt-12">
        {children ?? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">{t("common.pageComingSoon")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
