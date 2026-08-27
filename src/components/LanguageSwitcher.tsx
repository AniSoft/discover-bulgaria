import { cn } from "@/lib/utils";
import { useLocale, type Locale } from "@/lib/i18n";

const languages: { value: Locale; label: string; ariaLabel: string }[] = [
  { value: "en", label: "EN", ariaLabel: "Switch language to English" },
  { value: "bg", label: "BG", ariaLabel: "Превключи езика на български" },
];

export function LanguageSwitcher({ transparent = false }: { transparent?: boolean }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex items-center gap-2 text-sm" aria-label="Language">
      {languages.map((language, index) => (
        <span key={language.value} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className={cn("select-none", transparent ? "text-primary-foreground/50" : "text-border")}>
              |
            </span>
          ) : null}
          <button
            type="button"
            lang={language.value}
            onClick={() => setLocale(language.value)}
            aria-label={language.ariaLabel}
            aria-current={locale === language.value ? "true" : undefined}
            className={cn(
              "underline-offset-4 transition-colors duration-250",
              locale === language.value
                ? cn("font-semibold", transparent ? "text-primary-foreground" : "text-foreground")
                : cn("hover:underline", transparent ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-foreground/60 hover:text-foreground"),
            )}
          >
            {language.label}
          </button>
        </span>
      ))}
    </div>
  );
}
