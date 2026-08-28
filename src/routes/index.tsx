import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { EditorialIntro } from "@/components/home/EditorialIntro";
import { CinematicVideo } from "@/components/home/CinematicVideo";
import { CategorySection } from "@/components/home/CategorySection";
import { ExplorePlaces } from "@/components/home/ExplorePlaces";
import { LocalSecrets } from "@/components/home/LocalSecrets";
import { CommunityCta } from "@/components/home/CommunityCta";
import { readLocale } from "@/lib/i18n/locale";
import { HOME_SEO, SITE_NAME, SITE_URL, jsonLd, seo } from "@/lib/seo";

type HomeSearch = { q?: string; category?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    const q = typeof search["q"] === "string" ? search["q"].slice(0, 100).trim() : "";
    const category = typeof search["category"] === "string" ? search["category"].trim() : "";
    return {
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
    };
  },
  loaderDeps: ({ search }) => ({ q: search.q ?? "", category: search.category ?? "" }),
  // Search / filter permutations are thin duplicates of the home page, so they
  // stay crawlable but out of the index.
  loader: ({ deps }) => ({
    locale: readLocale(),
    filtered: Boolean(deps.q || deps.category),
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? "en";
    const copy = HOME_SEO[locale];
    const base = seo({
      title: copy.title,
      description: copy.description,
      path: "/",
      ...(loaderData?.filtered ? { noindex: true, robots: "noindex, follow" } : {}),
    });
    return {
      ...base,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
          inLanguage: ["en", "bg"],
          creator: { "@type": "Organization", name: "AniDigit", url: "https://www.anidigit.com/" },
        }),
      ],
    };
  },
  component: Index,
});


function Index() {
  const { q = "", category = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  const setSearch = (next: HomeSearch) =>
    navigate({ search: next, hash: "places", resetScroll: false });

  return (
    <>
      <Hero
        query={q}
        activeCategory={category}
        onSearch={(value) => setSearch({ ...(value ? { q: value } : {}), ...(category ? { category } : {}) })}
        onCategory={(value) =>
          setSearch({ ...(q ? { q } : {}), ...(value === category ? {} : { category: value }) })
        }
      />
      <EditorialIntro />
      <CategorySection />
      <ExplorePlaces q={q} category={category} onReset={() => navigate({ search: {}, resetScroll: false })} />
      <CinematicVideo />
      <LocalSecrets />
      <CommunityCta />
    </>
  );
}
