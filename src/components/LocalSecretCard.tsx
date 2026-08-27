import { Quote } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import type { LocalSecret, LocalizedString } from "@/data/localSecrets";

function pickLocalized(value: LocalizedString, locale: "en" | "bg") {
  return value[locale] || value.en;
}

export function LocalSecretCard({ secret }: { secret: LocalSecret }) {
  const { locale } = useLocale();
  const title = pickLocalized(secret.title, locale);
  const text = pickLocalized(secret.text, locale);
  const location = pickLocalized(secret.location, locale);

  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-secondary p-6">
      <Quote className="size-6 text-accent" aria-hidden="true" />
      <h3 className="mt-4 text-xl leading-snug text-foreground">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{text}</p>
      <div className="mt-6 border-t border-accent/25 pt-4 text-sm">
        <p className="text-muted-foreground">{location}</p>
      </div>
    </article>
  );
}
