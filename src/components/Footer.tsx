import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Discover",
    links: [
      { label: "Explore Places", to: "/" as const },
      { label: "Categories", to: "/categories" as const },
      { label: "Hidden Gems", to: "/categories" as const },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Add a Place", to: "/places/new" as const },
      { label: "Sign In", to: "/login" as const },
      { label: "Register", to: "/register" as const },
    ],
  },
  {
    title: "Discover Bulgaria",
    links: [
      { label: "About", to: "/" as const },
      { label: "Contact", to: "/" as const },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl text-primary">Discover Bulgaria</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Hidden places, local stories and unforgettable experiences across Bulgaria.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      search={{}}
                      className="text-sm text-muted-foreground underline-offset-4 transition-colors duration-250 hover:text-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">© 2026 Discover Bulgaria</p>
          <div
            className="flex items-center gap-2 text-sm"
            aria-label="Language selector (coming soon)"
          >
            <span className="font-medium text-foreground">English</span>
            <span aria-hidden="true" className="text-border">
              |
            </span>
            <span className="text-muted-foreground/70">Български</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
