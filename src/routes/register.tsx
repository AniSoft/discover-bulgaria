import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

const title = "Create Account | Discover Bulgaria";
const description =
  "Create a Discover Bulgaria account to share hidden places and keep your own travel list.";

type Errors = Partial<Record<"fullName" | "email" | "password" | "confirmPassword", string>>;

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
  const t = useT();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const next: Errors = {};
    if (!fullName.trim()) next.fullName = t("auth.nameRequired");
    else if (fullName.trim().length > 80) next.fullName = t("auth.nameTooLong");
    if (!email.trim()) next.email = t("auth.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = t("auth.emailInvalid");
    if (!password) next.password = t("auth.passwordRequired");
    else if (password.length < 6) next.password = t("auth.passwordShort");
    if (!confirmPassword) next.confirmPassword = t("auth.confirmPasswordRequired");
    else if (confirmPassword !== password) next.confirmPassword = t("auth.passwordsDoNotMatch");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    setSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      navigate({ to: "/profile", replace: true });
      return;
    }

    setCheckEmail(true);
  }

  if (checkEmail) {
    return (
      <AuthCard
        eyebrow={t("auth.almostThere")}
        title={t("auth.confirmEmailTitle")}
        description={t("auth.confirmEmailDescription", { email: email.trim() })}
        footer={
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("auth.goToSignIn")}
          </Link>
        }
      >
        <FormAlert tone="success">{t("auth.accountCreatedSuccess")}</FormAlert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow={t("auth.joinCommunity")}
      title={t("auth.createYourAccount")}
      description={t("auth.createAccountDescription")}
      footer={
        <>
          {t("auth.haveAccount")}{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t("auth.signIn")}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <Field id="fullName" label={t("auth.fullName")} error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("auth.fullNamePlaceholder")}
            aria-invalid={Boolean(errors.fullName)}
            className={inputClasses(Boolean(errors.fullName))}
          />
        </Field>

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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordMinPlaceholder")}
            aria-invalid={Boolean(errors.password)}
            className={inputClasses(Boolean(errors.password))}
          />
        </Field>

        <Field id="confirmPassword" label={t("auth.confirmPassword")} error={errors.confirmPassword}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            aria-invalid={Boolean(errors.confirmPassword)}
            className={inputClasses(Boolean(errors.confirmPassword))}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? t("auth.creatingAccount") : t("auth.createAccount")}
        </Button>
      </form>
    </AuthCard>
  );
}
