import heroImage from "@/assets/hero-bulgaria.jpg";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/utils";

const quickCategories = ["Hidden Gems", "Nature", "Mountains", "Sea", "History & Culture"];

type Props = {
  query: string;
  activeCategory: string;
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
};

export function Hero({ query, activeCategory, onSearch, onCategory }: Props) {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden md:h-[82vh]">
      <img
        src={heroImage}
        alt="Misty mountain ridges in Bulgaria glowing at sunrise"
        width={1920}
        height={1280}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-overlay/55" aria-hidden="true" />

      <div className="container-page relative pt-28 pb-16 md:pt-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
            Discover Bulgaria
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Hidden places. Local stories. Unforgettable experiences.
          </p>

          <SearchBar className="mt-9 max-w-2xl" id="hero-search" value={query} onSearch={onSearch} />

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {quickCategories.map((category) => {
              const active = category === activeCategory;
              return (
                <li key={category}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onCategory(category)}
                    className={cn(
                      "inline-flex rounded-full border border-primary-foreground/40 px-4 py-2 text-sm text-primary-foreground transition-colors duration-250 hover:bg-primary-foreground/15",
                      active && "border-primary-foreground bg-primary-foreground/25",
                    )}
                  >
                    {category}
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
