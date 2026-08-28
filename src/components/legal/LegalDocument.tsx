import { useLocale } from "@/lib/i18n";
import { openCookieSettings } from "@/components/Analytics";
import { LEGAL_UPDATED, type LegalDoc } from "@/lib/legal/content";

/**
 * Editorial reading layout for the legal pages: generous measure, calm
 * hierarchy, semantic headings. No decorative effects that fight readability.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  const { locale, t } = useLocale();

  return (
    <div className="container-page pt-32 pb-24 md:pt-36">
      <article className="mx-auto max-w-2xl">
        <header>
          <h1 className="text-4xl leading-tight text-foreground sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {LEGAL_UPDATED[locale]}
          </p>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">{doc.intro}</p>
        </header>

        <div className="topo-rule mt-10 text-primary/40" aria-hidden="true" />

        <div className="mt-10 space-y-12">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl leading-snug text-foreground">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-5 text-base leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.7em] before:size-1.5 before:rounded-full before:bg-accent"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-[var(--radius-card)] border border-border bg-card p-6">
          <button
            type="button"
            onClick={openCookieSettings}
            className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-250 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t("consent.cookieSettings")}
          </button>
        </div>
      </article>
    </div>
  );
}
