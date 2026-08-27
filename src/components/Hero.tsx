import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bulgaria.jpg";
import { SearchBar } from "@/components/SearchBar";
import { ButtonLink } from "@/components/AppButton";
import { cn } from "@/lib/utils";
import { useCategoryLabel, useT } from "@/lib/i18n";

const quickCategories = ["Hidden Gems", "Nature", "Mountains", "Sea", "History & Culture"];

type Props = {
  query: string;
  activeCategory: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
};

export function Hero({ query, activeCategory, onSearch, onCategory }: Props) {
  const t = useT();
  const categoryLabel = useCategoryLabel();

  return (
    <section className="relative flex min-h-[620px] items-end overflow-hidden md:h-[88vh] md:max-h-[980px]">
      <img
        src={heroImage}
        alt="Misty mountain ridges in Bulgaria glowing at sunrise"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover object-[50%_45%]"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-overlay/85 via-overlay/45 to-overlay/35"
        aria-hidden="true"
      />

      {/* Expedition metadata along the right edge */}
      <ul
        className="absolute top-1/2 right-6 hidden -translate-y-1/2 flex-col items-end gap-6 text-primary-foreground/70 lg:flex"
        aria-hidden="true"
      >
        {[t("home.heroMetaCountry"), "42.7° N", t("home.heroMetaRange")].map((item) => (
          <li key={item} className="eyebrow [writing-mode:vertical-rl]">
            {item}
          </li>
        ))}
      </ul>

      <div className="container-page relative w-full pt-32 pb-14 md:pb-20">
        <div className="max-w-4xl">
          <p className="flex items-center gap-3 text-primary-foreground/80">
            <span className="h-px w-10 bg-current" aria-hidden="true" />
            <span className="eyebrow">{t("home.heroEyebrow")}</span>
          </p>

          <h1 className="mt-6 max-w-3xl text-[2.5rem] leading-[1.02] text-primary-foreground sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            {t("home.heroTitle")}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            {t("home.heroSubtitle")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink to="/" hash="places" variant="ivory" size="lg">
              {t("home.heroCtaPrimary")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/categories" variant="onImage" size="lg">
              {t("home.heroCtaSecondary")}
            </ButtonLink>
          </div>

          <SearchBar className="mt-10 max-w-2xl" id="hero-search" value={query} onSearch={onSearch} />

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {quickCategories.map((category) => {
              const active = category === activeCategory;
              return (
                <li key={category}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onCategory(category)}
                    className={cn(
                      "eyebrow border-b pb-1 transition-colors duration-300",
                      active
                        ? "border-primary-foreground text-primary-foreground"
                        : "border-transparent text-primary-foreground/70 hover:border-primary-foreground/60 hover:text-primary-foreground",
                    )}
                  >
                    {categoryLabel(category)}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
