import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { supabase } from "@/integrations/supabase/client";
import { safeRedirect } from "@/lib/safe-redirect";
import { InitialAdminSetup } from "@/components/auth/InitialAdminSetup";
import { useT } from "@/lib/i18n";

const title = "Sign In | Discover Bulgaria";
const description = "Sign in to save favorite places and submit your own discoveries in Bulgaria.";

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search['redirect'] === "string" ? { redirect: search['redirect'] } : {},
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
  const t = useT();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) nextErrors.email = t("auth.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = t("auth.emailInvalid");
    if (!password) nextErrors.password = t("auth.passwordRequired");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);

    if (error) {
      setFormError(
        error.message.toLowerCase().includes("invalid")
          ? t("auth.invalidCredentials")
          : error.message,
      );
      return;
    }

    const target = safeRedirect(search.redirect);
    navigate({ to: target, replace: true });
  }

  return (
    <AuthCard
      eyebrow={t("auth.welcomeBack")}
      title={t("auth.signInTitle")}
      description={t("auth.signInDescription")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("auth.createOne")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <Field id="email" label={t("auth.email")} error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            aria-invalid={Boolean(errors.email)}
            className={inputClasses(Boolean(errors.email))}
          />
        </Field>

        <Field id="password" label={t("auth.password")} error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholderDots")}
            aria-invalid={Boolean(errors.password)}
            className={inputClasses(Boolean(errors.password))}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <InitialAdminSetup />
    </AuthCard>
  );
}
