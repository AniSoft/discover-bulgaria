import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const title = "Profile — Discover Bulgaria";
const description = "Your Discover Bulgaria profile, submissions and saved places.";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, fullName, initials, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <PageShell
      title="Your profile"
      description="Update how you appear across Discover Bulgaria and keep your account secure."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl text-foreground">
                {fullName || "Traveller"}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <hr className="my-7 border-border" />

          <NameForm currentName={fullName} />

          <hr className="my-7 border-border" />

          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              navigate({ to: "/", replace: true });
            }}
          >
            Sign out
          </Button>
        </section>

        <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl text-foreground">Change password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose a new password of at least 6 characters.
          </p>
          <div className="mt-6">
            <PasswordForm />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function NameForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    if (name.trim().length > 80) {
      setError("Full name must be under 80 characters.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error ? <FormAlert>{error}</FormAlert> : null}
      {saved ? <FormAlert tone="success">Your name has been updated.</FormAlert> : null}

      <Field id="full-name" label="Full name" error={undefined}>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          className={inputClasses(Boolean(error))}
        />
      </Field>

      <Field id="email-readonly" label="Email">
        <input
          id="email-readonly"
          type="email"
          value={useAuth().user?.email ?? ""}
          readOnly
          disabled
          className={inputClasses(false, "cursor-not-allowed bg-secondary/50 text-muted-foreground")}
        />
      </Field>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setDone(false);

    const next: { password?: string; confirmPassword?: string } = {};
    if (!password) next.password = "New password is required.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    setPassword("");
    setConfirmPassword("");
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError ? <FormAlert>{formError}</FormAlert> : null}
      {done ? <FormAlert tone="success">Your password has been changed.</FormAlert> : null}

      <Field id="new-password" label="New password" error={errors.password}>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={Boolean(errors.password)}
          className={inputClasses(Boolean(errors.password))}
        />
      </Field>

      <Field id="confirm-new-password" label="Confirm new password" error={errors.confirmPassword}>
        <input
          id="confirm-new-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={Boolean(errors.confirmPassword)}
          className={inputClasses(Boolean(errors.confirmPassword))}
        />
      </Field>

      <Button type="submit" variant="accent" disabled={saving}>
        {saving ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
