import { createFileRoute, Link } from "@tanstack/react-router";

const title = "Admin Dashboard — Discover Bulgaria";
const description = "Manage community content and platform activity on Discover Bulgaria.";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AdminDashboardPage,
});

const stats = [
  { label: "Waiting for Review", value: "0" },
  { label: "Published", value: "0" },
  { label: "Rejected", value: "0" },
  { label: "Total Places", value: "0" },
] as const;

function AdminDashboardPage() {
  return (
    <div className="container-page pt-34 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase">Admin</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Discover Bulgaria Admin
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Manage community content and platform activity.
          </p>
        </div>
        <Link
          to="/admin/places"
          className="rounded-[var(--radius-button)] bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          Manage Places
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-3 font-display text-4xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-foreground">Recent Submissions</h2>
        <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        </div>
      </section>
    </div>
  );
}
