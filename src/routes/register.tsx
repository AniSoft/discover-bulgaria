import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

const title = "Create Account — Discover Bulgaria";
const description =
  "Create a Discover Bulgaria account to share hidden places and keep your own travel list.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <PageShell
      title="Create Account"
      description="Registration will be added once accounts are enabled."
    />
  );
}
