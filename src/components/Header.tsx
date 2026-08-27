import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useT, type MessageKey } from "@/lib/i18n";

const navLinks = [
  { key: "nav.explore" as MessageKey, to: "/" },
  { key: "nav.categories" as MessageKey, to: "/categories" },
  { key: "nav.addPlace" as MessageKey, to: "/places/new" },
  { key: "nav.favorites" as MessageKey, to: "/favorites" },
] as const;

const userMenuLinks = [
  { key: "nav.profile" as MessageKey, to: "/profile" },
  { key: "nav.myPlaces" as MessageKey, to: "/my-places" },
  { key: "nav.favorites" as MessageKey, to: "/favorites" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, fullName, initials, isAdmin, signOut } = useAuth();
  const t = useT();
  const navigate = useNavigate();

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

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/", replace: true });
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-250",
        transparent
          ? "bg-linear-to-b from-overlay/55 via-overlay/20 to-transparent"
          : "border-b border-border bg-background/95 backdrop-blur-sm",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link
          to="/"
          className={cn(
            "font-display text-2xl tracking-tight transition-colors duration-250 sm:text-[1.7rem]",
            transparent ? "text-primary-foreground drop-shadow-[0_1px_6px_oklch(0_0_0/45%)]" : "text-primary",
          )}
        >
          Discover Bulgaria
        </Link>

        <nav aria-label={t("nav.main")} className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className={cn(
                "text-base font-medium transition-colors duration-250",
                transparent
                  ? "text-primary-foreground hover:text-primary-foreground/80 drop-shadow-[0_1px_4px_oklch(0_0_0/45%)]"
                  : "text-foreground/80 hover:text-primary",
              )}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: transparent ? "text-primary-foreground" : "text-primary" }}
            >
              {t(link.key)}
            </Link>
          ))}

          {user ? (
            <UserMenu
              transparent={transparent}
              initials={initials}
              isAdmin={isAdmin}
              fullName={fullName || user.email || t("nav.account")}
              onSignOut={handleSignOut}
            />
          ) : (
            <Link
              to="/login"
              search={{}}
              className={cn(
                "rounded-[var(--radius-button)] px-5 py-2.5 text-[15px] font-medium transition-colors duration-250",
                transparent
                  ? "border border-primary-foreground/70 bg-overlay/25 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/15"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover",
              )}
            >
              {t("nav.signIn")}
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? t("common.closeMenu") : t("common.openMenu")}
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
          aria-label={t("nav.mobile")}
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  to={link.to}
                  className="block border-b border-border/60 py-4 text-base font-medium text-foreground"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li className="flex items-center gap-3 border-b border-border/60 py-4">
                  <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </span>
                  <span className="truncate text-sm text-muted-foreground">
                    {fullName || user.email}
                  </span>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block border-b border-border/60 py-4 text-base font-medium text-foreground"
                  >
                    Profile
                  </Link>
                </li>
                {isAdmin ? (
                  <li>
                    <Link
                      to="/admin"
                      className="block border-b border-border/60 py-4 text-base font-medium text-foreground"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                ) : null}
                <li>
                  <Link
                    to="/my-places"
                    className="block border-b border-border/60 py-4 text-base font-medium text-foreground"
                  >
                    My Places
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block w-full py-4 text-left text-base font-medium text-accent"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  search={{}}
                  className="block py-4 text-base font-medium text-foreground"
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function UserMenu({
  transparent,
  initials,
  isAdmin,
  fullName,
  onSignOut,
}: {
  transparent: boolean;
  initials: string;
  isAdmin: boolean;
  fullName: string;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("nav.accountMenu", { name: fullName })}
        className={cn(
          "flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors duration-250",
          transparent
            ? "border border-primary-foreground/60 bg-overlay/25 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/15"
            : "border border-border bg-card text-foreground hover:bg-secondary",
        )}
      >
        <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initials}
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-3 w-56 overflow-hidden rounded-[var(--radius-card)] border border-border bg-card py-2 shadow-lift"
        >
          <div className="flex items-center gap-2 px-4 pb-2">
            <p className="truncate text-xs text-muted-foreground">{fullName}</p>
            {isAdmin ? (
              <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                Admin
              </span>
            ) : null}
          </div>
          {isAdmin ? (
            <Link
              to="/admin"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
            >
              {t("nav.adminDashboard")}
            </Link>
          ) : null}
          {userMenuLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary"
            >
              {t(link.key)}
            </Link>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="mt-1 block w-full border-t border-border px-4 py-2.5 text-left text-sm font-medium text-accent hover:bg-secondary"
          >
            {t("nav.signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
