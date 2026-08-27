import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  tone?: "default" | "inverted";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  tone = "default",
}: Props) {
  const inverted = tone === "inverted";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-4 flex items-center gap-3",
              inverted ? "text-primary-foreground/70" : "text-accent",
              align === "center" && "justify-center",
            )}
          >
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            <span className="eyebrow">{eyebrow}</span>
          </p>
        ) : null}
        <h2
          className={cn(
            "text-[2rem] leading-[1.06] sm:text-4xl md:text-5xl",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-5 text-base leading-relaxed",
              inverted ? "text-primary-foreground/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
