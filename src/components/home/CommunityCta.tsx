import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/AppButton";
import { useT } from "@/lib/i18n";

function RouteMotif() {
  return (
    <svg
      viewBox="0 0 480 380"
      className="h-auto w-full max-w-[480px] text-forest"
      fill="none"
      aria-hidden="true"
    >
      <g opacity="0.16" stroke="currentColor" strokeWidth="1">
        <ellipse cx="250" cy="200" rx="200" ry="140" />
        <ellipse cx="250" cy="200" rx="160" ry="110" />
        <ellipse cx="250" cy="200" rx="120" ry="82" />
        <ellipse cx="250" cy="200" rx="80" ry="54" />
        <ellipse cx="250" cy="200" rx="42" ry="28" />
      </g>
      <path
        d="M40 300C120 250 140 150 230 140C320 130 330 70 420 82"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
        className="text-accent"
        opacity="0.75"
      />
      <circle cx="40" cy="300" r="3.5" fill="currentColor" className="text-forest" opacity="0.5" />
      <g className="text-accent">
        <circle cx="420" cy="82" r="6" fill="currentColor" />
        <circle cx="420" cy="82" r="13" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="1" opacity="0.35">
        <path d="M60 60v22M49 71h22" />
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
          <div className="flex justify-center lg:justify-end">
            <RouteMotif />
          </div>
        </div>
      </div>
    </section>
  );
}
