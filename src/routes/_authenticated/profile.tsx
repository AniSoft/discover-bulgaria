import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";
import { privateSeo } from "@/lib/seo";

const title = "Profile | Discover Bulgaria";
const description = "Your Discover Bulgaria profile, submissions and saved places.";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => privateSeo(title, description),
  component: ProfilePage,
});

function ProfilePage() {
  const t = useT();
  const { user, fullName, initials, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <PageShell
      title={t("auth.yourProfileTitle")}
      description={t("auth.yourProfileDescription")}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl text-foreground">
                {fullName || t("auth.traveller")}
              </p>
              <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <hr className="my-7 border-border" />

          <NameForm currentName={fullName} email={user?.email ?? ""} />

          <hr className="my-7 border-border" />

          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
              navigate({ to: "/", replace: true });
            }}
          >
            {t("auth.signOut")}
          </Button>
        </section>

        <section className="rounded-[var(--radius-card)] border border-border bg-card p-6 shadow-card sm:p-8">
          <h2 className="font-display text-2xl text-foreground">{t("auth.changePasswordTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("auth.changePasswordDescription")}
          </p>
          <div className="mt-6">
            <PasswordForm />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function NameForm({ currentName, email }: { currentName: string; email: string }) {
  const t = useT();
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
      setError(t("auth.nameRequired"));
      return;
    }
    if (name.trim().length > 80) {
      setError(t("auth.nameTooLong"));
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
      {saved ? <FormAlert tone="success">{t("auth.nameUpdated")}</FormAlert> : null}

      <Field id="full-name" label={t("auth.fullName")}>
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

      <Field id="email-readonly" label={t("auth.email")}>
        <input
          id="email-readonly"
          type="email"
          value={email}
          readOnly
          disabled
          className={inputClasses(false, "cursor-not-allowed bg-secondary/50 text-muted-foreground")}
        />
      </Field>

      <Button type="submit" disabled={saving}>
        {saving ? t("auth.saving") : t("auth.saveChanges")}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const t = useT();
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
    if (!password) next.password = t("auth.newPasswordRequired");
    else if (password.length < 6) next.password = t("auth.passwordShort");
    if (confirmPassword !== password) next.confirmPassword = t("auth.passwordsDoNotMatch");
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
      {done ? <FormAlert tone="success">{t("auth.passwordChanged")}</FormAlert> : null}

      <Field id="new-password" label={t("auth.password")} error={errors.password}>
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

      <Field id="confirm-new-password" label={t("auth.confirmPassword")} error={errors.confirmPassword}>
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
        {saving ? t("auth.updating") : t("auth.updatePassword")}
      </Button>
    </form>
  );
}
