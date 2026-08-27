import { Link } from "@tanstack/react-router";
import { useT, type MessageKey } from "@/lib/i18n";

const columns = [
  {
    titleKey: "footer.discover" as MessageKey,
    links: [
      { labelKey: "footer.explorePlaces" as MessageKey, to: "/" as const },
      { labelKey: "nav.categories" as MessageKey, to: "/categories" as const },
      { labelKey: "footer.hiddenGems" as MessageKey, to: "/categories" as const },
    ],
  },
  {
    titleKey: "footer.community" as MessageKey,
    links: [
      { labelKey: "nav.addPlace" as MessageKey, to: "/places/new" as const },
      { labelKey: "nav.signIn" as MessageKey, to: "/login" as const },
      { labelKey: "footer.register" as MessageKey, to: "/register" as const },
    ],
  },
  {
    titleKey: "common.brand" as MessageKey,
    links: [
      { labelKey: "footer.about" as MessageKey, to: "/" as const },
      { labelKey: "footer.contact" as MessageKey, to: "/" as const },
    ],
  },
];

export function Footer() {
  const t = useT();

  return (
    <footer className="mt-24 bg-forest-deep text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        <p className="font-display text-3xl leading-tight text-primary-foreground/95 sm:text-4xl md:text-5xl md:max-w-2xl">
          {t("footer.closingLine")}
        </p>
        <div className="topo-rule mt-10 text-primary-foreground" aria-hidden="true" />

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl">
              Discover <span className="italic">Bulgaria</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-foreground/65">
              {t("footer.tagline")}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.titleKey} aria-label={t(column.titleKey)}>
              <h2 className="eyebrow text-primary-foreground/55">{t(column.titleKey)}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      search={{}}
                      className="text-sm text-primary-foreground/80 underline-offset-4 transition-colors duration-300 hover:text-primary-foreground hover:underline"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-wide text-primary-foreground/55">
            {t("footer.creditBeforeLink")}
            <a
              href="https://www.anidigit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/85 underline-offset-4 transition-colors duration-300 hover:text-primary-foreground hover:underline"
            >
              AniDigit
            </a>
            {t("footer.creditSuffix")}
          </p>
          <p className="eyebrow text-primary-foreground/40">42.7° N · 25.4° E</p>
        </div>
      </div>
    </footer>
  );
}
