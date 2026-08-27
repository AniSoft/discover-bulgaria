import { createFileRoute } from "@tanstack/react-router";
import { ButtonLink } from "@/components/AppButton";
import { PageShell } from "@/components/PageShell";

const title = "Edit Place — Discover Bulgaria";
const description = "Edit a place you have submitted to Discover Bulgaria.";

export const Route = createFileRoute("/_authenticated/places/$id/edit")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditPlacePage,
});

function EditPlacePage() {
  return (
    <PageShell
      title="Edit place"
      description="Editing will be available in the next step."
    >
      <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Editing will be available in the next step.
        </p>
        <div className="mt-6">
          <ButtonLink to="/my-places" variant="outline">
            Back to My Places
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
