import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/AppButton";
import { Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";

const SETUP_ENDPOINT = "/api/public/initial-admin-setup";

/**
 * One-time bootstrap panel. Only rendered while no admin exists; the privileged
 * setup endpoint itself re-checks and refuses once the first admin is created.
 */
export function InitialAdminSetup() {
  const status = useQuery({
    queryKey: ["admin-setup-status"],
    queryFn: async (): Promise<{ adminExists: boolean }> => {
      const res = await fetch(SETUP_ENDPOINT);
      if (!res.ok) throw new Error("Could not check admin status.");
      return res.json();
    },
    staleTime: 60_000,
  });

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (status.isLoading || status.isError || status.data?.adminExists || done) return null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(SETUP_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(payload.error ?? "Could not create the initial admin.");
      setDone(true);
      toast.success("Initial admin created. You can sign in with that account now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the initial admin.");
      await status.refetch();
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <div className="mt-8 rounded-[var(--radius-button)] border border-dashed border-border bg-secondary/40 p-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">Setup</p>
      <p className="mt-2 text-sm text-muted-foreground">
        No administrator exists yet. Create the first admin account for this site.
      </p>

      {open ? (
        <form onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
          {error ? <FormAlert>{error}</FormAlert> : null}
          <Field id="admin-email" label="Admin email">
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className={inputClasses()}
            />
          </Field>
          <Field id="admin-password" label="Admin password">
            <input
              id="admin-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={inputClasses()}
            />
          </Field>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Creating…" : "Create Initial Admin"}
          </Button>
        </form>
      ) : (
        <Button type="button" variant="outline" className="mt-4" onClick={() => setOpen(true)}>
          Create Initial Admin
        </Button>
      )}
    </div>
  );
}
