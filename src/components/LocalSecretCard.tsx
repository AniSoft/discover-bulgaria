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
    <article className="flex h-full flex-col border-t border-primary-foreground/20 pt-7">
      <p className="eyebrow text-primary-foreground/50">{location}</p>
      <h3 className="mt-4 text-2xl leading-[1.15] text-primary-foreground">{title}</h3>
      <p className="mt-4 flex-1 text-sm leading-[1.85] text-primary-foreground/70">{text}</p>
    </article>
  );
}
