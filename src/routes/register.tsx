import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthCard, Field, FormAlert, inputClasses } from "@/components/auth/AuthCard";
import { Button } from "@/components/AppButton";
import { supabase } from "@/integrations/supabase/client";

const title = "Create Account — Discover Bulgaria";
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
    if (!fullName.trim()) next.fullName = "Full name is required.";
    else if (fullName.trim().length > 80) next.fullName = "Full name must be under 80 characters.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Use at least 6 characters.";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";
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
        eyebrow="Almost there"
        title="Confirm your email"
        description={`We sent a confirmation link to ${email.trim()}. Open it to activate your account, then sign in.`}
        footer={
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Go to sign in
          </Link>
        }
      >
        <FormAlert tone="success">
          Your account has been created. The confirmation email may take a minute to arrive.
        </FormAlert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Join the community"
      title="Create your account"
      description="Save the places you love and share the ones only locals know."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <Field id="fullName" label="Full name" error={errors.fullName}>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Anita Nikolova"
            aria-invalid={Boolean(errors.fullName)}
            className={inputClasses(Boolean(errors.fullName))}
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className={inputClasses(Boolean(errors.email))}
          />
        </Field>

        <Field id="password" label="Password" error={errors.password}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            aria-invalid={Boolean(errors.password)}
            className={inputClasses(Boolean(errors.password))}
          />
        </Field>

        <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            aria-invalid={Boolean(errors.confirmPassword)}
            className={inputClasses(Boolean(errors.confirmPassword))}
          />
        </Field>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}
