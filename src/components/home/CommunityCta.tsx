import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";
import { useT } from "@/lib/i18n";

// Stylized editorial silhouette of Bulgaria — conceptual cartography, not a literal map.
const BG_OUTLINE =
  "M45 55C70 40 95 60 120 50C150 42 175 60 205 55C240 50 260 65 295 55C330 48 360 60 395 55C410 90 405 120 415 150C410 190 420 230 405 265C370 290 340 275 310 285C275 295 250 278 220 288C190 296 170 280 145 290C120 270 130 245 115 220C100 195 115 170 100 145C85 120 95 90 70 75C55 66 48 60 45 55Z";

// Conceptual route: Black Sea coast → Rhodopes → Northwest rocks.
const ROUTE = "M398 180C340 210 300 250 225 262C165 272 130 200 108 140C100 118 98 102 96 96";

const MARKERS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 398, y: 180 },
  { x: 225, y: 262 },
  { x: 96, y: 96 },
];

function MapMotif() {
  return (
    <svg
      viewBox="0 0 480 380"
      className="h-auto w-full max-w-[480px]"
      fill="none"
      aria-hidden="true"
    >
      {/* Topographic contour bands — soft sage / moss */}
      <g stroke="hsl(var(--stone))" strokeWidth="1" opacity="0.55" fill="none">
        <path d="M-20 330C80 310 160 345 260 325C360 305 430 340 500 320" />
        <path d="M-20 352C90 332 170 366 270 346C370 326 440 360 500 342" />
        <path d="M-20 22C70 40 150 8 250 26C350 44 430 12 500 30" opacity="0.7" />
      </g>

      {/* Inner terrain contours echoing the silhouette */}
      <g stroke="hsl(var(--stone))" strokeWidth="1" fill="none" opacity="0.6">
        <path
          d={BG_OUTLINE}
          transform="translate(230 172) scale(0.82) translate(-230 -172)"
        />
        <path
          d={BG_OUTLINE}
          transform="translate(230 172) scale(0.62) translate(-230 -172)"
          opacity="0.65"
        />
        <path
          d={BG_OUTLINE}
          transform="translate(230 172) scale(0.4) translate(-230 -172)"
          opacity="0.45"
        />
      </g>

      {/* Bulgaria silhouette — deep forest */}
      <path
        d={BG_OUTLINE}
        stroke="hsl(var(--forest))"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="hsl(var(--forest) / 0.045)"
      />

      {/* Expedition route — terracotta */}
      <path
        d={ROUTE}
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        strokeDasharray="2 7"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Destination markers */}
      {MARKERS.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r="9" stroke="hsl(var(--accent))" strokeWidth="1" opacity="0.45" />
          <circle cx={m.x} cy={m.y} r="3" fill="hsl(var(--accent))" />
        </g>
      ))}

      {/* Minimal compass rose */}
      <g transform="translate(56 326)" opacity="0.7">
        <circle r="14" stroke="hsl(var(--forest))" strokeWidth="1" opacity="0.6" />
        <path d="M0 -10L3 0L0 10L-3 0Z" fill="hsl(var(--accent))" />
        <path d="M-10 0L0 3L10 0L0 -3Z" fill="hsl(var(--forest))" opacity="0.55" />
      </g>

      {/* Coordinate ticks */}
      <g stroke="hsl(var(--forest))" strokeWidth="1" opacity="0.35">
        <path d="M442 300v20M432 310h20" />
      </g>
    </svg>
  );
}

export function CommunityCta() {
  const t = useT();
  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-[1280px] px-5 lg:px-12">
        <div className="topo-rule text-stone" />
        <div className="grid grid-cols-1 items-center gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20 lg:py-36">
          <div className="max-w-xl">
            <p className="mb-5 flex items-center gap-3 text-accent">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              <span className="eyebrow">{t("communityCta.eyebrow")}</span>
            </p>
            <h2 className="text-[2.15rem] leading-[1.05] text-foreground sm:text-5xl lg:text-[3.75rem]">
              {t("communityCta.title")}
            </h2>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              {t("communityCta.description")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink to="/places/new" variant="primary" size="lg" className="group">
                {t("communityCta.addPlace")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </ButtonLink>
              <span className="eyebrow text-muted-foreground/80">{t("communityCta.note")}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 lg:items-end">
            <MapMotif />
            <p className="eyebrow max-w-[340px] text-center text-muted-foreground/80 lg:text-right">
              {t("communityCta.mapLabel")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
