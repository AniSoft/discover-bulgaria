import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Sign In — Discover Bulgaria";
const description = "Sign in to save favorite places and submit your own discoveries in Bulgaria.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <PageShell
      title="Sign In"
      description="Accounts arrive in a later step. For now this page holds the layout."
    />
  );
}
