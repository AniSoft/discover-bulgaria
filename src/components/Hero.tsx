import { Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-bulgaria.jpg";
import { SearchBar } from "@/components/SearchBar";

const quickCategories = ["Hidden Gems", "Nature", "Mountains", "Sea", "Culture"];

export function Hero() {
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
          <h1 className="text-4xl leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl">
            Discover Bulgaria
          </h1>
          <p className="mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">
            Hidden places. Local stories. Unforgettable experiences.
          </p>

          <SearchBar className="mt-9 max-w-2xl" id="hero-search" />

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {quickCategories.map((category) => (
              <li key={category}>
                <Link
                  to="/categories"
                  className="inline-flex rounded-full border border-primary-foreground/40 px-4 py-2 text-sm text-primary-foreground transition-colors duration-250 hover:bg-primary-foreground/15"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
