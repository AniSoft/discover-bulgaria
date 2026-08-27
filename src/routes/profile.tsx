import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Profile — Discover Bulgaria";
const description = "Your Discover Bulgaria profile, submissions and saved places.";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return <PageShell title="Profile" description="Profile details will live here." />;
}
