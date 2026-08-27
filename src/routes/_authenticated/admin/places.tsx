import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";

const title = "Manage Places — Discover Bulgaria";
const description = "Review, publish and organise places submitted by the community.";

const tabs = ["For Review", "Published", "Rejected", "All"] as const;

export const Route = createFileRoute("/_authenticated/admin/places")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ManagePlacesPage,
});

function ManagePlacesPage() {
  const [active, setActive] = useState<(typeof tabs)[number]>("For Review");

  return (
    <div className="container-page pt-34 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Admin</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Manage Places
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Review submissions and keep the collection curated.
          </p>
        </div>
        <Link
          to="/admin"
          className="rounded-[var(--radius-button)] border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Back to Dashboard
        </Link>
      </div>

      <div
        role="tablist"
        aria-label="Place status"
        className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              "rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-colors",
              active === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No places to manage yet.</p>
      </div>
    </div>
  );
}
