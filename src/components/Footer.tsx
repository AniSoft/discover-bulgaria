import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
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
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-primary">Discover Bulgaria</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.titleKey} aria-label={t(column.titleKey)}>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {t(column.titleKey)}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      search={{}}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-250 hover:text-primary hover:underline"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {t("footer.creditBeforeLink")}
            <a
              href="https://www.anidigit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/90 underline-offset-4 transition-colors duration-250 hover:text-primary hover:underline"
            >
              AniDigit
            </a>
            {t("footer.creditSuffix")}
          </p>
        </div>
      </div>
    </footer>
  );
}
