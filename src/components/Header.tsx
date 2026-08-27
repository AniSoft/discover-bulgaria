import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Explore", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Add a Place", to: "/places/new" },
  { label: "Favorites", to: "/favorites" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-250",
        transparent ? "bg-transparent" : "border-b border-border bg-background/95 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link
          to="/"
          className={cn(
            "font-display text-xl tracking-tight transition-colors duration-250 sm:text-2xl",
            transparent ? "text-primary-foreground" : "text-primary",
          )}
        >
          Discover Bulgaria
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                "text-sm font-medium transition-colors duration-250",
                transparent
                  ? "text-primary-foreground/90 hover:text-primary-foreground"
                  : "text-foreground/80 hover:text-primary",
              )}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: transparent ? "text-primary-foreground" : "text-primary" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className={cn(
              "rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-medium transition-colors duration-250",
              transparent
                ? "border border-primary-foreground/60 text-primary-foreground hover:bg-primary-foreground/10"
                : "bg-primary text-primary-foreground hover:bg-primary-hover",
            )}
          >
            Sign In
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className={cn(
            "grid size-11 place-items-center rounded-[var(--radius-button)] md:hidden",
            transparent ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {[...navLinks, { label: "Sign In", to: "/login" } as const].map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="block border-b border-border/60 py-4 text-base font-medium text-foreground last:border-0"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
