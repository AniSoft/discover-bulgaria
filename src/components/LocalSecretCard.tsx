import { Quote } from "lucide-react";
import type { LocalSecret } from "@/data/localSecrets";

export function LocalSecretCard({ secret }: { secret: LocalSecret }) {
  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-border bg-secondary p-6">
      <Quote className="size-6 text-accent" aria-hidden="true" />
      <h3 className="mt-4 text-xl leading-snug text-foreground">{secret.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{secret.text}</p>
      <footer className="mt-6 border-t border-accent/25 pt-4 text-sm">
        <p className="font-medium text-foreground">{secret.author}</p>
        <p className="text-muted-foreground">{secret.location}</p>
      </footer>
    </article>
  );
}
